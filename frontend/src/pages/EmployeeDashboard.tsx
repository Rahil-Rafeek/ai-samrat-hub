import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Examination, Certificate } from '../types';
import { apiRequest } from '../services/api';
import {
  BookOpen,
  Award,
  Clock,
  ArrowRight,
  ShieldCheck,
  Download,
  AlertCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface EmployeeDashboardProps {
  onStartExam: (exam: Examination) => void;
  onViewCertificates: () => void;
  onViewSkillMatrix?: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  onStartExam,
  onViewCertificates,
  onViewSkillMatrix,
}) => {
  const { user } = useAuth();
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [exams, certs] = await Promise.all([
          apiRequest<Examination[]>('/employee/examinations'),
          apiRequest<Certificate[]>('/certificates/my').catch(() => []),
        ]);
        setExaminations(exams);
        setCertificates(certs);
      } catch (err: any) {
        setError(err.message || 'Failed to load examinations');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Corporate Welcome Banner */}
      <div className="relative rounded-2xl p-8 bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
              AI SAMRAT Assessment Candidate Portal
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold">{user?.employeeCode}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.fullName}
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Department: <span className="font-semibold text-slate-800">{user?.department || 'Engineering'}</span> • 
            Designation: <span className="font-semibold text-slate-800">{user?.designation || 'Specialist'}</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Examinations feature server-authoritative timer, option randomization, green-box face tracking, and proctored dual-stream verification.
          </p>
        </div>

        {/* Quick Actions & Stats */}
        <div className="flex flex-wrap md:flex-nowrap gap-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3 min-w-[140px]">
            <BookOpen className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Available Exams</div>
              <div className="text-lg font-extrabold text-slate-900">{examinations.length}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3 min-w-[140px]">
            <Award className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Certificates</div>
              <div className="text-lg font-extrabold text-slate-900">{certificates.length}</div>
            </div>
          </div>

          {onViewSkillMatrix && (
            <button
              onClick={onViewSkillMatrix}
              className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-left transition flex items-center space-x-3 min-w-[170px]"
            >
              <Sparkles className="w-5 h-5 text-blue-700 shrink-0" />
              <div>
                <div className="text-[11px] text-blue-700 font-bold uppercase tracking-wider">Skill Matrix</div>
                <div className="text-xs font-semibold text-blue-900 flex items-center space-x-1">
                  <span>View Passport</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Available Technical Examinations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Assigned Technical Assessments</h2>
            <p className="text-xs text-slate-500">
              50 Technical MCQs • 60 Minutes • Passing score: 60% with instant official certificate
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
            Loading assigned examination modules...
          </div>
        ) : examinations.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl space-y-2">
            <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold">No active examinations assigned at this moment.</p>
            <p className="text-xs text-slate-400">Your department administrator will assign your next technical assessment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {examinations.map((exam) => (
              <div
                key={exam.id}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
                      Set {exam.setName}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exam.durationMinutes} mins</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition">
                    {exam.subject}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {exam.title}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Questions: <b className="text-slate-900">{exam.totalQuestions}</b></span>
                    <span>Total Marks: <b className="text-blue-700 font-bold">{exam.totalMarks}</b></span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-emerald-700 font-medium flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AI Proctored</span>
                  </div>
                  <button
                    onClick={() => onStartExam(exam)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center space-x-1.5 transition"
                  >
                    <span>Start Exam</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Earned Certificates Mini-Preview */}
      {certificates.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Verified Credentials</h2>
              <p className="text-xs text-slate-500">Official AI SAMRAT digitally verified completion certificates</p>
            </div>
            <button
              onClick={onViewCertificates}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center space-x-1 transition"
            >
              <span>View All Credentials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.slice(0, 3).map((cert) => (
              <div key={cert.id} className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-xs font-bold text-amber-700">{cert.grade}</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{cert.subject}</div>
                  <div className="text-[11px] font-mono text-slate-500 mt-1">{cert.certificateCode}</div>
                </div>
                <a
                  href={`/api/certificates/download/${cert.certificateCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition"
                  title="Download PDF Certificate"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
