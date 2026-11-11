import React, { useEffect } from 'react';
import { SubmitExamResponse } from '../types';
import { proctoringMedia } from '../services/proctoring';
import { CompanyLogo } from '../components/common/CompanyLogo';
import confetti from 'canvas-confetti';
import {
  Award,
  XCircle,
  Download,
  ShieldCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface SubmissionResultPageProps {
  result: SubmitExamResponse;
  onReturnDashboard: () => void;
  onVerifyCertificate: (code: string) => void;
}

export const SubmissionResultPage: React.FC<SubmissionResultPageProps> = ({
  result,
  onReturnDashboard,
  onVerifyCertificate,
}) => {
  useEffect(() => {
    // Fail-safe: Hardware security protocols shutdown immediately
    proctoringMedia.stopAll();
    try {
      if (typeof document !== 'undefined' && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {}

    if (result.isPassed) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#10B981', '#38BDF8', '#F59E0B'],
      });
    }
  }, [result.isPassed]);

  const isTerminated = result.status === 'TERMINATED_VIOLATION';

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col justify-between p-6 lg:p-10 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <CompanyLogo size="md" showText={false} />
          <span className="text-xs font-semibold text-slate-500 font-mono">
            Status: {result.status}
          </span>
        </div>

        {/* Main Scorecard Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 md:p-10 shadow-xs space-y-8 text-center">
          {/* Status Badge & Icon */}
          <div className="space-y-4">
            <div
              className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xs ${
                isTerminated
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : result.isPassed
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-amber-50 text-amber-600 border border-amber-200'
              }`}
            >
              {isTerminated ? (
                <AlertTriangle className="w-10 h-10" />
              ) : result.isPassed ? (
                <Award className="w-10 h-10" />
              ) : (
                <XCircle className="w-10 h-10" />
              )}
            </div>

            <div>
              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                  isTerminated
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : result.isPassed
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {isTerminated
                  ? 'Terminated - Malpractice Violation'
                  : result.isPassed
                  ? `Certified • Grade ${result.grade}`
                  : 'Assessment Completed - Passing Threshold Not Met'}
              </span>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
                {isTerminated
                  ? 'Examination Automatically Terminated'
                  : result.isPassed
                  ? 'Congratulations! Assessment Passed'
                  : 'Examination Submitted'}
              </h1>

              <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
                {result.message ||
                  'Your responses have been sealed and permanently stored in PostgreSQL with complete evaluation audit trail.'}
              </p>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold block">Total Score</span>
              <div className="text-2xl font-extrabold text-blue-700">
                {result.score.toFixed(1)}
              </div>
              <span className="text-[10px] text-slate-400">Out of {result.maxScore.toFixed(1)}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold block">Percentage</span>
              <div
                className={`text-2xl font-extrabold ${
                  result.isPassed ? 'text-emerald-700' : 'text-slate-700'
                }`}
              >
                {result.percentage.toFixed(1)}%
              </div>
              <span className="text-[10px] text-slate-400">Passing: 60.0%</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold block">Questions</span>
              <div className="text-2xl font-extrabold text-slate-900">
                {result.answeredCount} / {result.totalQuestions}
              </div>
              <span className="text-[10px] text-slate-400">Answered</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold block">Grade Result</span>
              <div className="text-2xl font-extrabold text-slate-900">
                {result.grade || (result.isPassed ? 'PASS' : 'FAIL')}
              </div>
              <span className="text-[10px] text-slate-400">
                {result.isPassed ? 'Official Merit' : 'Uncertified'}
              </span>
            </div>
          </div>

          {/* Certificate Award Banner (if passed) */}
          {result.isPassed && result.certificateCode && (
            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                    Official Digital Credential Issued
                  </span>
                  <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                    {result.certificateCode}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Includes dynamic verification QR code and tamper-evident cryptographic signature.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href={`/api/certificates/download/${result.certificateCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center space-x-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
                <button
                  onClick={() => onVerifyCertificate(result.certificateCode!)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs flex items-center space-x-1 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Verify</span>
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onReturnDashboard}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200/80 transition flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Return to Assessment Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
        AI SAMRAT PRIVATE LIMITED • Assessment Hub
      </footer>
    </div>
  );
};
