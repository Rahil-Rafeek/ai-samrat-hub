import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom Metrics for AI SAMRAT Assessment Hub
export const successfulExams = new Counter('successful_exams');
export const failedExams = new Counter('failed_exams');
export const examSubmitLatency = new Trend('exam_submit_latency_ms');
export const autosaveLatency = new Trend('autosave_latency_ms');
export const passRate = new Rate('exam_pass_rate');

export const options = {
  scenarios: {
    concurrent_100_participants: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 25 },   // Warm-up ramp
        { duration: '1m', target: 50 },    // Ramp to 50 concurrent
        { duration: '1m', target: 100 },   // Peak at 100 simultaneous candidates
        { duration: '2m', target: 100 },   // Sustained 100 concurrent test takers
        { duration: '30s', target: 0 },    // Cool-down ramp down
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],         // Less than 1% errors
    http_req_duration: ['p(95)<800'],       // 95% of requests under 800ms
    autosave_latency_ms: ['p(95)<300'],     // Autosaves under 300ms
    exam_submit_latency_ms: ['p(95)<1500'], // Final submit + scoring under 1.5s
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:8080/api';

export default function () {
  const vuId = __VU;
  const employeeIndex = ((vuId - 1) % 5) + 1; // 1 to 5 mapped to emp001..emp005
  const username = `emp00${employeeIndex}`;
  const password = 'Emp@1234';

  const headers = { 'Content-Type': 'application/json' };

  // 1. Authenticate Employee
  const loginPayload = JSON.stringify({ username, password });
  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, { headers });

  const loginOk = check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'jwt token present': (r) => r.json('token') !== undefined,
  });

  if (!loginOk) {
    failedExams.add(1);
    return;
  }

  const token = loginRes.json('token');
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // 2. Fetch Available Examinations
  const examsRes = http.get(`${BASE_URL}/employee/examinations`, { headers: authHeaders });
  check(examsRes, {
    'exams list status is 200': (r) => r.status === 200,
    'exams count >= 6': (r) => r.json().length >= 6,
  });

  const availableExams = examsRes.json();
  if (!availableExams || availableExams.length === 0) return;

  // Pick an exam deterministically or randomly
  const selectedExam = availableExams[vuId % availableExams.length];

  // 3. Start Examination Attempt (Triggers backend paper snapshot & option randomization)
  const startPayload = JSON.stringify({ examinationId: selectedExam.id });
  const startRes = http.post(`${BASE_URL}/employee/examinations/start`, startPayload, { headers: authHeaders });

  const startOk = check(startRes, {
    'start exam status is 200': (r) => r.status === 200,
    'attempt UUID present': (r) => r.json('attemptUuid') !== undefined,
    'exactly 50 questions assigned': (r) => r.json('questions').length === 50,
  });

  if (!startOk) {
    failedExams.add(1);
    return;
  }

  const attemptUuid = startRes.json('attemptUuid');
  const questions = startRes.json('questions');

  // 4. Simulate Candidate Answering 50 Questions with Autosaves & Heartbeats
  const options = ['A', 'B', 'C', 'D'];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const pickedOption = options[Math.floor(Math.random() * options.length)];

    const savePayload = JSON.stringify({
      displayOrder: q.displayOrder,
      selectedOption: pickedOption,
      isMarkedForReview: i % 7 === 0, // Mark every 7th question for review
    });

    const t0 = Date.now();
    const saveRes = http.post(`${BASE_URL}/employee/examinations/${attemptUuid}/autosave`, savePayload, {
      headers: authHeaders,
    });
    autosaveLatency.add(Date.now() - t0);

    check(saveRes, {
      'autosave status is 200': (r) => r.status === 200,
      'autosave acknowledged': (r) => r.json('success') === true,
    });

    // Send occasional heartbeats
    if (i % 10 === 0) {
      http.post(`${BASE_URL}/employee/examinations/${attemptUuid}/heartbeat`, null, { headers: authHeaders });
    }

    // Realistic human cadence between questions (100ms - 300ms in load test)
    sleep(0.15);
  }

  // 5. Submit Examination Attempt
  const submitStart = Date.now();
  const submitRes = http.post(`${BASE_URL}/employee/examinations/${attemptUuid}/submit`, null, {
    headers: authHeaders,
  });
  const submitDuration = Date.now() - submitStart;
  examSubmitLatency.add(submitDuration);

  const submitOk = check(submitRes, {
    'submit status is 200': (r) => r.status === 200,
    'score computed': (r) => r.json('score') !== undefined,
    'percentage computed': (r) => r.json('percentage') !== undefined,
  });

  if (submitOk) {
    successfulExams.add(1);
    const isPassed = submitRes.json('isPassed');
    passRate.add(isPassed ? 1 : 0);

    const certCode = submitRes.json('certificateCode');
    if (certCode) {
      // 6. Public Certificate Verification Portal Check
      const verifyRes = http.get(`${BASE_URL}/certificates/verify/${certCode}`);
      check(verifyRes, {
        'public verify is 200': (r) => r.status === 200,
        'certificate is valid': (r) => r.json('isValid') === true,
      });
    }
  } else {
    failedExams.add(1);
  }

  sleep(1);
}

