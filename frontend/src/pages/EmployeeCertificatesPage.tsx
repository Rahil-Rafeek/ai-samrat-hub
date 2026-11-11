import React, { useState, useEffect } from 'react';
import { Certificate } from '../types';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DigitalCertificateView } from '../components/common/DigitalCertificateView';
import {
  Award,
  Download,
  ShieldCheck,
  Search,
  ArrowRight,
  Eye,
  Copy,
  Check,
  X
} from 'lucide-react';

interface EmployeeCertificatesPageProps {
  onGoToExams: () => void;
  onVerifyCertificate: (code: string) => void;
}

export const EmployeeCertificatesPage: React.FC<EmployeeCertificatesPageProps> = ({
  onGoToExams,
  onVerifyCertificate,
}) => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        setLoading(true);
        const res = await apiRequest<Certificate[]>('/certificates/my');
        setCertificates(res);
      } catch (e) {
        console.error('Error fetching employee certificates:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  const handleCopyLink = (code: string) => {
    const url = `${window.location.origin}/verify?code=${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const filtered = certificates.filter(
    (c) =>
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.certificateCode.toLowerCase().includes(search.toLowerCase()) ||
      (c.grade && c.grade.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Header Banner */}
      <div className="rounded-2xl p-8 bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
              Official Credential Registry
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold">{user?.employeeCode}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Earned Digital Certificates & Credentials
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            All certificates issued by AI SAMRAT are cryptographically registered, tamper-evident, and verifiable online through the central credential registry.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
            <Award className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Total Issued</div>
              <div className="text-xl font-extrabold text-slate-900">{certificates.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search credentials by subject, code, or grade..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
          />
        </div>
        <div className="text-xs text-slate-500">
          Showing <b className="text-slate-900">{filtered.length}</b> of {certificates.length} certificates
        </div>
      </div>

      {/* Certificates Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
          <div className="w-6 h-6 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
          <span className="text-xs font-semibold">Loading official credentials...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl space-y-3">
          <Award className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {certificates.length === 0 ? 'No Certificates Earned Yet' : 'No Matching Credentials Found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {certificates.length === 0
              ? 'Complete any assigned technical examination with 60% or above to instantly earn your verified digital certificate.'
              : 'Try clearing your search keyword to view all credentials.'}
          </p>
          {certificates.length === 0 && (
            <button
              onClick={onGoToExams}
              className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs inline-flex items-center space-x-1.5 transition"
            >
              <span>Take Technical Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cert) => (
            <div
              key={cert.certificateCode}
              className={`bg-white border rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 ${
                cert.status === 'REVOKED' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="space-y-4">
                {/* Header with grade and icon */}
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    cert.status === 'REVOKED'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {cert.status === 'REVOKED' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-rose-100 text-rose-800 border-rose-300 uppercase">
                        REVOKED
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                        cert.grade === 'DISTINCTION'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : cert.grade === 'ACHIEVEMENT'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {cert.gradeDisplayName || cert.grade}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {cert.subject}
                  </h3>
                  <div className="mt-1 text-xs text-slate-500 font-mono font-semibold">
                    ID: {cert.certificateCode}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Recipient:</span>
                    <strong className="text-slate-900">{cert.employeeName || user?.fullName || 'Candidate'}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Score Achieved:</span>
                    <strong className="text-blue-700 font-bold">
                      {cert.score != null ? cert.score.toFixed(1) : 0} / {cert.maxScore != null ? cert.maxScore.toFixed(1) : 100} ({cert.percentage != null ? cert.percentage.toFixed(1) : 0}%)
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Date Issued:</span>
                    <span>{cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'Active'}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPreviewCert(cert)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-2xs flex items-center justify-center space-x-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>Preview</span>
                  </button>

                  <a
                    href={`/api/certificates/download/${cert.certificateCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs flex items-center justify-center space-x-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </a>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyLink(cert.certificateCode)}
                    className="flex-1 py-1.5 px-3 rounded-xl text-[11px] font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition flex items-center justify-center space-x-1.5"
                    title="Copy Public Verification Link"
                  >
                    {copiedCode === cert.certificateCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onVerifyCertificate(cert.certificateCode)}
                    className="py-1.5 px-3 rounded-xl text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition flex items-center space-x-1"
                    title="Verify Certificate Authenticity"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* CERTIFICATE PREVIEW MODAL */}
      {/* ========================================================= */}
      {previewCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-5xl w-full max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Official Certificate Preview</h3>
                  <span className="text-xs font-mono text-slate-500 font-bold">{previewCert.certificateCode}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={`/api/certificates/download/${previewCert.certificateCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center space-x-1.5 shadow-xs transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>

                <button
                  onClick={() => setPreviewCert(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded Digital Certificate Component */}
            <div className="py-2 flex justify-center">
              <DigitalCertificateView
                certificateCode={previewCert.certificateCode}
                employeeName={previewCert.employeeName || user?.fullName || 'Candidate'}
                employeeCode={previewCert.employeeCode || user?.employeeCode || 'EMP-XXXX'}
                department={previewCert.department || 'Technical Engineering'}
                subject={previewCert.subject}
                score={previewCert.score}
                maxScore={previewCert.maxScore}
                percentage={previewCert.percentage}
                grade={previewCert.grade}
                gradeDisplayName={previewCert.gradeDisplayName}
                issueDate={previewCert.issueDate}
                examDate={previewCert.examDate}
                status={previewCert.status}
                qrCodeBase64={previewCert.qrCodeBase64}
                verificationUrl={previewCert.verificationUrl}
                signatoryName={previewCert.signatoryName || 'Deepak Ganer'}
                signatoryTitle={previewCert.signatoryTitle || 'Director & Authorised Signatory'}
                revocationReason={previewCert.revocationReason}
                revokedAt={previewCert.revokedAt}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
