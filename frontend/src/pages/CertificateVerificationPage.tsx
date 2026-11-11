import React, { useState, useEffect } from 'react';
import { CertificateVerifyData } from '../types';
import { apiRequest } from '../services/api';
import { CompanyLogo } from '../components/common/CompanyLogo';
import { DigitalCertificateView } from '../components/common/DigitalCertificateView';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Download,
  ArrowLeft,
  Award,
  User,
  BookOpen,
  Copy,
  Check,
  Eye,
  AlertTriangle,
  Building2
} from 'lucide-react';

interface CertificateVerificationPageProps {
  initialCode?: string;
  onBack?: () => void;
}

export const CertificateVerificationPage: React.FC<CertificateVerificationPageProps> = ({
  initialCode = '',
  onBack,
}) => {
  const [code, setCode] = useState(initialCode);
  const [data, setData] = useState<CertificateVerifyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showFullCert, setShowFullCert] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleVerify = async (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await apiRequest<CertificateVerifyData>(
        `/certificates/verify/${encodeURIComponent(codeToVerify.trim())}`
      );
      setData(res);
    } catch {
      setData({
        isValid: false,
        certificateCode: codeToVerify,
        message: 'Unable to locate certificate record in the official AI SAMRAT credential registry. Please check the code.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      handleVerify(initialCode);
    } else if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const qCode = urlParams.get('code') || urlParams.get('cert');
      if (qCode) {
        setCode(qCode);
        handleVerify(qCode);
      }
    }
  }, [initialCode]);

  const handleCopyLink = () => {
    if (!data) return;
    const url = `${window.location.origin}/verify?code=${encodeURIComponent(data.certificateCode)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isRevoked = data?.status === 'REVOKED';

  return (
    <div className="min-h-screen bg-[#FBFBFA] p-6 flex flex-col justify-between max-w-5xl mx-auto selection:bg-blue-100 selection:text-blue-900 font-sans">
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <CompanyLogo size="md" showText={false} />
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                AI SAMRAT Credential Registry
              </h1>
              <p className="text-xs text-slate-500">Official Public Certificate Verification System</p>
            </div>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 shadow-xs hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Enter Certificate ID or Scan Verification Code
          </label>
          <div className="flex space-x-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. AIS-CERT-2026-000001 or AIS-CERT-2026-X8841"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition uppercase"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleVerify(code);
                }}
              />
            </div>
            <button
              onClick={() => handleVerify(code)}
              disabled={loading || !code.trim()}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-xs transition flex items-center space-x-1.5 shrink-0"
            >
              {loading ? (
                <span>Checking Registry...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Credential</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Verification Result Card */}
        {searched && data && (
          <div className="space-y-6">
            <div
              className={`border rounded-2xl p-7 shadow-xs animate-in fade-in zoom-in duration-200 ${
                data.isValid
                  ? 'bg-white border-emerald-300 ring-1 ring-emerald-200/60'
                  : isRevoked
                  ? 'bg-white border-rose-300 ring-1 ring-rose-200/60'
                  : 'bg-white border-slate-300 ring-1 ring-slate-200/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                      data.isValid
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : isRevoked
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}
                  >
                    {data.isValid ? (
                      <CheckCircle2 className="w-7 h-7" />
                    ) : isRevoked ? (
                      <AlertTriangle className="w-7 h-7" />
                    ) : (
                      <XCircle className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                          data.isValid
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isRevoked
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {data.isValid
                          ? 'Authentic Credential'
                          : isRevoked
                          ? 'Certificate Revoked'
                          : 'Certificate Not Found'}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-600">
                        {data.certificateCode}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">
                      {data.isValid
                        ? `${data.subject} Technical Assessment`
                        : isRevoked
                        ? 'Revoked Credential Record'
                        : 'Record Not Found in Central Registry'}
                    </h2>
                  </div>
                </div>

                {data.isValid && (
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
                      {data.gradeDisplayName || data.grade || 'CERTIFIED'}
                    </span>
                  </div>
                )}
              </div>

              {/* Status details */}
              {data.isValid ? (
                <div className="mt-6 space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Recipient</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900">{data.employeeName}</div>
                      <div className="text-[10px] font-mono text-slate-500">{data.employeeCode}</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        <span>Assessment Track</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900">{data.subject}</div>
                      <div className="text-[10px] text-slate-500">Score: {data.score ?? 0} / {data.maxScore ?? 100}</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5 text-slate-500" />
                        <span>Achievement Tier</span>
                      </div>
                      <div className="text-xs font-bold text-blue-700">{data.gradeDisplayName || data.grade}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">Standard Verified</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Issuing Body</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900">AI SAMRAT PRIVATE LIMITED</div>
                      <div className="text-[10px] text-slate-500">
                        Issued: {data.issueDate ? new Date(data.issueDate).toLocaleDateString() : 'Active'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setShowFullCert(!showFullCert)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center space-x-1.5"
                    >
                      <Eye className="w-4 h-4 text-slate-600" />
                      <span>{showFullCert ? 'Hide Certificate View' : 'View Full Certificate'}</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleCopyLink}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition flex items-center space-x-1.5"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{copied ? 'Link Copied' : 'Share Verification Link'}</span>
                      </button>

                      <a
                        href={`/api/certificates/download/${data.certificateCode}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center space-x-1.5 shadow-xs"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Official PDF</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : isRevoked ? (
                <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-2">
                  <div className="font-bold flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Official Notice: This certificate has been revoked.</span>
                  </div>
                  <p className="text-slate-600">
                    <b>Revocation Reason:</b> {data.revocationReason || 'Revoked per official administrative governance review.'}
                  </p>
                  {data.revokedAt && (
                    <p className="text-slate-500 text-[11px]">
                      Revoked On: {new Date(data.revokedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                  {data.message}
                </p>
              )}
            </div>

            {/* Embedded Full Digital Certificate Showcase */}
            {data.isValid && showFullCert && (
              <div className="pt-2 animate-in fade-in duration-300">
                <DigitalCertificateView
                  certificateCode={data.certificateCode}
                  employeeName={data.employeeName || 'Candidate'}
                  employeeCode={data.employeeCode || 'EMP-XXXX'}
                  subject={data.subject || 'Enterprise Subject'}
                  score={data.score ?? 0}
                  maxScore={data.maxScore ?? 100}
                  percentage={data.percentage ?? 0}
                  grade={data.grade ? String(data.grade) : 'CERTIFIED'}
                  gradeDisplayName={data.gradeDisplayName}
                  issueDate={data.issueDate || ''}
                  examDate={data.examDate}
                  status={data.status || 'VALID'}
                  qrCodeBase64={data.qrCodeBase64}
                  signatoryName={data.directorName || data.signatoryName || 'Deepak Ganer'}
                  signatoryTitle={data.directorTitle || data.signatoryTitle || 'Director & Authorised Signatory'}
                  revocationReason={data.revocationReason}
                  revokedAt={data.revokedAt}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} AI SAMRAT PRIVATE LIMITED. All rights reserved.</span>
        <span>Enterprise Technical Assessment & Credential Infrastructure</span>
      </footer>
    </div>
  );
};
