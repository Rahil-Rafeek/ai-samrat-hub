import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CompanyLogo } from '../common/CompanyLogo';
import { User, LogOut, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (view: string) => void;
  activeView?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeView: _activeView }) => {
  const { user, logout } = useAuth();

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            SUPER ADMIN
          </span>
        );
      case 'EVALUATOR':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            EVALUATION OFFICIAL
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            EMPLOYEE
          </span>
        );
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-30 flex items-center justify-between px-6 shadow-xs">
      <div 
        className="flex items-center space-x-3 cursor-pointer group" 
        onClick={() => onNavigate && onNavigate('dashboard')}
        title="AI SAMRAT Assessment Hub"
      >
        <CompanyLogo size="md" showText={false} />
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              AI SAMRAT
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold tracking-wide">
              ASSESSMENT HUB
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium tracking-tight">
            Enterprise Assessment, Proctoring & Certification
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 pr-4 border-r border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-sm font-semibold text-slate-900">{user.fullName}</span>
                  {getRoleBadge(user.role)}
                </div>
                <p className="text-xs text-slate-500">
                  {user.employeeCode ? `${user.employeeCode} • ` : ''}
                  {user.department || user.designation || 'Staff'}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate && onNavigate('verify')}
              className="flex items-center space-x-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verify Certificate</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
