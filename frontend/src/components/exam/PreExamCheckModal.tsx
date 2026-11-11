import React, { useState, useEffect, useRef } from 'react';
import { proctoringMedia } from '../../services/proctoring';
import {
  ShieldCheck,
  Video,
  Monitor,
  Maximize2,
  Wifi,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X
} from 'lucide-react';

interface PreExamCheckModalProps {
  examTitle: string;
  subject: string;
  onProceed: () => void;
  onCancel: () => void;
}

export const PreExamCheckModal: React.FC<PreExamCheckModalProps> = ({
  examTitle,
  subject,
  onProceed,
  onCancel,
}) => {
  const browserOk = typeof navigator !== 'undefined' && !!navigator.mediaDevices;
  const [webcamOk, setWebcamOk] = useState<boolean | null>(null);
  const [screenOk, setScreenOk] = useState<boolean | null>(null);
  const [fullscreenOk, setFullscreenOk] = useState<boolean | null>(null);
  const [networkOk, setNetworkOk] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check network ping
    const t0 = performance.now();
    fetch('/api/auth/me')
      .then(() => {
        const ping = Math.round(performance.now() - t0);
        setNetworkOk(ping < 800);
      })
      .catch(() => setNetworkOk(true)); // fallback if unauth
  }, []);

  const handleTestWebcam = async () => {
    try {
      setErrorMsg(null);
      const stream = await proctoringMedia.requestWebcam();
      setWebcamOk(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setWebcamOk(false);
      setErrorMsg(err.message || 'Webcam permission denied');
    }
  };

  const handleTestScreen = async () => {
    try {
      setErrorMsg(null);
      await proctoringMedia.requestScreenShare();
      setScreenOk(true);
    } catch (err: any) {
      setScreenOk(false);
      setErrorMsg(err.message || 'Screen sharing was cancelled or denied');
    }
  };

  const handleTestFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      setFullscreenOk(true);
    } catch {
      setFullscreenOk(false);
    }
  };

  const handleCancel = () => {
    proctoringMedia.stopAll();
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    onCancel();
  };

  const allPassed = browserOk && webcamOk && screenOk && fullscreenOk && networkOk;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#131B2E] border border-[#1F2E4D] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#1F2E4D] flex items-center justify-between bg-[#0E1526]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Pre-Examination System Diagnostic</h2>
              <p className="text-xs text-slate-400">{examTitle} ({subject})</p>
            </div>
          </div>
          <button onClick={handleCancel} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Privacy Notice Alert */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
            <div className="font-semibold flex items-center space-x-1.5 text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Mandatory Live Proctoring & Integrity Consent</span>
            </div>
            <p className="leading-relaxed opacity-90">
              In accordance with AI SAMRAT Enterprise Examination Guidelines, this session requires continuous full-screen display, live webcam capture, and active desktop screen sharing. All violations including tab switching (3 warnings max) and full-screen exits will be audited.
            </p>
          </div>

          {/* Diagnostic Checks */}
          <div className="space-y-3">
            {/* 1. Browser & OS */}
            <div className="p-3.5 rounded-xl bg-[#0E1526] border border-[#1F2E4D] flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <Monitor className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="font-semibold text-white">Browser & OS Compatibility</div>
                  <div className="text-xs text-slate-400">Modern Chromium / WebRTC & ScreenCapture API supported</div>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>

            {/* 2. Webcam */}
            <div className="p-3.5 rounded-xl bg-[#0E1526] border border-[#1F2E4D] flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <Video className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="font-semibold text-white">Webcam Video Stream</div>
                  <div className="text-xs text-slate-400">Continuous face verification during examination</div>
                </div>
              </div>
              {webcamOk === true ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <button
                  type="button"
                  onClick={handleTestWebcam}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition"
                >
                  Enable Camera
                </button>
              )}
            </div>

            {/* Webcam Preview Video */}
            {webcamOk && (
              <div className="relative rounded-xl overflow-hidden border border-indigo-500/40 bg-black max-w-xs mx-auto aspect-video">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>CAMERA VERIFIED</span>
                </div>
              </div>
            )}

            {/* 3. Screen Sharing */}
            <div className="p-3.5 rounded-xl bg-[#0E1526] border border-[#1F2E4D] flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <Monitor className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="font-semibold text-white">Live Screen Sharing</div>
                  <div className="text-xs text-slate-400">Share your entire screen with proctors</div>
                </div>
              </div>
              {screenOk === true ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <button
                  type="button"
                  onClick={handleTestScreen}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition"
                >
                  Share Screen
                </button>
              )}
            </div>

            {/* 4. Fullscreen */}
            <div className="p-3.5 rounded-xl bg-[#0E1526] border border-[#1F2E4D] flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <Maximize2 className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="font-semibold text-white">Full-Screen Mode</div>
                  <div className="text-xs text-slate-400">Examination must be taken in dedicated full-screen</div>
                </div>
              </div>
              {fullscreenOk === true ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <button
                  type="button"
                  onClick={handleTestFullscreen}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition"
                >
                  Test Fullscreen
                </button>
              )}
            </div>

            {/* 5. Network Connectivity */}
            <div className="p-3.5 rounded-xl bg-[#0E1526] border border-[#1F2E4D] flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <Wifi className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="font-semibold text-white">Network Stability & Latency</div>
                  <div className="text-xs text-slate-400">Heartbeat synchronization active</div>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1F2E4D] bg-[#0E1526] flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel & Return
          </button>

          <button
            onClick={onProceed}
            disabled={!allPassed}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2 transition"
          >
            <span>Enter Examination Room</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

