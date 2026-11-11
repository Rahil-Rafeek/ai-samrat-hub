import React, { useState } from 'react';
import { apiRequest } from '../../services/api';
import { UserPlus, X, AlertCircle } from 'lucide-react';

interface AddEmployeeModalProps {
  onClose: () => void;
  onAdded: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ onClose, onAdded }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [phone, setPhone] = useState('');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().substring(0, 10));
  const [examEligibility, setExamEligibility] = useState('ELIGIBLE');
  const [assignedExamIds, setAssignedExamIds] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiRequest('/admin/employees/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName,
          email,
          department,
          designation,
          phone,
          joiningDate,
          examEligibility,
          assignedExamIds,
        }),
      });
      alert(`Employee registered successfully! An activation invitation has been generated.`);
      onAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add New Joining Employee</h2>
              <p className="text-xs text-slate-500">Register employee and generate unique AIS-EMP-XXXX code</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Vikramaditya Sharma"
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Official Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. employee@aisamrat.com"
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="Engineering">Engineering</option>
                <option value="Data Science">Data Science</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Full Stack Developer"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Joining Date</label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Exam Eligibility</label>
              <select
                value={examEligibility}
                onChange={(e) => setExamEligibility(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="ELIGIBLE">Eligible (Can take exams)</option>
                <option value="NOT_ASSIGNED">Not Assigned</option>
                <option value="TEMPORARILY_RESTRICTED">Temporarily Restricted</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Exam Access</label>
              <select
                value={assignedExamIds}
                onChange={(e) => setAssignedExamIds(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="ALL">All Available Exams</option>
                <option value="1,2">AI & ML Exams Only</option>
                <option value="3,4">Data Science & Java Only</option>
                <option value="5,6">Web & Shell Scripting Only</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
            Account will be created in <b className="text-slate-800">PENDING_ACTIVATION</b> status. A single-use activation email link (valid for 48 hours) will be automatically generated.
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl border border-slate-300 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition shadow-sm"
            >
              {loading ? 'Creating...' : 'Register Employee & Send Activation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

