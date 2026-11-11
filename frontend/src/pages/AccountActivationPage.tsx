import React, { useState, useEffect } from 'react';
import { CompanyLogo } from '../components/common/CompanyLogo';
import { apiRequest } from '../services/api';
import {
  Lock,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface AccountActivationPageProps {
  initialToken?: string;
  onActivated: () => void;
  onGoToLogin: () => void;
}

export const AccountActivationPage: React.FC<AccountActivationPageProps> = ({
  initialToken = '',
  onActivated,
  onGoToLogin,
}) => {
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  useEffect(() => {
    // Read ?token= from window.location.search if not provided in props
    if (!token && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      if (urlToken) setToken(urlToken);
    }
  }, [token]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token.trim()) {
      setError('Please provide a valid single-use activation token.');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter confirmation password.');
      return;
    }

    setLoading(true);
    try {
      const res: any = await apiRequest('/auth/activate', {
        method: 'POST',
        body: JSON.stringify({
          token: token.trim(),
          password,
          confirmPassword,
        }),
      });

      setSuccessData(res);
    } catch (err: any) {
      setError(err.message || 'Account activation failed. The link may have expired or already been used.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6 text-slate-800">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200">
        <CompanyLogo size="md" />
        <button
          onClick={onGoToLogin}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 transition"
        >
          Sign In
        </button>
      </div>

      {/* Main Activation Card */}
      <div className="max-w-md mx-auto w-full my-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
          {successData ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
                  Account Activated
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-3">Welcome to AI SAMRAT</h2>
                <p className="text-xs text-slate-600 mt-1">
                  Employee account for <b className="text-slate-800">{successData.fullName}</b> ({successData.employeeCode}) has been successfully activated.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left text-slate-600 space-y-1.5">
                <div><span className="text-slate-400">Employee ID:</span> <b className="text-slate-900 font-mono">{successData.employeeCode}</b></div>
                <div><span className="text-slate-400">Email:</span> <b className="text-slate-900">{successData.email}</b></div>
                <div><span className="text-slate-400">Status:</span> <span className="text-emerald-700 font-semibold">Active & Eligible</span></div>
              </div>

              <button
                onClick={onActivated}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm flex items-center justify-center space-x-2"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
                  Secure Provisioning
                </span>
                <h1 className="text-xl font-bold text-slate-900 mt-2">
                  Activate Your Employee Account
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Set a secure password for your individual corporate assessment account.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              <form onSubmit={handleActivate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Activation Token
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Paste activation token from email"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Create Secure Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      required
                      minLength={8}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter chosen password"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
                  <div className="font-semibold text-slate-700 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Security Requirements:</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className={`w-3 h-3 ${password.length >= 8 ? 'text-emerald-600 font-bold' : 'text-slate-400'}`} />
                    <span>At least 8 characters long</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Check className={`w-3 h-3 ${password && password === confirmPassword ? 'text-emerald-600 font-bold' : 'text-slate-400'}`} />
                    <span>Password confirmation matches</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
                >
                  {loading ? 'Activating Account...' : 'Set Password & Activate'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-400 pt-6">
        AI SAMRAT PRIVATE LIMITED • Official Enterprise Credential Provisioning System
      </div>
    </div>
  );
};

