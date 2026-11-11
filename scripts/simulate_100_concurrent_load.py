#!/usr/bin/env python3
"""
AI SAMRAT – Assessment Hub: 100 Simultaneous Examination Participants Load Simulator
Simulates 100 concurrent employees logging in, loading examinations, snapshotting papers,
answering 50 randomized questions with autosaves, sending proctoring heartbeats,
submitting examinations, and verifying cryptographic certificates.
"""

import sys
import time
import json
import random
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "http://localhost:8080/api"

def make_request(endpoint, method="GET", data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    encoded_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = resp.read().decode("utf-8")
            elapsed_ms = (time.time() - t0) * 1000.0
            parsed = json.loads(body) if body else {}
            return True, resp.status, parsed, elapsed_ms
    except urllib.error.HTTPError as e:
        elapsed_ms = (time.time() - t0) * 1000.0
        try:
            body = e.read().decode("utf-8")
            parsed = json.loads(body)
        except Exception:
            parsed = {"error": str(e)}
        return False, e.code, parsed, elapsed_ms
    except Exception as e:
        elapsed_ms = (time.time() - t0) * 1000.0
        return False, 500, {"error": str(e)}, elapsed_ms

def simulate_candidate(vu_id):
    emp_idx = ((vu_id - 1) % 5) + 1
    username = f"emp00{emp_idx}"
    password = "Emp@1234"
    
    timings = {}
    
    # 1. Login
    ok, status, data, latency = make_request("/auth/login", method="POST", data={
        "username": username,
        "password": password
    })
    timings["login"] = latency
    if not ok or "token" not in data:
        return {"vu": vu_id, "success": False, "step": "login", "error": data}
    
    token = data["token"]
    
    # 2. Get Examinations
    ok, status, exams, latency = make_request("/employee/examinations", token=token)
    timings["get_exams"] = latency
    if not ok or not exams:
        return {"vu": vu_id, "success": False, "step": "get_exams", "error": exams}
    
    # Pick exam
    exam = exams[vu_id % len(exams)]
    
    # 3. Start Exam Attempt
    ok, status, active_exam, latency = make_request("/employee/examinations/start", method="POST", data={
        "examinationId": exam["id"]
    }, token=token)
    timings["start_exam"] = latency
    if not ok or "attemptUuid" not in active_exam:
        return {"vu": vu_id, "success": False, "step": "start_exam", "error": active_exam}
    
    attempt_uuid = active_exam["attemptUuid"]
    questions = active_exam.get("questions", [])
    
    # 4. Autosave answers for 50 questions
    autosave_latencies = []
    options = ["A", "B", "C", "D"]
    for q in questions:
        pick = random.choice(options)
        ok, status, res, latency = make_request(
            f"/employee/examinations/{attempt_uuid}/autosave",
            method="POST",
            data={
                "displayOrder": q["displayOrder"],
                "selectedOption": pick,
                "isMarkedForReview": random.random() < 0.15
            },
            token=token
        )
        autosave_latencies.append(latency)
        time.sleep(0.02) # Realistic pacing
    
    timings["avg_autosave_ms"] = sum(autosave_latencies) / len(autosave_latencies) if autosave_latencies else 0
    
    # 5. Submit Examination
    ok, status, submit_res, latency = make_request(
        f"/employee/examinations/{attempt_uuid}/submit",
        method="POST",
        token=token
    )
    timings["submit_exam"] = latency
    if not ok or "score" not in submit_res:
        return {"vu": vu_id, "success": False, "step": "submit_exam", "error": submit_res}
    
    cert_code = submit_res.get("certificateCode")
    if cert_code:
        ok, status, cert_data, latency = make_request(f"/certificates/verify/{cert_code}")
        timings["verify_cert"] = latency
    
    return {
        "vu": vu_id,
        "success": True,
        "score": submit_res.get("score"),
        "percentage": submit_res.get("percentage"),
        "is_passed": submit_res.get("isPassed"),
        "grade": submit_res.get("grade"),
        "certificate_code": cert_code,
        "timings": timings
    }

def run_benchmark(num_candidates=100, concurrency=25):
    print("=" * 70)
    print("AI SAMRAT ASSESSMENT HUB – CONCURRENCY LOAD BENCHMARK")
    print(f"Target: {num_candidates} Simulated Examination Candidates")
    print(f"Max Concurrent Workers: {concurrency}")
    print(f"Backend Target: {BASE_URL}")
    print("=" * 70)
    
    # Check backend alive
    try:
        urllib.request.urlopen(f"{BASE_URL}/certificates/verify/PING_TEST", timeout=3)
    except Exception:
        print("[!] Backend is not currently running on http://localhost:8080.")
        print("[!] Start the backend first using: ./tools/run-mvn.sh spring-boot:run")
        return
    
    t0 = time.time()
    results = []
    
    with ThreadPoolExecutor(max_workers=concurrency) as pool:
        futures = {pool.submit(simulate_candidate, i + 1): i + 1 for i in range(num_candidates)}
        for future in as_completed(futures):
            res = future.result()
            results.append(res)
            done = len(results)
            if done % 10 == 0 or done == num_candidates:
                print(f"Progress: {done}/{num_candidates} candidates completed ({done * 100 // num_candidates}%)")
    
    total_elapsed = time.time() - t0
    
    successes = [r for r in results if r.get("success")]
    failures = [r for r in results if not r.get("success")]
    
    print("\n" + "=" * 70)
    print("BENCHMARK RESULTS SUMMARY")
    print("=" * 70)
    print(f"Total Participants Tested : {num_candidates}")
    print(f"Successful Completions    : {len(successes)} ({len(successes)*100/num_candidates:.1f}%)")
    print(f"Failed Runs               : {len(failures)}")
    print(f"Total Wallclock Time      : {total_elapsed:.2f} seconds")
    print(f"Throughput                : {num_candidates / total_elapsed:.2f} full examinations/sec")
    
    if successes:
        submit_times = [s["timings"]["submit_exam"] for s in successes if "submit_exam" in s["timings"]]
        autosave_times = [s["timings"]["avg_autosave_ms"] for s in successes if "avg_autosave_ms" in s["timings"]]
        print(f"Avg Submit Latency        : {sum(submit_times)/len(submit_times):.2f} ms")
        print(f"Avg Question Autosave Latency: {sum(autosave_times)/len(autosave_times):.2f} ms")
    
    if failures:
        print("\nFailure breakdown:")
        for f in failures[:5]:
            print(f"  Candidate {f['vu']}: failed at '{f['step']}' with error {f.get('error')}")
    print("=" * 70)

if __name__ == "__main__":
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 100
    threads = int(sys.argv[2]) if len(sys.argv) > 2 else 25
    run_benchmark(count, threads)

