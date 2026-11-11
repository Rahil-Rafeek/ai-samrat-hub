import React from 'react';
import { CheckCircle2, XCircle, QrCode } from 'lucide-react';

export interface DigitalCertificateProps {
  certificateCode: string;
  employeeName: string;
  employeeCode: string;
  department?: string;
  subject: string;
  score: number;
  maxScore?: number;
  percentage: number;
  grade: string;
  gradeDisplayName?: string;
  issueDate: string;
  examDate?: string;
  status: 'VALID' | 'REVOKED' | string;
  qrCodeBase64?: string;
  verificationUrl?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  revocationReason?: string;
  revokedAt?: string;
}

export const DigitalCertificateView: React.FC<DigitalCertificateProps> = ({
  certificateCode,
  employeeName,
  employeeCode,
  department = 'Technical Engineering',
  subject,
  score,
  maxScore = 100,
  percentage,
  grade,
  gradeDisplayName,
  issueDate,
  examDate,
  status,
  qrCodeBase64,
  verificationUrl,
  signatoryName = 'Deepak Ganer',
  signatoryTitle = 'Director & Authorised Signatory',
  revocationReason,
  revokedAt,
}) => {
  const isRevoked = status === 'REVOKED';

  const formattedIssueDate = issueDate
    ? new Date(issueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Active';

  const formattedExamDate = examDate
    ? new Date(examDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : formattedIssueDate;

  const displayGrade = gradeDisplayName || grade || 'CERTIFIED';

  const fullVerifyUrl =
    verificationUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/verify?code=${encodeURIComponent(certificateCode)}`
      : `http://localhost:5173/verify?code=${encodeURIComponent(certificateCode)}`);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#FCFCFA] text-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-[#0F172A] overflow-hidden select-none transition-all font-sans">
      {/* Inner Decorative Gold Border */}
      <div className="absolute inset-2 sm:inset-3 border-2 border-[#D97706]/85 rounded-2xl pointer-events-none" />

      {/* Elegant Corner Motifs */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#B45309] pointer-events-none" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#B45309] pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#B45309] pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#B45309] pointer-events-none" />

      {/* Subtle Translucent Official Logo Watermark in Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none scale-125">
        <img
          src="/logo.png"
          alt=""
          className="max-w-[420px] max-h-[220px] object-contain filter grayscale"
        />
      </div>

      {/* Certificate Content Container */}
      <div className="relative z-10 flex flex-col justify-between space-y-6 text-center">
        {/* ========================================================= */}
        {/* HEADER SECTION: Logo + Official Company Name */}
        {/* ========================================================= */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-center items-center">
            <img
              src="/logo.png"
              alt="AI SAMRAT"
              className="h-10 sm:h-12 object-contain drop-shadow-2xs"
            />
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase mt-1">
            AI SAMRAT PRIVATE LIMITED
          </h2>
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold tracking-widest uppercase">
            Enterprise Technical Assessment & Certification
          </p>
        </div>

        {/* ========================================================= */}
        {/* MAIN TITLE: CERTIFICATE OF ACHIEVEMENT */}
        {/* ========================================================= */}
        <div className="py-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-wider text-slate-900 uppercase">
            Certificate of Achievement
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D97706] to-transparent mx-auto mt-2" />
        </div>

        {/* ========================================================= */}
        {/* RECIPIENT SECTION */}
        {/* ========================================================= */}
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-serif italic text-slate-600">
            This certificate is proudly presented to
          </p>
          <div className="text-xl sm:text-3xl font-serif font-black text-blue-900 tracking-wide uppercase pt-1">
            {employeeName}
          </div>
          <div className="text-[11px] sm:text-xs text-slate-500 font-medium space-x-2">
            <span>Employee ID: <strong className="font-mono text-slate-700">{employeeCode}</strong></span>
            <span>•</span>
            <span>Department: <strong className="text-slate-700">{department}</strong></span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ACHIEVEMENT & SUPPORTING STATEMENT */}
        {/* ========================================================= */}
        <div className="space-y-2 max-w-2xl mx-auto">
          <p className="text-xs text-slate-600">
            For successfully completing the
          </p>
          <div className="text-base sm:text-xl font-bold text-slate-900">
            {subject}
            <span className="block text-[11px] sm:text-xs text-blue-700 font-semibold uppercase tracking-wider mt-0.5">
              Technical Assessment
            </span>
          </div>
          <p className="text-[11px] sm:text-xs font-serif italic text-slate-600 leading-relaxed px-4">
            "This certificate is proudly presented in recognition of successfully demonstrating technical knowledge and competency through the AI SAMRAT Enterprise Technical Assessment."
          </p>
        </div>

        {/* ========================================================= */}
        {/* PERFORMANCE DETAILS BADGE ROW */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto w-full pt-1">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assessment Score</span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
              {Number(score).toFixed(1)} / {Number(maxScore).toFixed(1)} ({Number(percentage).toFixed(1)}%)
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Achievement Level</span>
            <span className={`text-xs sm:text-sm font-extrabold uppercase ${
              grade === 'DISTINCTION'
                ? 'text-amber-700'
                : grade === 'ACHIEVEMENT'
                ? 'text-blue-700'
                : 'text-emerald-700'
            }`}>
              {displayGrade}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Examination Date</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {formattedExamDate}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Certificate Issue Date</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {formattedIssueDate}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* FOOTER SECTION: Verification | QR Code | Signatory */}
        {/* ========================================================= */}
        <div className="pt-4 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-left">
          {/* Left: Verification Metadata */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Unique Certificate ID
            </span>
            <div className="font-mono font-bold text-xs sm:text-sm text-slate-900">
              {certificateCode}
            </div>
            <div className="flex items-center space-x-1.5 pt-0.5">
              {!isRevoked ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    Verified & Active Credential
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                    Revoked Credential
                  </span>
                </>
              )}
            </div>
            <span className="text-[9px] font-mono text-slate-400 block truncate max-w-[220px]">
              {fullVerifyUrl}
            </span>
          </div>

          {/* Center: QR Code */}
          <div className="flex flex-col items-center justify-center text-center">
            {qrCodeBase64 ? (
              <img
                src={`data:image/png;base64,${qrCodeBase64}`}
                alt="Verification QR"
                className="w-16 h-16 rounded-lg border border-slate-200 p-1 bg-white shadow-2xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 shadow-2xs">
                <QrCode className="w-8 h-8 text-slate-700" />
              </div>
            )}
            <span className="text-[9px] text-slate-500 font-medium mt-1">
              Scan to Verify Credential
            </span>
          </div>

          {/* Right: Authorised Signatory */}
          <div className="text-right space-y-0.5">
            <div className="w-40 ml-auto border-b border-slate-400 pb-1 mb-1">
              <span className="font-serif italic text-xs text-slate-600">Authorised Signatory</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">
              {signatoryName}
            </div>
            <div className="text-[10px] text-slate-600 font-medium">
              {signatoryTitle}
            </div>
            <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
              AI SAMRAT PRIVATE LIMITED
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* REVOCATION WATERMARK OVERLAY (When revoked) */}
      {/* ========================================================= */}
      {isRevoked && (
        <div className="absolute inset-0 bg-rose-900/10 backdrop-blur-[1px] pointer-events-none flex flex-col items-center justify-center z-20 space-y-2 p-4">
          <div className="border-4 border-rose-600 text-rose-600 px-8 py-3 rounded-2xl transform -rotate-12 uppercase tracking-widest font-black text-2xl sm:text-4xl opacity-80 shadow-lg bg-white/90">
            REVOKED / CANCELLED
          </div>
          {revocationReason && (
            <div className="bg-white/95 px-4 py-1.5 rounded-xl border border-rose-300 text-rose-800 text-xs font-semibold shadow-xs max-w-md text-center transform -rotate-12">
              Reason: {revocationReason} {revokedAt ? `(${new Date(revokedAt).toLocaleDateString()})` : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
