export type Role = 'SUPER_ADMIN' | 'EVALUATOR' | 'EMPLOYEE';

export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'TERMINATED_VIOLATION' | 'EXPIRED';

export type EvaluationStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REVISED';

export type CertificateGrade = 'DISTINCTION' | 'ACHIEVEMENT' | 'PARTICIPATION' | 'NONE';

export type CertificateStatus = 'VALID' | 'REVOKED' | 'EXPIRED';

export type ProctoringMode = 'OFF' | 'ON' | 'CALIBRATED';

export interface User {
  username: string;
  fullName: string;
  role: Role;
  userId: number;
  employeeId?: number;
  employeeCode?: string;
  department?: string;
  designation?: string;
  token?: string;
}

export interface QuestionDisplay {
  displayOrder: number;
  questionCode: string;
  subject: string;
  topic: string;
  difficulty: string;
  questionText: string;
  options: Record<string, string>; // {"A": text, "B": text, "C": text, "D": text}
  selectedOption: string | null;
  isMarkedForReview: boolean;
  isVisited: boolean;
}

export interface ActiveExam {
  attemptUuid: string;
  employeeName: string;
  employeeCode: string;
  subject: string;
  setName: string;
  status: AttemptStatus;
  durationMinutes: number;
  remainingSeconds: number;
  startedAt: string;
  expectedEndTime: string;
  totalQuestions: number;
  answeredCount: number;
  markedForReviewCount: number;
  unansweredCount: number;
  marksPerQuestion: number;
  totalMarks: number;
  questions: QuestionDisplay[];
  proctoringMode: ProctoringMode;
  tabSwitchLimit: number;
  fullscreenExitLimit: number;
  currentTabSwitches: number;
  currentFullscreenExits: number;
}

export interface Examination {
  id: number;
  title: string;
  code: string;
  subject: string;
  setName: string;
  durationMinutes: number;
  totalQuestions: number;
  marksPerQuestion: number;
  totalMarks: number;
  passingPercentage: number;
  proctoringMode: ProctoringMode;
  isActive: boolean;
  instructions: string;
}

export interface QuestionReview {
  displayOrder: number;
  questionCode: string;
  subject: string;
  topic: string;
  difficulty: string;
  questionText: string;
  options: Record<string, string>;
  selectedOption: string | null;
  correctOption: string;
  isCorrect: boolean;
  marksAwarded: number;
  maxMarks: number;
  explanation: string;
}

export interface EvaluationAudit {
  id: number;
  reviewerUsername: string;
  reviewerFullName: string;
  previousScore: number;
  revisedScore: number;
  reason: string;
  remarks?: string;
  timestamp: string;
}

export interface SubmissionDetail {
  submissionId: number;
  attemptUuid: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  subject: string;
  setName: string;
  originalScore: number;
  finalScore: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  grade: CertificateGrade;
  evaluationStatus: EvaluationStatus;
  startedAt: string;
  submittedAt: string;
  durationSecondsTaken: number;
  integrityScore: number;
  tabSwitchViolations: number;
  fullscreenExitViolations: number;
  reviewedBy?: string;
  reviewedAt?: string;
  remarks?: string;
  reviews: QuestionReview[];
  audits: EvaluationAudit[];
}

export interface Certificate {
  id?: number;
  certificateCode: string;
  subject: string;
  issueDate: string;
  examDate?: string;
  grade: CertificateGrade;
  gradeDisplayName?: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: CertificateStatus;
  qrCodeBase64?: string;
  pdfPath?: string;
  verificationUrl?: string;
  employeeName?: string;
  employeeCode?: string;
  department?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  revokedAt?: string;
  revocationReason?: string;
}

export interface CertificateVerifyData {
  isValid: boolean;
  certificateCode: string;
  employeeName?: string;
  employeeCode?: string;
  department?: string;
  subject?: string;
  grade?: CertificateGrade;
  gradeDisplayName?: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  issueDate?: string;
  examDate?: string;
  status?: CertificateStatus;
  issuerName?: string;
  directorName?: string;
  directorTitle?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  message: string;
  revokedAt?: string;
  revocationReason?: string;
  qrCodeBase64?: string;
}

export interface LiveParticipant {
  attemptUuid: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  subject: string;
  setName: string;
  status: AttemptStatus;
  remainingSeconds: number;
  totalQuestions: number;
  answeredCount: number;
  webcamActive: boolean;
  screenShareActive: boolean;
  tabSwitchCount: number;
  fullscreenExitCount: number;
  integrityScore: number;
  lastHeartbeatSecondsAgo: number;
  isConnected: boolean;
}

