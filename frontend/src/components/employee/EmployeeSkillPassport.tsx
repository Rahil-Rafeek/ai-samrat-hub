import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';
import { SkillMatrixDto } from '../../types';
import {
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  ShieldCheck,
  RefreshCw,
  Compass
} from 'lucide-react';

export const EmployeeSkillPassport: React.FC = () => {
  const { user } = useAuth();
  const [matrix, setMatrix] = useState<SkillMatrixDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkillMatrix = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest<SkillMatrixDto>('/employee/examinations/skill-matrix');
      setMatrix(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load skill matrix.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillMatrix();
  }, []);

  const getTierColor = (level: string) => {
    switch (level) {
      case 'EXPERT':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'ADVANCED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'INTERMEDIATE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'IMPROVING':
        return <span className="text-xs text-emerald-600 font-semibold flex items-center">↑ Improving</span>;
      case 'NEEDS_ATTENTION':
        return <span className="text-xs text-rose-600 font-semibold flex items-center">↓ Needs Review</span>;
      default:
        return <span className="text-xs text-slate-500 font-semibold flex items-center">→ Calibrated</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Computing Multi-Subject Skill Passport...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 mr-1" />
              <span>AI SAMRAT SKILL PASSPORT</span>
            </span>
            <span className="text-xs text-slate-400 font-medium font-mono">{user?.employeeCode}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">
            Professional Competency & Skill Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Standardized evaluation across 6 core technical domains with adaptive training pathways.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-right">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Overall Proficiency</div>
            <div className="text-2xl font-extrabold text-blue-700">
              {matrix?.overallProficiencyScore ? `${matrix.overallProficiencyScore}%` : 'Pending'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 6 Technical Subjects Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>Core Domain Proficiencies (6 Subjects)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matrix && matrix.subjectProficiencies && Object.values(matrix.subjectProficiencies).map((sub) => (
            <div
              key={sub.subject}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-blue-300 transition space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{sub.subject}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Assessments: <span className="font-semibold text-slate-700">{sub.assessmentsTaken}</span>
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getTierColor(sub.proficiencyLevel)}`}>
                  {sub.proficiencyLevel}
                </span>
              </div>

              {/* Score bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Mastery Index</span>
                  <span className="text-slate-900">{sub.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, sub.percentage)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-500">
                  Latest: <b className="text-slate-800">{sub.latestScore !== null && sub.latestScore !== undefined ? `${sub.latestScore}/100` : 'Not Taken'}</b>
                </span>
                {getTrendIcon(sub.trend)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights: Strengths, Gaps, and Strategic Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Identified Strengths */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Demonstrated Strengths</span>
          </div>
          <p className="text-xs text-slate-500">
            Validated technical areas with benchmark performance above 75%.
          </p>
          <div className="space-y-2 pt-2">
            {matrix?.topStrengths && matrix.topStrengths.length > 0 ? (
              matrix.topStrengths.map((str, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{str}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">Complete technical assessments to calibrate validated strengths.</p>
            )}
          </div>
        </div>

        {/* Focus Areas & Gaps */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Target Growth Areas</span>
          </div>
          <p className="text-xs text-slate-500">
            Core subjects flagged for refresher material and practice exams.
          </p>
          <div className="space-y-2 pt-2">
            {matrix?.identifiedSkillGaps && matrix.identifiedSkillGaps.length > 0 ? (
              matrix.identifiedSkillGaps.map((gap, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{gap}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No critical skill gaps detected. Excellent technical foundation!</p>
            )}
          </div>
        </div>

        {/* Training Recommendations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm">
            <Compass className="w-4 h-4 text-blue-600" />
            <span>Personalized Learning Pathway</span>
          </div>
          <p className="text-xs text-slate-500">
            Automated recommendations generated by AI SAMRAT Intelligence.
          </p>
          <div className="space-y-2.5 pt-2">
            {matrix?.recommendations && matrix.recommendations.length > 0 ? (
              matrix.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900">{rec.subject}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rec.priority === 'HIGH'
                        ? 'bg-rose-100 text-rose-700'
                        : rec.priority === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] font-medium">{rec.topic}</p>
                  <p className="text-slate-500 text-[10px] leading-relaxed">{rec.rationale}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No pending training recommendations.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

