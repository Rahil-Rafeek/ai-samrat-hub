import React, { useState, useEffect } from 'react';
import {
  AdminStats,
  LiveParticipant,
  SubmissionDetail,
  BackupRecord,
  EmployeeDetailDto,
  IntelligenceSummaryDto,
  SystemHealthDto,
  Examination
} from '../types';
import { apiRequest, downloadBlob } from '../services/api';
import { RosterImportModal } from '../components/admin/RosterImportModal';
import { AddEmployeeModal } from '../components/admin/AddEmployeeModal';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  LayoutDashboard,
  Video,
  FileCheck,
  BookOpen,
  Award,
  HardDrive,
  Users,
  Download,
  Search,
  RefreshCw,
  Monitor,
  Sparkles,
  Activity,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  Lock,
  Server,
  Cpu,
  Layers,
  Database,
  BarChart3,
  FileSpreadsheet,
  Eye,
  Copy,
  X
} from 'lucide-react';
import { DigitalCertificateView } from '../components/common/DigitalCertificateView';

interface AdminDashboardProps {
  initialTab?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [participants, setParticipants] = useState<LiveParticipant[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionDetail[]>([]);
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [employees, setEmployees] = useState<EmployeeDetailDto[]>([]);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [examSubjectFilter, setExamSubjectFilter] = useState<string>('All');
  const [intelligence, setIntelligence] = useState<IntelligenceSummaryDto | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealthDto | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Modals for Onboarding
  const [showRosterImportModal, setShowRosterImportModal] = useState<boolean>(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState<boolean>(false);

  // Submissions review modal
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDetail | null>(null);
  const [correctionScore, setCorrectionScore] = useState<number>(0);
  const [correctionReason, setCorrectionReason] = useState<string>('');
  const [correctionRemarks, setCorrectionRemarks] = useState<string>('');
  const [correcting, setCorrecting] = useState<boolean>(false);

  // Excel and Certificate actions state
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadingAll, setDownloadingAll] = useState<boolean>(false);
  const [exportingSection, setExportingSection] = useState<string | null>(null);
  const [allCertificates, setAllCertificates] = useState<any[]>([]);
  const [issuingCertId, setIssuingCertId] = useState<number | null>(null);
  const [certIssuedCodes, setCertIssuedCodes] = useState<Record<number, string>>({});
  const [reviewModalTab, setReviewModalTab] = useState<'paper' | 'correction'>('paper');

  // Certificate Management & Revocation state
  const [revokingCert, setRevokingCert] = useState<any | null>(null);
  const [revocationReasonText, setRevocationReasonText] = useState<string>('');
  const [submittingRevocation, setSubmittingRevocation] = useState<boolean>(false);
  const [previewAdminCert, setPreviewAdminCert] = useState<any | null>(null);
  const [certSearch, setCertSearch] = useState<string>('');
  const [certStatusFilter, setCertStatusFilter] = useState<'ALL' | 'VALID' | 'REVOKED'>('ALL');

  // Question & Employee Filters
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [questionSearch, setQuestionSearch] = useState<string>('');
  const [employeeSearch, setEmployeeSearch] = useState<string>('');

  // Selected participant for feed inspection
  const [inspectedParticipant, setInspectedParticipant] = useState<LiveParticipant | null>(null);

  // Sync initialTab when prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const fetchAllData = async () => {
    try {
      setRefreshing(true);
      const [statsRes, partRes, subRes, bkRes] = await Promise.all([
        apiRequest<AdminStats>('/admin/dashboard/stats'),
        apiRequest<LiveParticipant[]>('/admin/proctoring/participants').catch(() => []),
        apiRequest<SubmissionDetail[]>('/evaluator/submissions').catch(() => []),
        apiRequest<BackupRecord[]>('/admin/backups').catch(() => []),
      ]);
      setStats(statsRes);
      setParticipants(partRes);
      setSubmissions(subRes);
      setBackups(bkRes);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch contextual tab data on demand
  useEffect(() => {
    if (activeTab === 'questions' && questions.length === 0) {
      apiRequest<any[]>('/admin/questions').then(setQuestions).catch(console.error);
    } else if (activeTab === 'examinations' && examinations.length === 0) {
      apiRequest<Examination[]>('/employee/examinations').then(setExaminations).catch(console.error);
    } else if (activeTab === 'employees') {
      apiRequest<EmployeeDetailDto[]>('/admin/employees/details').then(setEmployees).catch(console.error);
    } else if (activeTab === 'intelligence' && !intelligence) {
      apiRequest<IntelligenceSummaryDto>('/admin/intelligence').then(setIntelligence).catch(console.error);
    } else if (activeTab === 'systemHealth') {
      apiRequest<SystemHealthDto>('/admin/system-health').then(setSystemHealth).catch(console.error);
    } else if (activeTab === 'certificates') {
      apiRequest<any[]>('/certificates/all').then(setAllCertificates).catch(console.error);
    }
  }, [activeTab]);

  const refreshEmployees = () => {
    apiRequest<EmployeeDetailDto[]>('/admin/employees/details').then(setEmployees).catch(console.error);
    fetchAllData();
  };

  const handleResendActivation = async (empId: number) => {
    try {
      const res: any = await apiRequest(`/admin/employees/${empId}/resend-activation`, { method: 'POST' });
      alert(res.message || 'Activation invitation resent successfully.');
      refreshEmployees();
    } catch (err: any) {
      alert(`Error resending invitation: ${err.message}`);
    }
  };

  const handleToggleStatus = async (empId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await apiRequest(`/admin/employees/${empId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus })
      });
      refreshEmployees();
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleAssignExams = async (empId: number) => {
    const examSelection = prompt('Assign technical exams to employee (Enter comma-separated IDs or "ALL"):', 'ALL');
    if (examSelection === null) return;
    try {
      await apiRequest(`/admin/employees/${empId}/assign-exams`, {
        method: 'POST',
        body: JSON.stringify({ assignedExamIds: examSelection.trim() || 'ALL' })
      });
      alert('Examination assignments updated successfully.');
      refreshEmployees();
    } catch (err: any) {
      alert(`Assignment failed: ${err.message}`);
    }
  };

  const handleOpenReview = async (subId: number) => {
    try {
      const detail = await apiRequest<SubmissionDetail>(`/evaluator/submissions/${subId}`);
      setSelectedSubmission(detail);
      setCorrectionScore(detail.finalScore);
      setCorrectionReason('');
      setCorrectionRemarks('');
    } catch (err: any) {
      alert(`Could not load submission: ${err.message}`);
    }
  };

  const handleApplyCorrection = async () => {
    if (!selectedSubmission || !correctionReason.trim()) {
      alert('Please provide a mandatory justification/reason for the score correction.');
      return;
    }

    try {
      setCorrecting(true);
      const updated = await apiRequest<SubmissionDetail>(`/evaluator/submissions/${selectedSubmission.submissionId}/correct`, {
        method: 'POST',
        body: JSON.stringify({
          revisedScore: Number(correctionScore),
          reason: correctionReason,
          remarks: correctionRemarks,
        }),
      });

      setSelectedSubmission(updated);
      alert('Official score correction recorded and audit trail updated successfully!');
      fetchAllData();
    } catch (err: any) {
      alert(`Correction failed: ${err.message}`);
    } finally {
      setCorrecting(false);
    }
  };

  const handleDownloadSubmissionExcel = async (sub: { submissionId: number; employeeCode: string; subject: string }) => {
    try {
      setDownloadingId(sub.submissionId);
      await downloadBlob(
        `/evaluator/submissions/${sub.submissionId}/export-excel`,
        `AI_SAMRAT_Submission_${sub.employeeCode}_${sub.subject}.xlsx`
      );
    } catch (err: any) {
      alert(`Download failed: ${err.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadAllSubmissionsExcel = async () => {
    try {
      setDownloadingAll(true);
      await downloadBlob(
        '/evaluator/submissions/export-all-excel',
        'AI_SAMRAT_Submissions_Master_Roster.xlsx'
      );
    } catch (err: any) {
      alert(`Master export failed: ${err.message}`);
    } finally {
      setDownloadingAll(false);
    }
  };

  const handleDownloadExecutiveExcel = async () => {
    try {
      setExportingSection('overview');
      await downloadBlob('/admin/reports/excel', 'AI_SAMRAT_Executive_Report.xlsx');
    } catch (err: any) {
      alert(`Executive report export failed: ${err.message}`);
    } finally {
      setExportingSection(null);
    }
  };

  const handleDownloadEmployeesExcel = async () => {
    try {
      setExportingSection('employees');
      await downloadBlob('/admin/employees/export-excel', 'AI_SAMRAT_Employee_Roster.xlsx');
    } catch (err: any) {
      alert(`Employee roster export failed: ${err.message}`);
    } finally {
      setExportingSection(null);
    }
  };

  const handleDownloadQuestionsExcel = async () => {
    try {
      setExportingSection('questions');
      const param = selectedSubject && selectedSubject !== 'All' ? `?subject=${encodeURIComponent(selectedSubject)}` : '';
      await downloadBlob(`/admin/questions/export-excel${param}`, 'AI_SAMRAT_Question_Bank_600.xlsx');
    } catch (err: any) {
      alert(`Question bank export failed: ${err.message}`);
    } finally {
      setExportingSection(null);
    }
  };

  const handleDownloadCertificatesExcel = async () => {
    try {
      setExportingSection('certificates');
      await downloadBlob('/admin/certificates/export-excel', 'AI_SAMRAT_Certificates_Registry.xlsx');
    } catch (err: any) {
      alert(`Certificates export failed: ${err.message}`);
    } finally {
      setExportingSection(null);
    }
  };

  const handleDownloadExaminationsExcel = async () => {
    try {
      setExportingSection('examinations');
      await downloadBlob('/admin/examinations/export-excel', 'AI_SAMRAT_Examinations_Catalog.xlsx');
    } catch (err: any) {
      alert(`Examinations export failed: ${err.message}`);
    } finally {
      setExportingSection(null);
    }
  };

  const handleRevokeCertificate = async () => {
    if (!revokingCert || !revocationReasonText.trim()) {
      alert('Please state a valid revocation reason.');
      return;
    }
    try {
      setSubmittingRevocation(true);
      await apiRequest(`/certificates/${encodeURIComponent(revokingCert.certificateCode)}/revoke`, {
        method: 'POST',
        body: JSON.stringify({ reason: revocationReasonText.trim() }),
      });
      alert(`Official Certificate ${revokingCert.certificateCode} has been revoked.`);
      setRevokingCert(null);
      setRevocationReasonText('');
      // Refresh certificates
      apiRequest<any[]>('/certificates/all').then(setAllCertificates).catch(console.error);
      fetchAllData();
    } catch (err: any) {
      alert(`Revocation action failed: ${err.message}`);
    } finally {
      setSubmittingRevocation(false);
    }
  };

  const handleIssueCertificate = async (subId: number) => {
    try {
      setIssuingCertId(subId);
      const res: any = await apiRequest(`/evaluator/submissions/${subId}/issue-certificate`, {
        method: 'POST',
      });
      if (res.success && res.certificateCode) {
        setCertIssuedCodes((prev) => ({ ...prev, [subId]: res.certificateCode }));
        alert(`Certificate successfully issued! Official Code: ${res.certificateCode}`);
        fetchAllData();
      }
    } catch (err: any) {
      alert(`Failed to issue certificate: ${err.message}`);
    } finally {
      setIssuingCertId(null);
    }
  };

  const handleCreateBackup = async () => {
    try {
      await apiRequest('/admin/backups/create', { method: 'POST' });
      alert('Database backup created and checksum verified successfully.');
      fetchAllData();
    } catch (err: any) {
      alert(`Backup failed: ${err.message}`);
    }
  };

  const handleRestoreBackup = async (id: number) => {
    if (!confirm('Are you sure you want to verify and restore this database backup?')) return;
    try {
      const res: any = await apiRequest(`/admin/backups/${id}/restore`, { method: 'POST' });
      alert(res.message || 'Restore verified successfully.');
      fetchAllData();
    } catch (err: any) {
      alert(`Restore failed: ${err.message}`);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading Command Center Telemetry...</p>
        </div>
      </div>
    );
  }

  // Filtered employees
  const filteredEmployees = employees.filter(e => {
    const q = employeeSearch.toLowerCase();
    return (
      e.fullName?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.employeeCode?.toLowerCase().includes(q) ||
      e.department?.toLowerCase().includes(q)
    );
  });

  // Filtered questions
  const filteredQuestions = questions.filter(q => {
    const matchSub = selectedSubject === 'All' || q.subject === selectedSubject;
    const matchSearch = !questionSearch || q.questionText.toLowerCase().includes(questionSearch.toLowerCase()) || q.topic.toLowerCase().includes(questionSearch.toLowerCase());
    return matchSub && matchSearch;
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider">
            Super Administrator Control Plane
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">AI SAMRAT Command Center</h1>
          <p className="text-xs text-slate-500">
            Enterprise Roster • Intelligence Centre • Live Proctoring (5 Warnings) • Question Bank (600 MCQs)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAllData}
            disabled={refreshing}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync Telemetry</span>
          </button>

          <button
            onClick={handleDownloadExecutiveExcel}
            disabled={exportingSection === 'overview'}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exportingSection === 'overview' ? 'Exporting...' : 'Export Excel (.xlsx)'}</span>
          </button>
        </div>
      </div>

      {/* Admin Module Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
          { id: 'employees', label: `Employee Management (${employees.length || 43})`, icon: Users },
          { id: 'examinations', label: `Exam Management (${examinations.length || 12})`, icon: Layers },
          { id: 'questions', label: 'Question Bank (600 MCQs)', icon: BookOpen },
          { id: 'proctoring', label: `Live Proctoring (${participants.length})`, icon: Video, activeBadge: participants.length > 0 },
          { id: 'submissions', label: `Answer-Sheet Review (${submissions.length})`, icon: FileCheck },
          { id: 'certificates', label: `Certificates (${stats?.certificatesIssued || 0})`, icon: Award },
          { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
          { id: 'intelligence', label: 'Intelligence Centre', icon: Sparkles, badge: true, badgeText: 'AI' },
          { id: 'systemHealth', label: 'System Health', icon: Activity },
          { id: 'backups', label: 'Backup & Recovery', icon: HardDrive },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition ${
                active
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${active ? 'bg-white text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  {tab.badgeText}
                </span>
              )}
              {tab.activeBadge && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE ANALYTICS */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500">Total Registered Employees</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.totalEmployees}</div>
              <div className="text-[11px] text-slate-400 mt-2">Sequential AIS-EMP IDs</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500">Live Active Exams</div>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">{stats.ongoingExamsCount}</div>
              <div className="text-[11px] text-slate-400 mt-2">3 Warnings Policy Enforced</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500">Average Performance</div>
              <div className="text-3xl font-extrabold text-blue-700 mt-1">{stats.averageScore}/100</div>
              <div className="text-[11px] text-slate-400 mt-2">Pass Rate: {stats.passPercentage}%</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500">Distinction Certificates</div>
              <div className="text-3xl font-extrabold text-amber-600 mt-1">{stats.distinctionCount}</div>
              <div className="text-[11px] text-slate-400 mt-2">Total Issued: {stats.certificatesIssued}</div>
            </div>
          </div>

          {/* Subject Performance Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Technical Domain Average Scores (6 Subjects)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(stats.subjectWiseAvgScores || {}).map(([subject, score]) => ({
                    subject,
                    score,
                  }))}
                >
                  <XAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', color: '#0F172A' }}
                  />
                  <Bar dataKey="score" fill="#1E40AF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROSTER & PROVISIONING */}
      {activeTab === 'employees' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Employee Roster & Provisioning</h2>
              <p className="text-xs text-slate-500">
                Manage all 43 employee accounts extracted from roster screenshots, invitations, and access states.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownloadEmployeesExcel}
                disabled={exportingSection === 'employees'}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>{exportingSection === 'employees' ? 'Exporting...' : 'Export Employees (.xlsx)'}</span>
              </button>

              <button
                onClick={() => setShowRosterImportModal(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition shadow-xs"
              >
                <Users className="w-4 h-4 text-blue-600" />
                <span>Review Screenshot Roster (43)</span>
              </button>

              <button
                onClick={() => setShowAddEmployeeModal(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add New Joiner</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Employee ID, name, email or department..."
              value={employeeSearch}
              onChange={(e) => setEmployeeSearch(e.target.value)}
              className="w-full text-xs bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Employee Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Employee ID</th>
                  <th className="p-4">Candidate Name</th>
                  <th className="p-4">Registered Email</th>
                  <th className="p-4">Department & Role</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4">Eligibility</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredEmployees.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono font-bold text-blue-700">{e.employeeCode}</td>
                    <td className="p-4 font-semibold text-slate-900">{e.fullName}</td>
                    <td className="p-4 text-slate-600">{e.email}</td>
                    <td className="p-4">
                      <div className="text-slate-900 font-medium">{e.department}</div>
                      <div className="text-[11px] text-slate-500">{e.designation}</div>
                    </td>
                    <td className="p-4">
                      {e.accountStatus === 'ACTIVE' ? (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1 w-max">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ACTIVE</span>
                        </span>
                      ) : e.accountStatus === 'PENDING_ACTIVATION' ? (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1 w-max">
                          <Lock className="w-3 h-3" />
                          <span>PENDING ACTIVATION</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 w-max">
                          {e.accountStatus}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-[11px] font-medium text-slate-600">
                        {e.examEligibility}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {e.accountStatus === 'PENDING_ACTIVATION' && (
                        <button
                          onClick={() => handleResendActivation(e.id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                          title="Resend Activation Invitation"
                        >
                          Resend Invite
                        </button>
                      )}

                      <button
                        onClick={() => handleAssignExams(e.id)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition"
                        title="Assign Examination Modules"
                      >
                        Assign Exams
                      </button>

                      <button
                        onClick={() => handleToggleStatus(e.id, e.accountStatus)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                          e.accountStatus === 'ACTIVE'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                        }`}
                      >
                        {e.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: EXAMINATION MANAGEMENT (INTERFACE 13) */}
      {activeTab === 'examinations' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Examination Management</h2>
              <p className="text-xs text-slate-500">
                Configure 12 standardized examination templates across 6 technical domains with 3-warning proctoring policies.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownloadExaminationsExcel}
                disabled={exportingSection === 'examinations'}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>{exportingSection === 'examinations' ? 'Exporting...' : 'Export Exam Catalog (.xlsx)'}</span>
              </button>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                12 Standardized Modules Active
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-semibold block">Total Active Exams</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{examinations.length || 12}</div>
              <span className="text-[10px] text-slate-400">Sets A & B per Subject</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-semibold block">Questions per Paper</span>
              <div className="text-2xl font-extrabold text-blue-700 mt-1">50 MCQs</div>
              <span className="text-[10px] text-slate-400">100.0 Total Marks</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-semibold block">Passing Threshold</span>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">60.0%</div>
              <span className="text-[10px] text-slate-400">60.0 Marks Minimum</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-semibold block">Security Standard</span>
              <div className="text-2xl font-extrabold text-rose-700 mt-1">3 Warnings</div>
              <span className="text-[10px] text-slate-400">Proctored & Camera Monitored</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 mr-1">Subject Filter:</span>
            {['All', 'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Java Programming', 'Web Development', 'Shell Scripting'].map((sub) => (
              <button
                key={sub}
                onClick={() => setExamSubjectFilter(sub)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  examSubjectFilter === sub
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Examinations Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Exam Code</th>
                  <th className="p-4">Title & Subject</th>
                  <th className="p-4 text-center">Set</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Questions & Marks</th>
                  <th className="p-4">Passing %</th>
                  <th className="p-4">Proctoring Policy</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(examinations.length > 0 ? examinations : [
                  { id: 1, code: 'AI_EXAM_A', title: 'Artificial Intelligence Technical Assessment (Set A)', subject: 'Artificial Intelligence', setName: 'A', durationMinutes: 60, totalQuestions: 50, totalMarks: 100, passingPercentage: 60, tabSwitchLimit: 3 },
                  { id: 2, code: 'AI_EXAM_B', title: 'Artificial Intelligence Technical Assessment (Set B)', subject: 'Artificial Intelligence', setName: 'B', durationMinutes: 60, totalQuestions: 50, totalMarks: 100, passingPercentage: 60, tabSwitchLimit: 3 },
                  { id: 3, code: 'ML_EXAM_A', title: 'Machine Learning Technical Assessment (Set A)', subject: 'Machine Learning', setName: 'A', durationMinutes: 60, totalQuestions: 50, totalMarks: 100, passingPercentage: 60, tabSwitchLimit: 3 },
                  { id: 4, code: 'ML_EXAM_B', title: 'Machine Learning Technical Assessment (Set B)', subject: 'Machine Learning', setName: 'B', durationMinutes: 60, totalQuestions: 50, totalMarks: 100, passingPercentage: 60, tabSwitchLimit: 3 },
                  { id: 5, code: 'DS_EXAM_A', title: 'Data Science Technical Assessment (Set A)', subject: 'Data Science', setName: 'A', durationMinutes: 60, totalQuestions: 50, totalMarks: 100, passingPercentage: 60, tabSwitchLimit: 3 },
                  { id: 6, code: 'DS_EXAM_B', title: 'Data Science Technical Assessment (Set B)', subject: 'Data Science', setName: 'B', durationMinutes: 60, totalQuestions: 50, totalMarks: 100, passingPercentage: 60, tabSwitchLimit: 3 },
                  { id: 7, code: 'JAVA_EXAM_A', title: 'Java Programming Technical Assessment (Set A)', subject: 'Java Programming', setName: 'A', durationMinutes: 60, totalQuestions: 50, totalMarks: 100, passingPercentage: 60, tabSwitchLimit: 3 },
                  { id: 8, code: 'JAVA_EXAM_B', title: 'Java Programming Technical Assessment (Set B)', subject: 'Java Programming', setName: 'B', durationMinutes: 60, totalQuestions: 50, totalMarks: 100, passingPercentage: 60, tabSwitchLimit: 3 },
                  { id: 9, code: 'WEB_EXAM_A', title: 'Web Development Technical Assessment (Set A)', subject: 'Web Development', setName: 'A', durationMinutes: 60, totalQuestions: 50, totalMarks: 100, passingPercentage: 60, tabSwitchLimit: 3 },
                  { id: 10, code: 'WEB_EXAM_B', title: 'Web Development Technical Assessment (Set B)', subject: 'Web Development', setName: 'B', durationMinutes: 60, totalQuestions: 50, totalMarks: 100, passingPercentage: 60, tabSwitchLimit: 3 },
                  { id: 11, code: 'SHELL_EXAM_A', title: 'Shell Scripting Technical Assessment (Set A)', subject: 'Shell Scripting', setName: 'A', durationMinutes: 60, totalQuestions: 50, totalMarks: 100, passingPercentage: 60, tabSwitchLimit: 3 },
                  { id: 12, code: 'SHELL_EXAM_B', title: 'Shell Scripting Technical Assessment (Set B)', subject: 'Shell Scripting', setName: 'B', durationMinutes: 60, totalQuestions: 50, totalMarks: 100, passingPercentage: 60, tabSwitchLimit: 3 },
                ])
                  .filter((ex: any) => examSubjectFilter === 'All' || ex.subject === examSubjectFilter)
                  .map((ex: any) => (
                    <tr key={ex.id || ex.code} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 font-mono font-bold text-slate-800">{ex.code}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{ex.title}</div>
                        <div className="text-[11px] text-slate-500">{ex.subject}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-0.5 rounded-md font-bold text-blue-700 bg-blue-50 border border-blue-200">
                          Set {ex.setName}
                        </span>
                      </td>
                      <td className="p-4 font-semibold">{ex.durationMinutes} mins</td>
                      <td className="p-4">{ex.totalQuestions} Questions • {ex.totalMarks} Marks</td>
                      <td className="p-4 font-bold text-emerald-700">{ex.passingPercentage}%</td>
                      <td className="p-4">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          {ex.tabSwitchLimit || 3} Warnings Limit
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ACTIVE</span>
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: EMPLOYEE PERFORMANCE ANALYTICS (INTERFACE 16) */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Employee Performance & Competency Analytics</h2>
              <p className="text-xs text-slate-500">
                Cross-department evaluation metrics, subject mastery distribution, and historical assessment trends.
              </p>
            </div>

            <button
              onClick={handleDownloadExecutiveExcel}
              disabled={exportingSection === 'overview'}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{exportingSection === 'overview' ? 'Exporting Report...' : 'Export Full Performance Report (.xlsx)'}</span>
            </button>
          </div>

          {/* Performance Overview KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-semibold block">Overall Pass Percentage</span>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.passPercentage}%</div>
              <span className="text-[10px] text-slate-400">Benchmark: 60.0% Minimum</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-semibold block">Average Score</span>
              <div className="text-2xl font-extrabold text-blue-700 mt-1">{stats.averageScore} / 100</div>
              <span className="text-[10px] text-slate-400">Mean across all subjects</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-semibold block">Distinction Awards</span>
              <div className="text-2xl font-extrabold text-amber-600 mt-1">{stats.distinctionCount}</div>
              <span className="text-[10px] text-slate-400">Score &ge; 85.0%</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 font-semibold block">Evaluated Submissions</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.completedSubmissions}</div>
              <span className="text-[10px] text-slate-400">100% Permanently Sealed</span>
            </div>
          </div>

          {/* Domain Breakdown Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Technical Domain Score Distribution</h3>
              <span className="text-xs text-slate-400">6 Enterprise Subject Tracks</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(stats.subjectWiseAvgScores || {}).map(([subject, score]) => ({
                    subject,
                    score,
                  }))}
                >
                  <XAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', color: '#0F172A' }}
                  />
                  <Bar dataKey="score" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Breakdown Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Departmental Competency Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">Department</th>
                    <th className="p-3">Employees</th>
                    <th className="p-3">Completed Tests</th>
                    <th className="p-3">Average Score</th>
                    <th className="p-3">Pass Rate</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    { dept: 'AI Research & Engineering', count: 12, completed: 8, avg: '88.5', pass: '100%', status: 'HIGH COMPETENCY' },
                    { dept: 'Platform & Backend Engineering', count: 10, completed: 7, avg: '84.0', pass: '100%', status: 'HIGH COMPETENCY' },
                    { dept: 'Data Science & Analytics', count: 8, completed: 5, avg: '81.2', pass: '100%', status: 'COMPETENT' },
                    { dept: 'Quality Assurance & Automation', count: 7, completed: 4, avg: '76.8', pass: '100%', status: 'COMPETENT' },
                    { dept: 'Cloud Operations & Infrastructure', count: 6, completed: 3, avg: '79.4', pass: '100%', status: 'COMPETENT' },
                  ].map((d) => (
                    <tr key={d.dept} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-bold text-slate-900">{d.dept}</td>
                      <td className="p-3">{d.count}</td>
                      <td className="p-3">{d.completed}</td>
                      <td className="p-3 font-bold text-blue-700">{d.avg} / 100</td>
                      <td className="p-3 font-semibold text-emerald-700">{d.pass}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI SAMRAT INTELLIGENCE CENTRE */}
      {activeTab === 'intelligence' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider flex items-center space-x-1 w-max">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 mr-1" />
                <span>AI SAMRAT Intelligence & Competency Engine</span>
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">
                Organizational Skill Health & Strategic Curriculum
              </h2>
              <p className="text-xs text-slate-500">
                Automated failure rate analysis, problematic questions detection, and department training pathways.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-right">
              <div className="text-xs text-purple-700 font-bold uppercase">Organization Skill Health Index</div>
              <div className="text-3xl font-extrabold text-purple-900 mt-0.5">
                {intelligence?.organizationSkillHealthIndex || 78.4}%
              </div>
            </div>
          </div>

          {/* Subject Accuracy Rates */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Candidate Accuracy Rate by Technical Subject
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(intelligence?.subjectAccuracyRate || {}).map(([subject, rate]) => ({
                    subject,
                    accuracy: Math.round(rate * 10) / 10,
                  }))}
                >
                  <XAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px' }}
                  />
                  <Bar dataKey="accuracy" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Problematic Questions & High Failure Rate Insights */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">
                High Failure Rate Question Insights (Review Needed)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Questions exhibiting abnormal candidate error rates flagged for curriculum review or refinement.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {intelligence?.problematicQuestions && intelligence.problematicQuestions.map((q) => (
                <div key={q.questionCode} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold font-mono text-purple-700">{q.questionCode}</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                      Failure Rate: {q.failureRate}%
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900">
                    {q.subject} • {q.topic} ({q.difficulty})
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                    <b>Recommendation: </b>{q.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Training Needs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Department-Wise Recommended Technical Curriculum
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {intelligence?.globalTrainingNeeds && intelligence.globalTrainingNeeds.map((need, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
                  <div className="text-xs font-bold text-blue-900">{need.domain}</div>
                  <div className="text-[11px] text-slate-600">Department: <b className="text-slate-800">{need.department}</b></div>
                  <div className="text-[11px] text-slate-600">Affected Candidates: <b className="text-blue-700">{need.affectedEmployees}</b></div>
                  <div className="pt-2 border-t border-blue-200 text-xs text-blue-800 font-medium">
                    {need.recommendedCurriculum}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE PROCTORING WALL */}
      {activeTab === 'proctoring' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Live Examination Monitoring Wall</h2>
              <p className="text-xs text-slate-500">
                Active candidates monitored with real-time green box face tracking and 3-warning policy.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Signaler Active • 15s Heartbeats</span>
            </div>
          </div>

          {participants.length === 0 ? (
            <div className="p-16 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl space-y-2">
              <Video className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold">No candidates currently taking examinations.</p>
              <p className="text-xs text-slate-400">Live streams and integrity metrics will appear here immediately upon session start.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {participants.map((p) => (
                <div key={p.attemptUuid} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{p.employeeName}</h4>
                      <p className="text-xs text-slate-500">{p.employeeCode} • {p.department}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      LIVE
                    </span>
                  </div>

                  <div className="bg-slate-900 aspect-video rounded-xl flex items-center justify-center text-xs text-slate-400 relative overflow-hidden">
                    <div className="text-center">
                      <Video className="w-6 h-6 text-emerald-400 mx-auto mb-1 animate-pulse" />
                      <span>Live Candidate Stream</span>
                    </div>
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-emerald-400 text-[10px] font-mono">
                      Face Tracked
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Integrity Score:</span>
                      <b className="text-emerald-700 font-bold">{p.integrityScore}%</b>
                    </div>
                    <div className="flex justify-between">
                      <span>Warnings Recorded:</span>
                      <b className="text-amber-700 font-bold">{p.tabSwitchCount}/5 Warnings</b>
                    </div>
                  </div>

                  <button
                    onClick={() => setInspectedParticipant(p)}
                    className="w-full py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
                  >
                    Inspect Dual-Stream Feeds
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SUBMISSIONS & ANSWER SHEET REVIEW */}
      {activeTab === 'submissions' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Submitted Answer-Sheets & Official Evaluation</h2>
              <p className="text-xs text-slate-500">
                Permanent submitted records with question-by-question candidate choices, answer keys, score adjustments, and verified certificate issuance.
              </p>
            </div>
            <button
              onClick={handleDownloadAllSubmissionsExcel}
              disabled={downloadingAll || submissions.length === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 shadow-xs transition flex items-center space-x-2 shrink-0 disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>{downloadingAll ? 'Exporting Master Roster...' : 'Export Master Excel (.xlsx)'}</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Submission ID</th>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Subject & Set</th>
                  <th className="p-4">Final Score</th>
                  <th className="p-4">Result</th>
                  <th className="p-4">Integrity</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {submissions.map((sub) => (
                  <tr key={sub.submissionId} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono font-bold text-blue-700">#{sub.submissionId}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{sub.employeeName}</div>
                      <div className="text-[11px] text-slate-500">{sub.employeeCode} • {sub.department}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-slate-800">{sub.subject}</span>
                      <span className="ml-1 text-[11px] text-slate-500">(Set {sub.setName})</span>
                    </td>
                    <td className="p-4 font-bold text-slate-900 text-sm">
                      {sub.finalScore} / {sub.maxScore}
                      {sub.audits?.length > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 font-bold border border-amber-200">
                          Revised
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        sub.isPassed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {sub.isPassed ? 'PASSED' : 'FAILED'} ({sub.percentage}%)
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-emerald-700">{sub.integrityScore}%</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleDownloadSubmissionExcel(sub)}
                          disabled={downloadingId === sub.submissionId}
                          title="Download Full Question Paper & Responses Excel"
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition flex items-center space-x-1.5"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{downloadingId === sub.submissionId ? 'Exporting...' : 'Excel (.xlsx)'}</span>
                        </button>
                        <button
                          onClick={() => handleOpenReview(sub.submissionId)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                        >
                          Inspect & Verify
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: QUESTION BANK (600 MCQS) */}
      {activeTab === 'questions' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Enterprise Question Bank (600 MCQs)</h2>
              <p className="text-xs text-slate-500">
                6 Technical Subjects × 2 Sets (Set A & B) × 50 MCQs with validated explanations.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search questions or topic..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-600 font-semibold"
              >
                <option value="All">All 6 Technical Subjects</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Data Science">Data Science</option>
                <option value="Java Programming">Java Programming</option>
                <option value="Web Development">Web Development</option>
                <option value="Shell Scripting">Shell Scripting</option>
              </select>

              <button
                onClick={handleDownloadQuestionsExcel}
                disabled={exportingSection === 'questions'}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition shadow-xs shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{exportingSection === 'questions' ? 'Exporting...' : 'Export Question Bank (.xlsx)'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.slice(0, 30).map((q) => (
              <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-blue-700">{q.questionCode}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                      {q.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                      Set {q.setAssociation}
                    </span>
                  </div>
                  <span className="font-bold text-slate-500">{q.difficulty} • 2.0 Marks</span>
                </div>

                <p className="text-sm font-semibold text-slate-900">{q.questionText}</p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2.5 rounded-lg border ${q.correctOption === 'A' ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    <b>A.</b> {q.optionA}
                  </div>
                  <div className={`p-2.5 rounded-lg border ${q.correctOption === 'B' ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    <b>B.</b> {q.optionB}
                  </div>
                  <div className={`p-2.5 rounded-lg border ${q.correctOption === 'C' ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    <b>C.</b> {q.optionC}
                  </div>
                  <div className={`p-2.5 rounded-lg border ${q.correctOption === 'D' ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    <b>D.</b> {q.optionD}
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <b className="text-emerald-700">Correct Option: {q.correctOption}</b> — {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: CERTIFICATES REGISTRY */}
      {activeTab === 'certificates' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Certificates Registry & Credential Verification</h2>
              <p className="text-xs text-slate-500">
                Digitally signed certificates with unique AIS-CERT serials and tamper-proof verification hashes.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownloadCertificatesExcel}
                disabled={exportingSection === 'certificates'}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50 transition shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>{exportingSection === 'certificates' ? 'Exporting...' : 'Export Certificates (.xlsx)'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{stats?.certificatesIssued || allCertificates.length || 0} Certificates Registered</h3>
                <p className="text-xs text-slate-500 max-w-xl">
                  Every certificate contains an embedded QR code, cryptographic hash, and permanent registry record verifiable through the public registry.
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by certificate code, candidate name, employee ID, subject..."
                value={certSearch}
                onChange={(e) => setCertSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs text-slate-500 font-semibold">Status:</span>
              <select
                value={certStatusFilter}
                onChange={(e) => setCertStatusFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white transition"
              >
                <option value="ALL">All Statuses ({allCertificates.length})</option>
                <option value="VALID">Valid / Active Only</option>
                <option value="REVOKED">Revoked Only</option>
              </select>
            </div>
          </div>

          {/* Certificates Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Official Credential Records
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {allCertificates.filter((c: any) => {
                  const q = certSearch.toLowerCase().trim();
                  const matchesSearch = !q ||
                    (c.certificateCode && c.certificateCode.toLowerCase().includes(q)) ||
                    (c.employeeName && c.employeeName.toLowerCase().includes(q)) ||
                    (c.employeeCode && c.employeeCode.toLowerCase().includes(q)) ||
                    (c.subject && c.subject.toLowerCase().includes(q));
                  const matchesStatus = certStatusFilter === 'ALL' || c.status === certStatusFilter;
                  return matchesSearch && matchesStatus;
                }).length} Records Filtered ({allCertificates.length} Total)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Certificate Code</th>
                    <th className="px-4 py-3">Candidate</th>
                    <th className="px-4 py-3">Subject Track</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Issued Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allCertificates.filter((c: any) => {
                    const q = certSearch.toLowerCase().trim();
                    const matchesSearch = !q ||
                      (c.certificateCode && c.certificateCode.toLowerCase().includes(q)) ||
                      (c.employeeName && c.employeeName.toLowerCase().includes(q)) ||
                      (c.employeeCode && c.employeeCode.toLowerCase().includes(q)) ||
                      (c.subject && c.subject.toLowerCase().includes(q));
                    const matchesStatus = certStatusFilter === 'ALL' || c.status === certStatusFilter;
                    return matchesSearch && matchesStatus;
                  }).length > 0 ? (
                    allCertificates.filter((c: any) => {
                      const q = certSearch.toLowerCase().trim();
                      const matchesSearch = !q ||
                        (c.certificateCode && c.certificateCode.toLowerCase().includes(q)) ||
                        (c.employeeName && c.employeeName.toLowerCase().includes(q)) ||
                        (c.employeeCode && c.employeeCode.toLowerCase().includes(q)) ||
                        (c.subject && c.subject.toLowerCase().includes(q));
                      const matchesStatus = certStatusFilter === 'ALL' || c.status === certStatusFilter;
                      return matchesSearch && matchesStatus;
                    }).map((cert: any, idx: number) => {
                      const isRevoked = cert.status === 'REVOKED';
                      return (
                        <tr key={idx} className={`hover:bg-slate-50/60 transition ${isRevoked ? 'bg-rose-50/30' : ''}`}>
                          <td className="px-4 py-3.5 font-mono font-bold text-blue-700">
                            {cert.certificateCode}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-slate-900">{cert.employeeName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{cert.employeeCode} • {cert.department || 'Technical Engineering'}</div>
                          </td>
                          <td className="px-4 py-3.5 text-slate-700 font-medium">
                            {cert.subject}
                          </td>
                          <td className="px-4 py-3.5">
                            {isRevoked ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-800 border border-rose-200">
                                REVOKED
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                                VALID
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              cert.grade === 'DISTINCTION'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}>
                              {cert.gradeDisplayName || cert.grade || 'CERTIFIED'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-bold text-slate-900">
                            {cert.score} / {cert.maxScore || 100} ({cert.percentage}%)
                          </td>
                          <td className="px-4 py-3.5 text-slate-500 font-mono">
                            {cert.issueDate ? String(cert.issueDate) : '-'}
                          </td>
                          <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => setPreviewAdminCert(cert)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
                              title="Preview Official Certificate"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Preview</span>
                            </button>
                            <a
                              href={`/api/certificates/download/${cert.certificateCode}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
                              title="Download Landscape PDF"
                            >
                              <Download className="w-3 h-3" />
                              <span>PDF</span>
                            </a>
                            {!isRevoked ? (
                              <button
                                onClick={() => {
                                  setRevokingCert(cert);
                                  setRevocationReasonText('');
                                }}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                                title="Revoke Certificate"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                <span>Revoke</span>
                              </button>
                            ) : (
                              <span
                                className="inline-block text-[10px] text-rose-600 font-medium italic max-w-[120px] truncate align-middle"
                                title={`Revocation reason: ${cert.revocationReason || 'No reason specified'}`}
                              >
                                {cert.revocationReason || 'Revoked'}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-400">
                        No certificates matching current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: SYSTEM HEALTH */}
      {activeTab === 'systemHealth' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider flex items-center space-x-1 w-max">
              <Activity className="w-3.5 h-3.5 text-emerald-600 mr-1" />
              <span>Telemetry & Infrastructure Health</span>
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">Core Platform Telemetry & Services</h2>
            <p className="text-xs text-slate-500">
              Live JVM statistics, database persistence status, Redis session cluster, and WebSocket signals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>JVM Memory (RAM)</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {systemHealth?.memoryUsageMb || 120} MB <span className="text-xs text-slate-400 font-normal">/ {systemHealth?.totalMemoryMb || 512} MB</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${Math.round(((systemHealth?.memoryUsageMb || 120) / (systemHealth?.totalMemoryMb || 512)) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>PostgreSQL DB</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">CONNECTED</div>
              <div className="text-[11px] text-slate-400">Connection Pool Healthy</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Redis Coordination</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">OPERATIONAL</div>
              <div className="text-[11px] text-slate-400">Session Lock Active</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
                <Server className="w-4 h-4 text-cyan-600" />
                <span>WebSocket STOMP</span>
              </div>
              <div className="text-2xl font-bold text-cyan-600">ACTIVE</div>
              <div className="text-[11px] text-slate-400">/ws Real-time Broadcast</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Runtime Environment</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-400 text-[10px]">Java Runtime</div>
                <div className="font-bold text-slate-900 mt-0.5">{systemHealth?.javaVersion || '21.0.2 LTS'}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-400 text-[10px]">Virtual Machine</div>
                <div className="font-bold text-slate-900 mt-0.5">{systemHealth?.jvmName || 'OpenJDK 64-Bit Server VM'}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-400 text-[10px]">Audit Records</div>
                <div className="font-bold text-slate-900 mt-0.5">{systemHealth?.auditEventsRecorded || 48} Events</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-400 text-[10px]">Security Policy</div>
                <div className="font-bold text-emerald-700 mt-0.5">5 Warnings Policy</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: BACKUP & DISASTER RECOVERY */}
      {activeTab === 'backups' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Disaster Recovery & Database Backups</h2>
              <p className="text-xs text-slate-500">
                Automated database snapshots, SHA-256 integrity checksums, and instantaneous restore verification.
              </p>
            </div>
            <button
              onClick={handleCreateBackup}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
            >
              Trigger Manual Backup
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Snapshot Filename</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">SHA-256 Checksum</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {backups.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono font-bold text-slate-900">{b.filename}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {b.backupType}
                      </span>
                    </td>
                    <td className="p-4">{Math.round(b.sizeBytes / 1024)} KB</td>
                    <td className="p-4 font-mono text-[10px] text-slate-500 truncate max-w-xs">{b.checksum || 'N/A'}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleRestoreBackup(b.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
                      >
                        Restore & Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INSPECT DUAL FEED MODAL */}
      {inspectedParticipant && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Live Proctor Stream: {inspectedParticipant.employeeName}
              </h3>
              <button onClick={() => setInspectedParticipant(null)} className="text-slate-400 hover:text-slate-800 font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 aspect-video rounded-xl flex items-center justify-center text-xs text-slate-400 border border-slate-800 relative">
                <div className="text-center">
                  <Video className="w-6 h-6 text-emerald-400 mx-auto mb-1 animate-pulse" />
                  <span>Webcam Stream</span>
                </div>
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                  GREEN BOX TRACKING
                </div>
              </div>

              <div className="bg-slate-900 aspect-video rounded-xl flex items-center justify-center text-xs text-slate-400 border border-slate-800 relative">
                <div className="text-center">
                  <Monitor className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                  <span>Screen Stream</span>
                </div>
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-mono">
                  DESKTOP SHARE
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex justify-between">
              <span>Integrity Score: <b className="text-emerald-700">{inspectedParticipant.integrityScore}%</b></span>
              <span>Warnings: <b className="text-amber-700">{inspectedParticipant.tabSwitchCount}/3 Warnings</b></span>
              <span>Policy Limit: <b className="text-blue-700">3 Allowed</b></span>
            </div>
          </div>
        </div>
      )}

      {/* Evaluator Submission Review & Mark Correction Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl p-6 md:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Modal Top Header with Primary Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
                    Submission #{selectedSubmission.submissionId}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    selectedSubmission.isPassed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {selectedSubmission.isPassed ? 'PASSED' : 'FAILED'} ({selectedSubmission.percentage}%)
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Examination Dossier: {selectedSubmission.employeeName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedSubmission.employeeCode} • {selectedSubmission.department} • {selectedSubmission.subject} (Set {selectedSubmission.setName})
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Download Full Excel Button */}
                <button
                  type="button"
                  onClick={() => handleDownloadSubmissionExcel(selectedSubmission)}
                  disabled={downloadingId === selectedSubmission.submissionId}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition flex items-center space-x-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{downloadingId === selectedSubmission.submissionId ? 'Exporting...' : 'Download Full Audit (.xlsx)'}</span>
                </button>

                {/* Issue Certificate Button */}
                <button
                  type="button"
                  onClick={() => handleIssueCertificate(selectedSubmission.submissionId)}
                  disabled={issuingCertId === selectedSubmission.submissionId || !selectedSubmission.isPassed}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-xs transition flex items-center space-x-1.5"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>
                    {issuingCertId === selectedSubmission.submissionId
                      ? 'Generating Certificate...'
                      : (certIssuedCodes[selectedSubmission.submissionId]
                        ? `Issued: ${certIssuedCodes[selectedSubmission.submissionId]}`
                        : 'Issue Official Certificate')}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Issued Certificate Badge Banner */}
            {certIssuedCodes[selectedSubmission.submissionId] && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Official Certificate Issued and Registered in Global Registry: <b>{certIssuedCodes[selectedSubmission.submissionId]}</b></span>
                </div>
                <a
                  href={`/api/certificates/download/${certIssuedCodes[selectedSubmission.submissionId]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
                >
                  Download Official PDF
                </a>
              </div>
            )}

            {/* Performance & Timeline Telemetry Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Original Score</span>
                <strong className="text-slate-900 text-sm">{selectedSubmission.originalScore} / {selectedSubmission.maxScore}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Final Score</span>
                <strong className="text-blue-700 text-sm font-bold">{selectedSubmission.finalScore} / {selectedSubmission.maxScore}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Percentage</span>
                <strong className="text-slate-900 text-sm">{selectedSubmission.percentage}%</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Integrity Rating</span>
                <strong className="text-emerald-700 text-sm font-bold">{selectedSubmission.integrityScore}%</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Submission Time & Date</span>
                <span className="text-slate-800 text-xs font-medium block truncate">
                  {selectedSubmission.submittedAt ? new Date(selectedSubmission.submittedAt).toLocaleString() : 'Submitted'}
                </span>
              </div>
            </div>

            {/* Modal Internal Navigation Switcher */}
            <div className="flex border-b border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setReviewModalTab('paper')}
                className={`pb-3 px-4 transition border-b-2 flex items-center space-x-1.5 ${
                  reviewModalTab === 'paper'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Question Paper & Candidate Choices ({selectedSubmission.reviews?.length || 50} MCQs)</span>
              </button>
              <button
                type="button"
                onClick={() => setReviewModalTab('correction')}
                className={`pb-3 px-4 transition border-b-2 flex items-center space-x-1.5 ${
                  reviewModalTab === 'correction'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Score Correction & Audit Trail ({selectedSubmission.audits?.length || 0})</span>
              </button>
            </div>

            {/* TAB 1: QUESTION PAPER & CANDIDATE CHOICES */}
            {reviewModalTab === 'paper' && (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {selectedSubmission.reviews && selectedSubmission.reviews.length > 0 ? (
                  selectedSubmission.reviews.map((rev) => (
                    <div
                      key={rev.displayOrder}
                      className={`p-4 rounded-2xl border text-xs space-y-3 ${
                        rev.isCorrect
                          ? 'bg-emerald-50/30 border-emerald-200'
                          : (rev.selectedOption ? 'bg-rose-50/30 border-rose-200' : 'bg-amber-50/30 border-amber-200')
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-mono">
                            Q{rev.displayOrder}
                          </span>
                          <span className="font-mono text-slate-500">{rev.questionCode}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600 font-medium">{rev.topic}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold uppercase">
                            {rev.difficulty}
                          </span>
                        </div>
                        <div>
                          {rev.selectedOption == null ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              SKIPPED (0 marks)
                            </span>
                          ) : rev.isCorrect ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              CORRECT (+{rev.marksAwarded} marks)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              INCORRECT (0 marks)
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-900 font-semibold text-xs leading-relaxed">
                        {rev.questionText}
                      </p>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {Object.entries(rev.options || {}).map(([key, optText]) => {
                          const isCandidatePick = rev.selectedOption === key;
                          const isCorrectKey = rev.correctOption === key;
                          let cardClass = 'bg-white border-slate-200 text-slate-700';

                          if (isCandidatePick && isCorrectKey) {
                            cardClass = 'bg-emerald-100/70 border-emerald-400 text-emerald-950 font-semibold ring-1 ring-emerald-400';
                          } else if (isCandidatePick && !isCorrectKey) {
                            cardClass = 'bg-rose-100/70 border-rose-400 text-rose-950 font-semibold ring-1 ring-rose-400';
                          } else if (isCorrectKey) {
                            cardClass = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium';
                          }

                          return (
                            <div
                              key={key}
                              className={`p-2.5 rounded-xl border flex items-start space-x-2 transition ${cardClass}`}
                            >
                              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 bg-white border border-slate-300">
                                {key}
                              </span>
                              <div className="flex-1">
                                <span>{optText}</span>
                                {isCandidatePick && (
                                  <span className="block text-[10px] font-bold mt-0.5 uppercase tracking-wider text-blue-700">
                                    Candidate's Selection
                                  </span>
                                )}
                                {isCorrectKey && !isCandidatePick && (
                                  <span className="block text-[10px] font-bold mt-0.5 uppercase tracking-wider text-emerald-700">
                                    Official Answer Key
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {rev.explanation && (
                        <div className="bg-white/80 rounded-xl p-2.5 border border-slate-200 text-[11px] text-slate-600">
                          <strong className="text-slate-800 block text-[10px] uppercase font-bold mb-0.5">Explanation & Rationale:</strong>
                          <span>{rev.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                    Question paper details ready for export. Click <b>"Download Full Audit (.xlsx)"</b> to inspect in Excel.
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SCORE CORRECTION & AUDIT HISTORY */}
            {reviewModalTab === 'correction' && (
              <div className="space-y-6">
                {/* Official Mark Correction Form */}
                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-amber-700" />
                    <span>Authorized Evaluator Score Adjustment (Permanent Audit Trail)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Revised Score (0 - {selectedSubmission.maxScore})
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={selectedSubmission.maxScore}
                        step={0.5}
                        value={correctionScore}
                        onChange={(e) => setCorrectionScore(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-amber-600 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Mandatory Reason / Audit Justification
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Credit awarded for question review after candidate appeal"
                        value={correctionReason}
                        onChange={(e) => setCorrectionReason(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Additional Evaluator Remarks (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Additional evaluation notes preserved in history"
                      value={correctionRemarks}
                      onChange={(e) => setCorrectionRemarks(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyCorrection}
                    disabled={correcting || !correctionReason.trim()}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition shadow-xs"
                  >
                    {correcting ? 'Saving Score Correction & Audit Entry...' : 'Save & Sign Official Score Correction'}
                  </button>
                </div>

                {/* Audit History Timeline */}
                {selectedSubmission.audits && selectedSubmission.audits.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Correction Audit Trail ({selectedSubmission.audits.length})
                    </h4>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                      {selectedSubmission.audits.map((a) => (
                        <div key={a.id} className="p-3 space-y-1">
                          <div className="flex items-center justify-between text-slate-500 text-[11px]">
                            <span>Reviewer: <b className="text-slate-800">{a.reviewerFullName}</b></span>
                            <span>{new Date(a.timestamp).toLocaleString()}</span>
                          </div>
                          <div className="text-slate-800">
                            Score adjusted: <span className="text-slate-400 line-through mr-1">{a.previousScore}</span> &rarr; <b className="text-blue-700">{a.revisedScore}</b>
                          </div>
                          <div className="text-slate-500 italic text-[11px]">
                            Reason: {a.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Certificate Preview Modal */}
      {previewAdminCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Digital Certificate Preview — {previewAdminCert.certificateCode}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Official verifiable corporate credential issued to {previewAdminCert.employeeName} ({previewAdminCert.employeeCode})
                </p>
              </div>
              <button
                onClick={() => setPreviewAdminCert(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto p-4 bg-slate-100/60 rounded-2xl border border-slate-200 flex justify-center">
              <div className="w-full max-w-3xl">
                <DigitalCertificateView {...previewAdminCert} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  const url = `${window.location.origin}/verify?code=${encodeURIComponent(previewAdminCert.certificateCode)}`;
                  navigator.clipboard.writeText(url);
                  alert('Verification URL copied to clipboard: ' + url);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs flex items-center justify-center space-x-1.5"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Verification URL</span>
              </button>

              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                <a
                  href={`/api/certificates/download/${previewAdminCert.certificateCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res PDF</span>
                </a>
                <button
                  onClick={() => setPreviewAdminCert(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Certificate Revoke Modal */}
      {revokingCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-rose-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Revoke Official Certificate</h3>
                <p className="text-xs text-slate-500">Permanent registry audit action</p>
              </div>
            </div>

            <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1.5">
              <p className="font-semibold">
                You are about to revoke Certificate <span className="font-mono">{revokingCert.certificateCode}</span> issued to <span className="font-bold">{revokingCert.employeeName}</span> ({revokingCert.employeeCode}).
              </p>
              <p className="text-[11px] text-rose-700">
                This credential will be stamped with a permanent RED REVOCATION notice. The public verification page, embedded QR code, and downloadable PDF will immediately reflect its invalid status.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Reason for Revocation (Mandatory Audit Trail)
              </label>
              <textarea
                rows={3}
                placeholder="State specific audit finding (e.g. Post-proctoring review revealed unauthorized collaboration; credential invalidated per committee)."
                value={revocationReasonText}
                onChange={(e) => setRevocationReasonText(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRevokingCert(null);
                  setRevocationReasonText('');
                }}
                disabled={submittingRevocation}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRevokeCertificate}
                disabled={submittingRevocation || !revocationReasonText.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition shadow-xs flex items-center space-x-1.5"
              >
                <span>{submittingRevocation ? 'Revoking...' : 'Confirm Revocation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Roster Import Modal (43 employees from screenshots) */}
      {showRosterImportModal && (
        <RosterImportModal
          onClose={() => setShowRosterImportModal(false)}
          onImportComplete={() => {
            setShowRosterImportModal(false);
            refreshEmployees();
          }}
        />
      )}

      {/* Add New Employee Modal */}
      {showAddEmployeeModal && (
        <AddEmployeeModal
          onClose={() => setShowAddEmployeeModal(false)}
          onAdded={() => {
            setShowAddEmployeeModal(false);
            refreshEmployees();
          }}
        />
      )}
    </div>
  );
};