export interface AdminStats {
  totalEmployees: number;
  activeExaminations: number;
  ongoingExamsCount: number;
  completedSubmissions: number;
  pendingEvaluations: number;
  certificatesIssued: number;
  averageScore: number;
  passPercentage: number;
  distinctionCount: number;
  activeProctoringAlerts: number;
  subjectWiseCounts: Record<string, number>;
  subjectWiseAvgScores: Record<string, number>;
  scoreDistribution: Array<{ range: string; count: number }>;
}

export interface AuthResponse {
  token: string;
  tokenType?: string;
  userId: number;
  username: string;
  fullName: string;
  role: Role;
  employeeId?: number;
  employeeCode?: string;
  department?: string;
  designation?: string;
}

export interface SubmitExamResponse {
  attemptUuid: string;
  status: AttemptStatus;
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  grade: CertificateGrade;
  gradeDisplayName?: string;
  certificateCode?: string;
  message: string;
  submissionId?: number;
  employeeName?: string;
  employeeCode?: string;
  subject?: string;
  setName?: string;
  totalQuestions?: number;
  answeredCount?: number;
  correctCount?: number;
  incorrectCount?: number;
  unattemptedCount?: number;
  submittedAt?: string;
  integrityScore?: number;
  certificateUrl?: string;
}

export interface BackupRecord {
  id: number;
  filename: string;
  filepath: string;
  sizeBytes: number;
  backupType: string;
  status: string;
  checksum?: string;
  createdAt: string;
}

export type AccountStatus = 'PENDING_ACTIVATION' | 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
export type ExamEligibility = 'ELIGIBLE' | 'NOT_ASSIGNED' | 'TEMPORARILY_RESTRICTED';

export interface EmployeeDetailDto {
  id: number;
  userId: number;
  employeeCode: string;
  fullName: string;
  email: string;
  department: string;
  designation: string;
  phone?: string;
  accountStatus: AccountStatus;
  examEligibility: ExamEligibility;
  joiningDate?: string;
  activationToken?: string;
  activationUrl?: string;
  canAccessExams: boolean;
  totalExamsTaken: number;
  averageScorePercentage: number;
  registeredAt: string;
}

export interface RosterEntryDto {
  id: number;
  fullName: string;
  email: string;
  sourceScreenshot: string;
  needsReview: boolean;
  reviewReason?: string;
  suggestedEmployeeCode: string;
  suggestedDepartment: string;
  suggestedDesignation: string;
}

export interface SubjectSkillDetail {
  subject: string;
  latestScore?: number;
  previousScore?: number;
  percentage: number;
  proficiencyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  assessmentsTaken: number;
  trend: 'IMPROVING' | 'STABLE' | 'NEEDS_ATTENTION';
}

export interface TrainingRecommendation {
  subject: string;
  topic: string;
  rationale: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SkillMatrixDto {
  employeeCode: string;
  fullName: string;
  department: string;
  subjectProficiencies: Record<string, SubjectSkillDetail>;
  topStrengths: string[];
  identifiedSkillGaps: string[];
  recommendations: TrainingRecommendation[];
  overallProficiencyScore: number;
}

export interface QuestionDifficultyInsight {
  questionCode: string;
  subject: string;
  topic: string;
  difficulty: string;
  failureRate: number;
  recommendation: string;
}

export interface StrategicTrainingNeed {
  domain: string;
  department: string;
  affectedEmployees: number;
  recommendedCurriculum: string;
}

export interface IntelligenceSummaryDto {
  subjectAccuracyRate: Record<string, number>;
  subjectAttemptsCount: Record<string, number>;
  difficultyPassRate: Record<string, number>;
  departmentAverageScores: Record<string, number>;
  problematicQuestions: QuestionDifficultyInsight[];
  globalTrainingNeeds: StrategicTrainingNeed[];
  totalAssessmentsAnalyzed: number;
  organizationSkillHealthIndex: number;
}

export interface SystemHealthDto {
  status: string;
  javaVersion: string;
  jvmName: string;
  uptimeSeconds: number;
  memoryUsageMb: number;
  totalMemoryMb: number;
  postgresConnectivity: string;
  redisConnectivity: string;
  webSocketSignaler: string;
  ongoingExams: number;
  completedSubmissions: number;
  registeredEmployees: number;
  auditEventsRecorded: number;
}


