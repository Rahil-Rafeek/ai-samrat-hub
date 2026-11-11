import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { CompanyLogo } from '../common/CompanyLogo';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  X,
  Send,
  Mail,
  Edit2,
  Check
} from 'lucide-react';

interface RosterEntry {
  id: number;
  fullName: string;
  email: string;
  source: string;
  needsReview: boolean;
  reviewReason?: string;
  suggestedEmployeeId: string;
  department: string;
  designation: string;
}

interface RosterImportModalProps {
  onClose: () => void;
  onImportComplete: () => void;
}

export const RosterImportModal: React.FC<RosterImportModalProps> = ({
  onClose,
  onImportComplete,
}) => {
  const [entries, setEntries] = useState<RosterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'ready' | 'review' | 'preview'>('ready');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [previewEntry, setPreviewEntry] = useState<RosterEntry | null>(null);

  useEffect(() => {
    apiRequest<RosterEntry[]>('/admin/roster/initial')
      .then((data) => {
        setEntries(data);
        if (data.length > 0) setPreviewEntry(data[0]);
      })
      .catch((err) => console.error('Failed to load roster extraction:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveName = (id: number) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, fullName: editName.trim(), needsReview: false } : e
      )
    );
    setEditingId(null);
  };

  const handleApproveImport = async () => {
    if (
      !confirm(
        `Approve and provision ${entries.length} employee accounts into PostgreSQL with unique AIS-EMP-XXXX IDs and activation invitations?`
      )
    )
      return;

    setImporting(true);
    try {
      const res: any = await apiRequest('/admin/roster/approve-import', {
        method: 'POST',
        body: JSON.stringify({ approvedEntries: entries, defaultDepartment: 'Engineering' }),
      });
      alert(res.message || `Successfully provisioned ${res.importedCount} employee accounts!`);
      onImportComplete();
      onClose();
    } catch (err: any) {
      alert(`Provisioning failed: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const readyEntries = entries.filter((e) => !e.needsReview);
  const reviewEntries = entries.filter((e) => e.needsReview);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">
                  Initial Employee Roster Extraction
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                  SCREENSHOT SOURCE
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Extracted 43 entries from AI SAMRAT company distribution screenshots
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar & Summary Metrics */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-white text-xs">
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveTab('ready')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition ${
                activeTab === 'ready'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Roster ({readyEntries.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition ${
                activeTab === 'review'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Requires Review ({reviewEntries.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition ${
                activeTab === 'preview'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Activation Email Preview</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500">
            Total Extracted: <b className="text-slate-800">{entries.length}</b> • Ready: <b className="text-emerald-700">{readyEntries.length}</b>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading extracted roster...</div>
          ) : activeTab === 'ready' ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">ID Code</th>
                    <th className="p-3">Employee Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {readyEntries.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-mono text-blue-700 font-semibold">{e.suggestedEmployeeId}</td>
                      <td className="p-3 font-semibold text-slate-900">{e.fullName}</td>
                      <td className="p-3 font-mono text-slate-600">{e.email}</td>
                      <td className="p-3 text-slate-600">{e.department}</td>
                      <td className="p-3 text-[11px] text-slate-500">{e.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'review' ? (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  The following 7 entries had missing names or channel aliases in the screenshot headers. You may edit their display names before saving.
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">ID Code</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Name / Inferred Identity</th>
                      <th className="p-3">Audit Note</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {reviewEntries.map((e) => (
                      <tr key={e.id} className="hover:bg-amber-50/30 transition">
                        <td className="p-3 font-mono text-blue-700 font-semibold">{e.suggestedEmployeeId}</td>
                        <td className="p-3 font-mono text-slate-700">{e.email}</td>
                        <td className="p-3">
                          {editingId === e.id ? (
                            <div className="flex items-center space-x-1.5">
                              <input
                                type="text"
                                value={editName}
                                onChange={(ev) => setEditName(ev.target.value)}
                                className="px-2 py-1 text-xs border border-blue-400 rounded focus:outline-none"
                              />
                              <button
                                onClick={() => handleSaveName(e.id)}
                                className="p-1 bg-emerald-600 text-white rounded"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="font-semibold text-slate-900">{e.fullName}</span>
                          )}
                        </td>
                        <td className="p-3 text-[11px] text-amber-700">{e.reviewReason}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setEditingId(e.id);
                              setEditName(e.fullName);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1 ml-auto"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Email Preview Tab */
            <div className="max-w-xl mx-auto border border-slate-200 rounded-2xl p-6 bg-white shadow-sm space-y-5">
              <div className="pb-4 border-b border-slate-200">
                <CompanyLogo size="md" />
              </div>

              <div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
                  Corporate Provisioning Invitation
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Welcome to AI SAMRAT Assessment Hub
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Dear <b className="text-slate-900">{previewEntry?.fullName || 'Employee'}</b>, an official technical assessment account has been provisioned for you.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-600">
                <div><span className="text-slate-400">Employee ID:</span> <b className="text-slate-900 font-mono">{previewEntry?.suggestedEmployeeId}</b></div>
                <div><span className="text-slate-400">Registered Email:</span> <b className="text-slate-900">{previewEntry?.email}</b></div>
                <div><span className="text-slate-400">Temporary Status:</span> <span className="text-amber-700 font-semibold">Pending Activation</span></div>
                <div><span className="text-slate-400">Link Validity:</span> <span>48 Hours Single-Use</span></div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm pointer-events-none"
                >
                  Activate Your Account & Set Password
                </button>
                <p className="text-[10px] text-slate-400 mt-2">
                  Note: Never share this link. Plaintext passwords are never transmitted by email.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl border border-slate-300 hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleApproveImport}
            disabled={importing}
            className="flex items-center space-x-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{importing ? 'Provisioning...' : `Approve & Provision Roster (${entries.length})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
