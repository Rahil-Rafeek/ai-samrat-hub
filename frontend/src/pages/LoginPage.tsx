import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
import {
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Sparkles,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

interface LoginPageProps {
  onVerifyClick?: () => void;
  onActivateClick?: () => void;
  onBackToLanding?: () => void;
  initialMode?: 'register' | 'login';
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onVerifyClick, 
  onActivateClick, 
  onBackToLanding,
  initialMode = 'register'
}) => {
  const { login, registerCandidate } = useAuth();
  const [mode, setMode] = useState<'register' | 'login'>(initialMode);

  // Sign In Form States
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@1234');

  // Student Registration Form States (Matches AI SAMRAT Specification & Mockup)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [semester, setSemester] = useState('');
  const [stream, setStream] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !firstName) {
      setError('First name and email address are required.');
      return;
    }

    setLoading(true);

    try {
      await registerCandidate({
        firstName,
        lastName,
        email,
        phoneNumber,
        semester,
        stream,
        password: regPassword || 'Pass@1234',
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check details or sign in.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(null);
    setMode('login');
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col justify-center items-center px-4 py-10 selection:bg-blue-100 selection:text-blue-900">
      <div className="w-full max-w-[540px] space-y-6">
        {onBackToLanding && (
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToLanding}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition flex items-center space-x-1"
            >
              <span>← Back to Public Portal</span>
            </button>
          </div>
        )}
        {/* Top Header - Official AI SAMRAT Logo & Portal Title */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img
              src={logoImg}
              alt="AI SAMRAT PRIVATE LIMITED"
              className="h-16 md:h-20 max-w-[320px] w-auto object-contain"
            />
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            Technical Assessment Portal
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            {mode === 'register' ? 'Student Registration' : 'Candidate & Administrator Sign In'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-4 p-1 rounded-xl bg-slate-100/80 border border-slate-200/80 flex items-center space-x-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`px-4 py-1.5 rounded-lg transition ${
                mode === 'register'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Student Registration
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`px-4 py-1.5 rounded-lg transition ${
                mode === 'login'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Candidate Sign In
            </button>
          </div>
        </div>

        {/* Form Container Card (Matches Clean Off-White Layout from Reference) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-7 md:p-8 shadow-xs space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE 1: STUDENT REGISTRATION (EXACT MATCH TO REFERENCE PHOTO) */}
          {mode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Row 1: First Name & Last Name (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="chadhana"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="chadhana"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                  />
                </div>
              </div>

              {/* Row 2: Email Address (Full Width) */}
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter email address"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                />
              </div>

              {/* Row 3: Phone Number (Full Width) */}
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter 10-digit phone number"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                />
              </div>

              {/* Row 4: Semester & Stream (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                    Semester
                  </label>
                  <div className="relative">
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition pr-9"
                    >
                      <option value="">Select semester</option>
                      <option value="1st Semester">1st Semester</option>
                      <option value="2nd Semester">2nd Semester</option>
                      <option value="3rd Semester">3rd Semester</option>
                      <option value="4th Semester">4th Semester</option>
                      <option value="5th Semester">5th Semester</option>
                      <option value="6th Semester">6th Semester</option>
                      <option value="7th Semester">7th Semester</option>
                      <option value="8th Semester">8th Semester</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                    Stream
                  </label>
                  <div className="relative">
                    <select
                      value={stream}
                      onChange={(e) => setStream(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition pr-9"
                    >
                      <option value="">Select stream</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Java Programming">Java Programming</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Shell Scripting">Shell Scripting</option>
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 5: Password (Full Width) */}
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Register & Access Assessment</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="text-xs text-slate-500 hover:text-blue-700 transition"
                >
                  Already have an account? <b className="text-blue-600">Sign In Here</b>
                </button>
              </div>
            </form>
          ) : (
            /* MODE 2: CANDIDATE / EMPLOYEE SIGN IN */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                  Username / Email / Employee ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter email or employee ID (e.g. emp001 or admin)"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[13px] font-semibold text-slate-700">
                    Password
                  </label>
                  {onActivateClick && (
                    <button
                      type="button"
                      onClick={onActivateClick}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Set Password / Activate
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Demo Evaluation Credentials Quick-Fill */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  <span>Quick Evaluation Roles</span>
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDemoAccount('admin', 'Admin@1234')}
                    className={`p-2 rounded-lg text-left border transition ${
                      username === 'admin'
                        ? 'bg-purple-50 border-purple-300 text-purple-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-semibold text-purple-700">Super Admin</div>
                    <div className="text-[10px] text-slate-500">Command Centre</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDemoAccount('evaluator', 'Eval@1234')}
                    className={`p-2 rounded-lg text-left border transition ${
                      username === 'evaluator'
                        ? 'bg-sky-50 border-sky-300 text-sky-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-semibold text-sky-700">Evaluator</div>
                    <div className="text-[10px] text-slate-500">Grading & Review</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDemoAccount('emp001', 'Emp@1234')}
                    className={`p-2 rounded-lg text-left border transition ${
                      username === 'emp001'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-semibold text-emerald-700">Employee 1</div>
                    <div className="text-[10px] text-slate-500">Candidate (AI Track)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDemoAccount('emp003', 'Emp@1234')}
                    className={`p-2 rounded-lg text-left border transition ${
                      username === 'emp003'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-semibold text-emerald-700">Employee 3</div>
                    <div className="text-[10px] text-slate-500">Devendra (Java)</div>
                  </button>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="text-xs text-slate-500 hover:text-blue-700 transition"
                >
                  Need to register as a student? <b className="text-blue-600">Register Here</b>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Action Links */}
        <div className="flex flex-col items-center space-y-2 text-xs">
          {onActivateClick && (
            <button
              onClick={onActivateClick}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1 hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Received an activation invitation? Activate Account Here</span>
            </button>
          )}

          {onVerifyClick && (
            <button
              onClick={onVerifyClick}
              className="text-slate-500 hover:text-slate-800 flex items-center space-x-1 hover:underline pt-0.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verify Employee Certificate Authenticity</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
