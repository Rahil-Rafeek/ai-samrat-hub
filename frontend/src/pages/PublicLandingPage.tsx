import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CompanyLogo } from '../components/common/CompanyLogo';
import { apiRequest } from '../services/api';
import { CertificateVerifyData } from '../types';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Brain,
  Cpu,
  BarChart3,
  Code2,
  Globe,
  Terminal,
  FileCheck2,
  TrendingUp,
  Building2,
  QrCode,
  Shield,
  Layers,
  Lock,
  Compass
} from 'lucide-react';

interface PublicLandingPageProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onGoToVerify: (code?: string) => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onGoToLogin,
  onGoToVerify,
}) => {
  const [certInput, setCertInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<CertificateVerifyData | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleInstantVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) return;

    setVerifying(true);
    setVerifyError(null);
    setVerifyResult(null);

    try {
      const res = await apiRequest<CertificateVerifyData>(
        `/certificates/verify/${encodeURIComponent(certInput.trim())}`
      );
      setVerifyResult(res);
    } catch {
      setVerifyError('Credential record not found or verification service unavailable. Please check the code.');
    } finally {
      setVerifying(false);
    }
  };

  const tracks = [
    {
      title: 'Artificial Intelligence',
      code: 'AI-TRACK',
      icon: Brain,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-200',
      description: 'State space search, heuristic optimization, constraint satisfaction, and neural foundations.',
      topics: 'Heuristic Search, Alpha-Beta, Expert Systems, Constraint Satisfaction, Neural Basics',
      availability: 'Set A & Set B Available',
      difficulty: 'Beginner to Advanced',
    },
    {
      title: 'Machine Learning',
      code: 'ML-TRACK',
      icon: Cpu,
      iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      description: 'Supervised and unsupervised models, gradient descent, regularization, tree ensembles, and validation metrics.',
      topics: 'Gradient Descent, Regularization, SVMs, Decision Trees, Ensembles, Metric Evaluation',
      availability: 'Set A & Set B Available',
      difficulty: 'Beginner to Advanced',
    },
    {
      title: 'Data Science',
      code: 'DS-TRACK',
      icon: BarChart3,
      iconColor: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      description: 'Statistical inference, hypothesis testing, data transformations, feature engineering, and big data fundamentals.',
      topics: 'Pandas, Statistical Inference, Hypothesis Testing, Feature Engineering, Big Data',
      availability: 'Set A & Set B Available',
      difficulty: 'Beginner to Advanced',
    },
    {
      title: 'Java Programming',
      code: 'JAVA-TRACK',
      icon: Code2,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-200',
      description: 'JVM internals, concurrency, thread synchronization, Stream API, generics, and Spring Boot architecture.',
      topics: 'JVM Internals, Concurrency, Generics, Stream API, Garbage Collection, Spring Boot',
      availability: 'Set A & Set B Available',
      difficulty: 'Beginner to Advanced',
    },
    {
      title: 'Web Development',
      code: 'WEB-TRACK',
      icon: Globe,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      description: 'Modern component architectures, TypeScript type systems, DOM optimization, state management, and REST APIs.',
      topics: 'React 18 Architecture, TypeScript, DOM Performance, CSS Grid, State Management, REST APIs',
      availability: 'Set A & Set B Available',
      difficulty: 'Beginner to Advanced',
    },
    {
      title: 'Shell Scripting & DevOps',
      code: 'SHELL-TRACK',
      icon: Terminal,
      iconColor: 'text-slate-700 bg-slate-100 border-slate-200',
      description: 'POSIX Bash scripting, text streams (sed/awk), process signals, automation pipelines, and Linux security.',
      topics: 'POSIX Bash, Sed & Awk, Process Signals, Pipeline Optimization, Cron, Linux Security',
      availability: 'Set A & Set B Available',
      difficulty: 'Beginner to Advanced',
    },
  ];

  const tickerItems = [
    'Assessment Tracks',
    'Employee Skill Evaluation',
    'Digital Credentials',
    'Enterprise Assessment',
    'Verified Competency Framework',
    'Standardized Benchmarking',
    'Tamper-Evident Records',
  ];

  const trustPrinciples = [
    {
      title: 'Structured Assessments',
      description: 'Carefully curated technical tracks designed around real-world software engineering and data competencies.',
      icon: Layers,
      accent: 'text-blue-600 bg-blue-50 border-blue-200/80',
    },
    {
      title: 'Consistent Evaluation',
      description: 'Standardized assessment conditions ensuring an objective, equitable baseline for every participating candidate.',
      icon: ShieldCheck,
      accent: 'text-emerald-600 bg-emerald-50 border-emerald-200/80',
    },
    {
      title: 'Verified Credentials',
      description: 'Tamper-evident digital certificates verifiable through a central cryptographic verification registry.',
      icon: Award,
      accent: 'text-indigo-600 bg-indigo-50 border-indigo-200/80',
    },
    {
      title: 'Secure Access',
      description: 'Enterprise role-based provisioning and account authentication safeguarding assessment confidentiality.',
      icon: Shield,
      accent: 'text-amber-600 bg-amber-50 border-amber-200/80',
    },
    {
      title: 'Transparent Results',
      description: 'Instant score breakdowns and category mastery insights providing actionable performance clarity.',
      icon: TrendingUp,
      accent: 'text-cyan-600 bg-cyan-50 border-cyan-200/80',
    },
  ];

  const journeySteps = [
    {
      step: '01',
      title: 'Access Your Assessment',
      description: 'Sign in securely using your registered enterprise employee credentials.',
      icon: Lock,
    },
    {
      step: '02',
      title: 'Complete Your Assessment',
      description: 'Attempt your assigned technical assessment within the allocated schedule.',
      icon: Compass,
    },
    {
      step: '03',
      title: 'Review Your Performance',
      description: 'View your published assessment results with detailed category performance summaries.',
      icon: TrendingUp,
    },
    {
      step: '04',
      title: 'Earn Your Credential',
      description: 'Access your verified certificate when eligible, authenticated by the central registry.',
      icon: Award,
    },
  ];

  const ecosystemFeatures = [
    {
      title: 'Technical Skill Assessment',
      description: 'Curated evaluation curricula spanning modern software engineering, artificial intelligence, data pipelines, and infrastructure automation.',
      icon: Code2,
    },
    {
      title: 'Employee Performance Insights',
      description: 'Objective performance metrics and category-level skill breakdowns providing clear visibility into technical proficiencies.',
      icon: BarChart3,
    },
    {
      title: 'Structured Certification',
      description: 'Tamper-evident digital credentials that authenticate employee competency and support enterprise career milestones.',
      icon: FileCheck2,
    },
    {
      title: 'Enterprise Assessment Management',
      description: 'Centralized cohort coordination, role-governed evaluation workflows, and audit-ready governance for organizations.',
      icon: Building2,
    },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const containerStagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardItem = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-slate-800 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 font-sans scroll-smooth">
      {/* ========================================================= */}
      {/* 1. TOP ENTERPRISE NAVIGATION BAR */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <CompanyLogo size="md" showSubtitle={false} />
            <div className="hidden sm:flex flex-col border-l border-slate-200 pl-3">
              <span className="text-[11px] font-bold text-slate-900 tracking-wider uppercase">
                Assessment Hub
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Enterprise Technical Certification
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold text-slate-600">
            <a href="#tracks" className="hover:text-blue-700 transition">
              Assessment Tracks
            </a>
            <a href="#trust" className="hover:text-blue-700 transition">
              A Trusted Experience
            </a>
            <a href="#journey" className="hover:text-blue-700 transition">
              How It Works
            </a>
            <a href="#ecosystem" className="hover:text-blue-700 transition">
              Ecosystem
            </a>
            <a href="#verification" className="hover:text-blue-700 transition">
              Verify Credential
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={onGoToLogin}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-sm hover:shadow transition-all flex items-center space-x-2"
            >
              <span>Employee Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. PREMIUM FLOATING HERO SECTION */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 bg-gradient-to-b from-[#FDFDFD] via-[#FBFBFA] to-[#F8FAFC]">
        {/* Subtle Background Technical Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.7" strokeDasharray="3 3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        {/* Ambient Glow Orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 -right-24 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Narrative & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI SAMRAT Enterprise Assessment Hub</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Intelligent Assessments.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600">
                Verified Skills.
              </span><br />
              Trusted Credentials.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              AI SAMRAT provides a structured platform for enterprise technical assessments, employee skill evaluation and verified professional credentials.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onGoToLogin}
                className="px-6 py-3.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <span>Employee Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#tracks"
                className="px-6 py-3.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center space-x-1.5"
              >
                <span>Explore Assessment Tracks</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Subtle Enterprise Assurance Badges */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-slate-600">
              <div className="space-y-0.5">
                <span className="block text-base font-extrabold text-slate-900">6 Curated</span>
                <span className="text-[11px] text-slate-500 font-medium">Technical Tracks</span>
              </div>
              <div className="space-y-0.5 border-l border-slate-200 pl-4">
                <span className="block text-base font-extrabold text-blue-700">Verified</span>
                <span className="text-[11px] text-slate-500 font-medium">Digital Registry</span>
              </div>
              <div className="space-y-0.5 border-l border-slate-200 pl-4">
                <span className="block text-base font-extrabold text-slate-900">Standardized</span>
                <span className="text-[11px] text-slate-500 font-medium">Evaluation Blueprint</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Assessment Interface Composition */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px]">
            {/* Background Decorative Tech Lines */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
              <svg className="w-full h-full max-w-md max-h-96" viewBox="0 0 400 400" fill="none">
                <circle cx="200" cy="200" r="140" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="200" cy="200" r="90" stroke="#93C5FD" strokeWidth="1" strokeDasharray="6 6" />
                <path d="M 60 200 L 340 200" stroke="#E2E8F0" strokeWidth="1" />
                <path d="M 200 60 L 200 340" stroke="#E2E8F0" strokeWidth="1" />
              </svg>
            </div>

            {/* Central Primary Assessment Matrix Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { duration: 0.8 },
                y: { duration: 7, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="relative z-20 w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xl shadow-slate-200/50 space-y-5"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                      Artificial Intelligence Track
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Technical Competency Matrix
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Evaluation Verified</span>
                </span>
              </div>

              {/* Score & Candidate Overview */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Composite Score
                  </span>
                  <div className="flex items-baseline space-x-1.5 mt-0.5">
                    <span className="text-2xl font-black text-slate-900">94</span>
                    <span className="text-xs text-slate-400 font-semibold">/ 100</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md mt-1 inline-block">
                    Grade: Distinction
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Assessment Standard
                  </span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">
                    Enterprise Technical Track
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    Standardized Baseline
                  </span>
                </div>
              </div>

              {/* Domain Skill Progress Bars */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>Heuristic Search & Algorithms</span>
                    <span className="text-blue-700 font-bold">96%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full w-[96%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>Knowledge & Reasoning Models</span>
                    <span className="text-indigo-700 font-bold">92%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full w-[92%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>Neural Architectures & Inference</span>
                    <span className="text-cyan-700 font-bold">94%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-600 rounded-full w-[94%]" />
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Standardized Evaluation Baseline</span>
                </span>
                <span className="font-mono text-slate-400">SET-A/B COMPLIANT</span>
              </div>
            </motion.div>

            {/* Floating Element 1: Top-Left Summary Badge */}
            <motion.div
              animate={{ y: [-14, 14, -14], x: [-4, 4, -4], rotate: [-1.5, 1.5, -1.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -left-4 sm:-left-8 z-30 bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-3 shadow-lg flex items-center space-x-3"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-500 font-medium block">
                  Proficiency Status
                </span>
                <span className="text-xs font-bold text-slate-900 block">
                  94.2% Mastery Verified
                </span>
              </div>
            </motion.div>

            {/* Floating Element 2: Bottom-Left Skill Pill */}
            <motion.div
              animate={{ y: [14, -14, 14], x: [4, -4, 4] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              className="absolute -bottom-6 -left-2 sm:-left-6 z-30 bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-3 shadow-lg flex items-center space-x-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Code2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-800 block">
                  Java & Systems
                </span>
                <span className="text-[10px] font-semibold text-blue-700 block">
                  Expert Tier Certified
                </span>
              </div>
            </motion.div>

            {/* Floating Element 3: Bottom-Right Credential Card */}
            <motion.div
              animate={{ y: [-16, 12, -16], x: [-5, 5, -5], rotate: [1, -1, 1] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="absolute -bottom-5 -right-2 sm:-right-6 z-30 bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-3.5 shadow-lg flex items-center space-x-3"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-1">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide">
                    Digital Credential
                  </span>
                  <Award className="w-3 h-3 text-amber-500" />
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-900 block">
                  AIS-CERT-2026-X892
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. PREMIUM FLOATING INFORMATION TICKER BAR */}
      {/* ========================================================= */}
      <section className="py-4 bg-[#FAFAF9] border-y border-slate-200/80 overflow-hidden">
        <div className="flex items-center whitespace-nowrap animate-none">
          <div className="flex items-center space-x-8 text-xs font-semibold text-slate-600 tracking-wide mx-auto flex-wrap justify-center gap-y-2 px-6">
            {tickerItems.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <span className="text-slate-800">{item}</span>
                {idx !== tickerItems.length - 1 && (
                  <span className="text-blue-500 font-bold">•</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. ASSESSMENT TRACKS SECTION */}
      {/* ========================================================= */}
      <motion.section
        id="tracks"
        className="py-16 px-6 max-w-7xl mx-auto w-full space-y-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={sectionVariants}
      >
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60">
            Curated Technical Architecture
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            6 Specialized Enterprise Technical Tracks
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Standardized evaluation curricula designed to assess real-world software engineering, data systems, and algorithmic competency.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {tracks.map((t) => {
            const IconComponent = t.icon;
            return (
              <motion.div
                key={t.code}
                variants={cardItem}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${t.iconColor}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                      {t.code}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition">
                        {t.title}
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                      {t.difficulty}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {t.description}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-[11px] text-slate-500">
                    <strong className="text-slate-700 block text-[10px] uppercase tracking-wider mb-0.5">Core Syllabus:</strong>
                    <span>{t.topics}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-slate-600">
                    {t.availability}
                  </span>
                  <button
                    onClick={onGoToLogin}
                    className="text-blue-700 font-bold flex items-center space-x-1 group-hover:translate-x-0.5 transition"
                  >
                    <span>Explore Track</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* ========================================================= */}
      {/* 5. A TRUSTED ASSESSMENT EXPERIENCE (PUBLIC ASSURANCE) */}
      {/* ========================================================= */}
      <motion.section
        id="trust"
        className="py-16 px-6 bg-[#FAFAF9] border-y border-slate-200/80"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200/60">
              Enterprise Reliability
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Trusted Assessment Experience
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Designed to support secure, structured and reliable technical evaluations with a consistent assessment experience.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5"
            variants={containerStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {trustPrinciples.map((tp, idx) => {
              const IconComp = tp.icon;
              return (
                <motion.div
                  key={idx}
                  variants={cardItem}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all space-y-3"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${tp.accent}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {tp.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {tp.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* ========================================================= */}
      {/* 6. HOW IT WORKS – YOUR ASSESSMENT JOURNEY */}
      {/* ========================================================= */}
      <motion.section
        id="journey"
        className="py-16 px-6 max-w-7xl mx-auto w-full space-y-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={sectionVariants}
      >
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200/60">
            End-To-End Workflow
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Your Assessment Journey
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            A clear, four-stage pathway from enterprise invitation to verified digital credential.
          </p>
        </div>

        {/* Timeline Desktop & Mobile */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 relative"
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {journeySteps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={idx}
                variants={cardItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs relative flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-300 font-mono">
                      {step.step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
                      <StepIcon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                    Phase {step.step}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* ========================================================= */}
      {/* 7. ENTERPRISE ASSESSMENT ECOSYSTEM */}
      {/* ========================================================= */}
      <motion.section
        id="ecosystem"
        className="py-16 px-6 max-w-7xl mx-auto w-full space-y-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={sectionVariants}
      >
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-3.5 py-1 rounded-full border border-slate-200">
            Platform Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Enterprise Assessment Ecosystem
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            A unified platform for enterprise talent evaluation, skill benchmarking, and verifiable technical credentialing.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {ecosystemFeatures.map((feat, idx) => {
            const FeatIcon = feat.icon;
            return (
              <motion.div
                key={idx}
                variants={cardItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                  <FeatIcon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* ========================================================= */}
      {/* 9. CREDENTIAL VERIFICATION SECTION */}
      {/* ========================================================= */}
      <motion.section
        id="verification"
        className="py-16 px-6 bg-white border-y border-slate-200/80"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={sectionVariants}
      >
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Verify an AI SAMRAT Credential
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Check the authenticity of an issued AI SAMRAT certificate using its unique verification code.
            </p>
          </div>

          <form onSubmit={handleInstantVerify} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                placeholder="e.g. AIS-CERT-2026-XXXX or scan code"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={verifying || !certInput.trim()}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition shadow-xs flex items-center justify-center space-x-1.5 shrink-0"
            >
              {verifying ? (
                <span>Checking Registry...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Credential</span>
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-end text-xs text-slate-500 pt-1">
            <button
              type="button"
              onClick={() => onGoToVerify(certInput.trim() || undefined)}
              className="text-xs text-slate-500 hover:text-blue-700 font-medium inline-flex items-center space-x-1 transition"
            >
              <span>Full Verification Registry</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Verification Results Display */}
          {verifyResult && (
            <div
              className={`p-6 rounded-2xl border ${
                verifyResult.isValid
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/60 border-rose-200 text-rose-950'
              } animate-in fade-in space-y-4`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {verifyResult.isValid ? (
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                      <XCircle className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        verifyResult.isValid
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {verifyResult.isValid ? 'Authentic Credential Verified' : 'Invalid Credential'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1 font-mono">
                      {verifyResult.certificateCode}
                    </h3>
                  </div>
                </div>

                {verifyResult.isValid && (
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-white border border-emerald-200 text-emerald-700 shadow-xs">
                    {verifyResult.grade || 'CERTIFIED'}
                  </span>
                )}
              </div>

              {verifyResult.isValid ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-200/80 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Recipient</span>
                    <strong className="text-slate-900">{verifyResult.employeeName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Subject Track</span>
                    <strong className="text-slate-900">{verifyResult.subject}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Score Earned</span>
                    <strong className="text-blue-700 font-bold">{verifyResult.score ?? 0} / {verifyResult.maxScore ?? 100}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Issued On</span>
                    <strong className="text-slate-900">
                      {verifyResult.issueDate ? new Date(verifyResult.issueDate).toLocaleDateString() : 'Active'}
                    </strong>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-rose-700">
                  {verifyResult.message || 'No record matches this credential ID in the central registry.'}
                </p>
              )}

              {verifyResult.isValid && (
                <div className="flex items-center justify-end space-x-2 pt-2">
                  <a
                    href={`/api/certificates/download/${verifyResult.certificateCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                  >
                    <span>Download Official PDF</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {verifyError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
              <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{verifyError}</span>
            </div>
          )}
        </div>
      </motion.section>

      {/* ========================================================= */}
      {/* 10. ENTERPRISE FOOTER */}
      {/* ========================================================= */}
      <footer className="bg-white border-t border-slate-200/80 px-6 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <CompanyLogo size="sm" showSubtitle={false} />
              <p className="text-xs text-slate-500 max-w-sm">
                AI SAMRAT Assessment Hub provides standardized enterprise technical evaluations, objective skill benchmarking, and verifiable credentials.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-600">
              <a href="#tracks" className="hover:text-blue-700 transition">Assessment Tracks</a>
              <a href="#journey" className="hover:text-blue-700 transition">Your Journey</a>
              <a href="#credentials" className="hover:text-blue-700 transition">Digital Credentials</a>
              <button onClick={() => onGoToVerify()} className="hover:text-blue-700 transition">
                Verify Credential
              </button>
              <button onClick={onGoToLogin} className="hover:text-blue-700 transition">
                Employee Sign In
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} AI SAMRAT PRIVATE LIMITED. All rights reserved.</p>
            <p>Enterprise Assessment & Certification Infrastructure</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
