import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Video,
  FileCheck,
  BarChart3,
  Users,
  ShieldCheck,
  HardDrive,
  Code,
  Sparkles,
  Activity,
  Layers
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView }) => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const employeeLinks: NavItem[] = [
    { id: 'dashboard', label: 'My Assessments', icon: LayoutDashboard },
    { id: 'skillmatrix', label: 'Skill Passport & Matrix', icon: Sparkles, badge: 'NEW', badgeColor: 'bg-blue-600 text-white' },
    { id: 'coding', label: 'Coding Assessment Lab', icon: Code, badge: 'PRO', badgeColor: 'bg-emerald-600 text-white' },
    { id: 'certificates', label: 'Earned Certificates', icon: Award },
    { id: 'verify', label: 'Verify Credential', icon: ShieldCheck },
  ];

  const evaluatorLinks: NavItem[] = [
    { id: 'submissions', label: 'Answer-Sheet Review', icon: FileCheck },
    { id: 'coding', label: 'Coding Assessment Lab', icon: Code },
    { id: 'verify', label: 'Verify Credential', icon: ShieldCheck },
  ];

  const adminLinks: NavItem[] = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'employees', label: 'Employee Management', icon: Users, badge: '43', badgeColor: 'bg-blue-600 text-white' },
    { id: 'examinations', label: 'Exam Management (12)', icon: Layers },
    { id: 'intelligence', label: 'Intelligence Centre', icon: Sparkles, badge: 'AI', badgeColor: 'bg-purple-600 text-white' },
    { id: 'proctoring', label: 'Live Proctoring Wall', icon: Video, badge: 'LIVE', badgeColor: 'bg-rose-600 text-white' },
    { id: 'submissions', label: 'Answer-Sheet Review', icon: FileCheck },
    { id: 'coding', label: 'Coding Assessment Lab', icon: Code, badge: 'IDE', badgeColor: 'bg-slate-700 text-white' },
    { id: 'questions', label: 'Question Bank (600)', icon: BookOpen },
    { id: 'certificates', label: 'Certificates Registry', icon: Award },
    { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
    { id: 'systemHealth', label: 'System Health', icon: Activity },
    { id: 'backups', label: 'Backup & Recovery', icon: HardDrive },
    { id: 'verify', label: 'Verify Credential', icon: ShieldCheck },
  ];

  let links = employeeLinks;
  if (role === 'SUPER_ADMIN') links = adminLinks;
  else if (role === 'EVALUATOR') links = evaluatorLinks;

  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Main Navigation
          </p>
          {links.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition text-left ${
                  active
                    ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center space-x-2 text-blue-700 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Integrity Guard 2.0</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          3-warning policy, real-time green box face tracking, and dual webcam-screen proctoring active.
        </p>
      </div>
    </aside>
  );
};
