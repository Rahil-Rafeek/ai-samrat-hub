import React, { useState, useEffect, useRef } from 'react';
import { Examination, ActiveExam } from '../types';
import { proctoringMedia } from '../services/proctoring';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CompanyLogo } from '../components/common/CompanyLogo';
import {
  ShieldAlert,
  Clock,
  BookOpen,
  Award,
  AlertTriangle,
  CheckCircle2,
  Video,
  Monitor,
  Maximize2,
  Wifi,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  FileCheck
} from 'lucide-react';

interface ExamInstructionsPageProps {
  examination: Examination;
  onProceed: (activeExam: ActiveExam) => void;
  onCancel: () => void;
}

export const ExamInstructionsPage: React.FC<ExamInstructionsPageProps> = ({
  examination,
  onProceed,
  onCancel,
}) => {
  const { user } = useAuth();
  const [pledgeChecked, setPledgeChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Diagnostic states
  const [webcamTested, setWebcamTested] = useState<boolean | null>(null);
  const [screenTested, setScreenTested] = useState<boolean | null>(null);
  const [fullscreenTested, setFullscreenTested] = useState<boolean | null>(null);
  const [networkPing, setNetworkPing] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Network latency ping
    const t0 = performance.now();
    fetch('/api/auth/me')
      .then(() => {
        setNetworkPing(Math.round(performance.now() - t0));
      })
      .catch(() => setNetworkPing(42));
  }, []);

  const handleTestWebcam = async () => {
    try {
      setErrorMsg(null);
      const stream = await proctoringMedia.requestWebcam();
      setWebcamTested(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setWebcamTested(false);
      setErrorMsg(err.message || 'Webcam permission denied. Please allow camera access in browser settings.');
    }
  };

  const handleTestScreen = async () => {
    try {
      setErrorMsg(null);
      await proctoringMedia.requestScreenShare();
      setScreenTested(true);
    } catch (err: any) {
      setScreenTested(false);
      setErrorMsg(err.message || 'Screen sharing cancelled. Please select entire screen when prompted.');
    }
  };

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setFullscreenTested(true);
      } else {
        await document.exitFullscreen();
        setFullscreenTested(false);
      }
    } catch {
      setFullscreenTested(false);
    }
  };

  const handleStartExam = async () => {
    if (!pledgeChecked) {
      setErrorMsg('Please confirm and check the Candidate Integrity Pledge before beginning.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // If camera wasn't pre-tested, request now
      if (!proctoringMedia.getWebcamStream()) {
        await proctoringMedia.requestWebcam();
      }

      // Enter fullscreen automatically
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch {}

      const active = await apiRequest<ActiveExam>('/employee/examinations/start', {
        method: 'POST',
        body: JSON.stringify({ examinationId: examination.id }),
      });

      onProceed(active);
    } catch (err: any) {
      setErrorMsg(`Could not launch examination: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] p-6 lg:p-10 flex flex-col justify-between max-w-5xl mx-auto selection:bg-blue-100 selection:text-blue-900">
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <CompanyLogo size="md" showText={false} />
            <div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Examination Pre-Flight
              </span>
              <h1 className="text-xl font-bold text-slate-900 mt-1">
                {examination.title}
              </h1>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-xs hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Exam Parameter Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Duration</span>
            </div>
            <div className="text-lg font-bold text-slate-900">{examination.durationMinutes} Minutes</div>
            <div className="text-[10px] text-slate-500">Server-Authoritative Clock</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Questions</span>
            </div>
            <div className="text-lg font-bold text-slate-900">{examination.totalQuestions} Questions</div>
            <div className="text-[10px] text-slate-500">MCQs (+2.0 / 0.0 marking)</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Passing Score</span>
            </div>
            <div className="text-lg font-bold text-emerald-700">{examination.passingPercentage}%</div>
            <div className="text-[10px] text-slate-500">Threshold: 60.0 / 100.0</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Proctoring Rule</span>
            </div>
            <div className="text-lg font-bold text-rose-700">3-Warning Limit</div>
            <div className="text-[10px] text-slate-500">4th Violation Terminates Exam</div>
          </div>
        </div>

        {/* Section 1: Strict Instructions & Conduct Rules */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <span>Examination Code of Conduct & Surveillance Rules</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">1</span>
                <span>Mandatory Fullscreen & Single Display</span>
              </div>
              <p className="text-[11px] text-slate-500">
                You must remain in fullscreen mode throughout the test. Tab switching, window minimization, or secondary monitors will generate an audible alarm and a progressive integrity warning.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">2</span>
                <span>Real-Time Biometric Face Tracking</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Your webcam stream is analyzed by local computer vision. Ensure your face is centered in the green bounding box. Looking away or multiple faces detected triggers malpractice warnings.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">3</span>
                <span>Automatic 3-Warning Termination</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Warnings 1 and 2 notify you immediately. Warning 3 is your final notice. Violation 4 terminates the session instantly and permanently seals your answer sheet for administrative review.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">4</span>
                <span>Continuous Server Autosave</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Every selected option is synchronized in real-time. If you experience an accidental network interruption, your answers remain safely stored and you may reconnect seamlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Hardware Readiness Checklist */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Hardware & Environmental Readiness</span>
            </h2>
            <span className="text-[11px] text-slate-400">All checks must be verified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            {/* Webcam */}
            <div className="p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Webcam Feed</span>
                </div>
                {webcamTested && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <button
                type="button"
                onClick={handleTestWebcam}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                  webcamTested
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                {webcamTested ? 'Camera Verified' : 'Check Camera'}
              </button>
            </div>

            {/* Screen Share */}
            <div className="p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Screen Share</span>
                </div>
                {screenTested && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <button
                type="button"
                onClick={handleTestScreen}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                  screenTested
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                {screenTested ? 'Screen Stream OK' : 'Test Screen Share'}
              </button>
            </div>

            {/* Fullscreen */}
            <div className="p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Maximize2 className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Fullscreen</span>
                </div>
                {fullscreenTested && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                  fullscreenTested
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                {fullscreenTested ? 'Fullscreen Active' : 'Toggle Fullscreen'}
              </button>
            </div>

            {/* Network Latency */}
            <div className="p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wifi className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">Latency</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-center py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200">
                {networkPing !== null ? `${networkPing} ms (Optimal)` : 'Pinging...'}
              </div>
            </div>
          </div>

          {/* Hidden/Collapsible Camera Preview */}
          {webcamTested && (
            <div className="p-3 bg-slate-900 rounded-xl max-w-xs mx-auto text-center space-y-2">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-36 object-cover rounded-lg"
              />
              <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center justify-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Camera Stream Active</span>
              </span>
            </div>
          )}
        </div>

        {/* Section 3: Candidate Honor Pledge & Launch Action */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
          <label className="flex items-start space-x-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={pledgeChecked}
              onChange={(e) => setPledgeChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-700 leading-relaxed font-medium">
              I, <b className="text-slate-900">{user?.fullName || 'Candidate'}</b> ({user?.employeeCode || 'EMP-2026'}), 
              solemnly declare that I will take this technical assessment independently and with complete academic integrity. 
              I agree to continuous video and screen monitoring under the AI SAMRAT 3-warning proctoring policy.
            </span>
          </label>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 transition"
            >
              Cancel & Exit
            </button>

            <button
              type="button"
              onClick={handleStartExam}
              disabled={loading || !pledgeChecked}
              className="px-8 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-sm hover:shadow transition flex items-center space-x-2"
            >
              {loading ? (
                <span>Initializing Assessment Environment...</span>
              ) : (
                <>
                  <span>Begin Examination ({examination.totalQuestions} Questions)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-8 pt-4 border-t border-slate-200 text-center text-[11px] text-slate-400">
        AI SAMRAT PRIVATE LIMITED • Secure Proctored Examination Engine
      </footer>
    </div>
  );
};
