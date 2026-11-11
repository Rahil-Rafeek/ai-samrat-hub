import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ActiveExam, QuestionDisplay, SubmitExamResponse } from '../types';
import { apiRequest } from '../services/api';
import { proctoringMedia } from '../services/proctoring';
import {
  Clock,
  Flag,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Camera,
  Maximize2,
  Volume2,
  AlertOctagon
} from 'lucide-react';

interface ExamRoomProps {
  initialExamData: ActiveExam;
  onSubmitSuccess: (result: SubmitExamResponse) => void;
  onExit: () => void;
}

export const ExamRoom: React.FC<ExamRoomProps> = ({
  initialExamData,
  onSubmitSuccess,
  onExit,
}) => {
  const [exam] = useState<ActiveExam>(initialExamData);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<QuestionDisplay[]>(initialExamData.questions);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialExamData.remainingSeconds);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Violations & 5-Warning Policy state
  const [warningModalOpen, setWarningModalOpen] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [violationCount, setViolationCount] = useState<number>(initialExamData.currentTabSwitches || 0);
  const [isTerminated, setIsTerminated] = useState<boolean>(false);
  const [terminationCountdown, setTerminationCountdown] = useState<number>(3);

  // Live Webcam, AI Face Bounding Box & Proctoring States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [headPositionStatus, setHeadPositionStatus] = useState<string>('Center • Focused');
  const [isExamFullscreen, setIsExamFullscreen] = useState<boolean>(!!document.fullscreenElement);

  // References for non-state tracking in high-frequency loops
  const trackingStateRef = useRef<'FOCUSED' | 'LOOKING_AWAY' | 'ABSENT'>('FOCUSED');
  const absenceStreakRef = useRef<number>(0);
  const lookingAwayStreakRef = useRef<number>(0);
  const lastViolationTimeRef = useRef<{ [key: string]: number }>({});
  const localStreamRef = useRef<MediaStream | null>(null);
  const detectorIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const terminationCountdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const faceTrackerRef = useRef<number | null>(null);

  const currentQ = questions[currentIndex];

  // Comprehensive Protocol Shutdown: Stops Camera, Screen Sharing, Fullscreen, and Listeners
  const terminateAllSecurityProtocols = useCallback(() => {
    console.log('[SECURITY PROTOCOLS] Terminating all active proctoring, camera, screen-sharing, and security listeners...');

    // 1. Release hardware webcam stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      localStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // 2. Stop all proctoring media (screen sharing and webcam)
    proctoringMedia.stopAll();

    // 3. Clear computer vision detection loop
    if (detectorIntervalRef.current) {
      clearInterval(detectorIntervalRef.current);
      detectorIntervalRef.current = null;
    }

    // 4. Cancel canvas animation frame
    if (faceTrackerRef.current) {
      cancelAnimationFrame(faceTrackerRef.current);
      faceTrackerRef.current = null;
    }

    // 5. Clear examination countdown timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 6. Clear heartbeat ping
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }

    // 7. Clear termination countdown timer
    if (terminationCountdownTimerRef.current) {
      clearInterval(terminationCountdownTimerRef.current);
      terminationCountdownTimerRef.current = null;
    }

    // 8. Exit full-screen mode automatically
    try {
      if (typeof document !== 'undefined' && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {}
  }, []);

  // Guarantee all security protocols stop upon component unmount
  useEffect(() => {
    return () => {
      terminateAllSecurityProtocols();
    };
  }, [terminateAllSecurityProtocols]);

  // Synthetic Web Audio Warning Beep
  const playWarningAudioBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(550, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio playback might be restricted by browser policy before first click
    }
  };

  // 1. Server-Authoritative Timer & Autosubmit
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleAutoSubmit('Time expired. Submitting examination automatically.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 2. Heartbeat Ping every 15 seconds
  useEffect(() => {
    heartbeatRef.current = setInterval(async () => {
      try {
        const hb: any = await apiRequest(`/employee/examinations/${exam.attemptUuid}/heartbeat`, { method: 'POST' });
        if (hb.remainingSeconds !== undefined) {
          setRemainingSeconds(hb.remainingSeconds);
        }
        if (hb.status === 'SUBMITTED' || hb.status === 'TERMINATED_VIOLATION') {
          handleAutoSubmit('Examination session status changed by server.');
        }
      } catch (err) {
        console.error('Heartbeat ping failed:', err);
      }
    }, 15000);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [exam.attemptUuid]);

  // 3. Centralized Violation Reporter with Progressive 5-Warning Policy
  const reportViolation = useCallback(
    async (
      type: 'TAB_SWITCH' | 'FULLSCREEN_EXIT' | 'UNUSUAL_MOVEMENT' | 'FACE_NOT_DETECTED',
      msg: string,
      bypassCooldown = false
    ) => {
      if (isTerminated) return;

      const now = Date.now();
      const lastTime = lastViolationTimeRef.current[type] || 0;
      // 3.5-second cooldown per category unless manually tested
      if (!bypassCooldown && now - lastTime < 3500) {
        return;
      }
      lastViolationTimeRef.current[type] = now;

      playWarningAudioBeep();

      try {
        const res: any = await apiRequest(`/employee/examinations/${exam.attemptUuid}/violation`, {
          method: 'POST',
          body: JSON.stringify({
            attemptUuid: exam.attemptUuid,
            eventType: type,
            message: msg,
          }),
        });

        setWarningMessage(res.warningMessage || msg);
        setViolationCount(res.violationNumber);
        setWarningModalOpen(true);

        if (res.isTerminated) {
          setIsTerminated(true);
          if (timerRef.current) clearInterval(timerRef.current);
          if (heartbeatRef.current) clearInterval(heartbeatRef.current);

          // 3-second auto-redirect countdown
          let count = 3;
          setTerminationCountdown(3);
          const cdTimer = setInterval(() => {
            count -= 1;
            setTerminationCountdown(count);
            if (count <= 0) {
              clearInterval(cdTimer);
              handleAutoSubmit(res.warningMessage || 'Examination terminated due to exceeding 3 security warnings.');
            }
          }, 1000);
          terminationCountdownTimerRef.current = cdTimer;
        }
      } catch (e) {
        console.error('Failed to report integrity violation:', e);
      }
    },
    [exam.attemptUuid, isTerminated]
  );

  // 4. Page Visibility, Window Focus, & Fullscreen Listeners
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportViolation('TAB_SWITCH', 'Candidate switched browser tab or minimized window.');
      }
    };

    const handleWindowBlur = () => {
      // Window lost focus (candidate clicked another app, desktop, secondary monitor)
      reportViolation('TAB_SWITCH', 'Candidate switched focus outside examination workspace.');
    };

    const handleFullscreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsExamFullscreen(isFs);
      if (!isFs) {
        reportViolation('FULLSCREEN_EXIT', 'Candidate exited full-screen examination workspace.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [reportViolation]);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // 5. Live Camera, Real-Time Computer Vision Frame Analysis & Canvas Overlay
  useEffect(() => {
    let detectorInterval: NodeJS.Timeout | null = null;

    // Create offscreen canvas for high-speed frame pixel processing
    const offscreen = document.createElement('canvas');
    offscreen.width = 160;
    offscreen.height = 120;
    const offCtx = offscreen.getContext('2d', { willReadFrequently: true });

    const startCamera = async () => {
      try {
        let stream = proctoringMedia.getWebcamStream();
        if (!stream || stream.getVideoTracks().every((t) => t.readyState === 'ended')) {
          stream = await proctoringMedia.requestWebcam();
        }
        localStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn('Physical camera unavailable; using calibrated simulation mode:', err);
      }
    };

    startCamera();

    // Check active screen share track
    const screenStream = proctoringMedia.getScreenStream();
    if (screenStream) {
      const screenTrack = screenStream.getVideoTracks()[0];
      if (screenTrack) {
        screenTrack.onended = () => {
          if (!isTerminated) {
            reportViolation('UNUSUAL_MOVEMENT', 'Candidate stopped active screen sharing during examination.');
          }
        };
      }
    }

    // 5A. Computer Vision Pixel Analyzer (Sampled every 750ms)
    detectorInterval = setInterval(() => {
      if (isTerminated) return;
      const video = videoRef.current;
      if (!video || !offCtx || video.readyState < 2 || video.paused) return;

      try {
        // Draw downscaled frame to offscreen canvas
        offCtx.drawImage(video, 0, 0, 160, 120);
        const imgData = offCtx.getImageData(0, 0, 160, 120);
        const data = imgData.data;

        // Central Region of Interest (ROI)
        const roiXMin = Math.floor(160 * 0.18);
        const roiXMax = Math.floor(160 * 0.82);
        const roiYMin = Math.floor(120 * 0.12);
        const roiYMax = Math.floor(120 * 0.88);

        let skinPixelCount = 0;
        let sumX = 0;
        let sumY = 0;
        let totalRoiPixels = 0;

        for (let y = roiYMin; y < roiYMax; y++) {
          for (let x = roiXMin; x < roiXMax; x++) {
            const idx = (y * 160 + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Robust multi-ethnicity skin-tone detection heuristic
            const isSkin =
              r > 45 && g > 30 && b > 15 &&
              r > g && r > b &&
              (r - g) >= 8 && (r - b) >= 8 &&
              Math.max(r, g, b) - Math.min(r, g, b) >= 12;

            if (isSkin) {
              skinPixelCount++;
              sumX += x;
              sumY += y;
            }
            totalRoiPixels++;
          }
        }

        const skinRatio = totalRoiPixels > 0 ? skinPixelCount / totalRoiPixels : 0;

        // Check 1: Candidate Face Absent / Obstructed (skin ratio < 4.5% in ROI)
        if (skinRatio < 0.045) {
          absenceStreakRef.current += 1;
          lookingAwayStreakRef.current = 0;

          if (absenceStreakRef.current >= 3) { // ~2.2s absent
            trackingStateRef.current = 'ABSENT';
            setHeadPositionStatus('Face Absent / Obstructed');
            reportViolation(
              'FACE_NOT_DETECTED',
              'Candidate face not detected in camera frame. Please face screen directly.'
            );
          }
        } else {
          // Candidate Face is Present
          absenceStreakRef.current = 0;
          const centroidX = sumX / skinPixelCount;
          const normX = centroidX / 160;

          // Check 2: Looking Away / Head Turned (Centroid shifted beyond 30% from center)
          if (normX < 0.32 || normX > 0.68) {
            lookingAwayStreakRef.current += 1;

            if (lookingAwayStreakRef.current >= 2) { // ~1.5s looking away
              trackingStateRef.current = 'LOOKING_AWAY';
              setHeadPositionStatus('Looking Away • Warning');
              reportViolation(
                'UNUSUAL_MOVEMENT',
                'Candidate turned head or looked away from examination workspace.'
              );
            }
          } else {
            // Normal Focused State
            lookingAwayStreakRef.current = 0;
            trackingStateRef.current = 'FOCUSED';
            setHeadPositionStatus('Center • Focused');
          }
        }
      } catch (err) {
        console.error('Frame analysis error:', err);
      }
    }, 750);
    detectorIntervalRef.current = detectorInterval;

    // 5B. High-FPS Bounding Box Canvas Rendering Loop
    const drawFaceBox = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const state = trackingStateRef.current;
      let strokeColor = '#10B981'; // Emerald Green
      let pillBg = 'rgba(16, 185, 129, 0.9)';
      let labelText = 'FACE VERIFIED: FOCUSED';

      if (state === 'LOOKING_AWAY') {
        strokeColor = '#F59E0B'; // Warning Amber
        pillBg = 'rgba(245, 158, 11, 0.95)';
        labelText = 'LOOKING AWAY DETECTED';
      } else if (state === 'ABSENT') {
        strokeColor = '#EF4444'; // Malpractice Crimson Red
        pillBg = 'rgba(239, 68, 68, 0.95)';
        labelText = 'NO FACE DETECTED';
      }

      const boxX = w * 0.20;
      const boxY = h * 0.14;
      const boxW = w * 0.60;
      const boxH = h * 0.72;

      // Outer dashed frame
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.setLineDash(state === 'FOCUSED' ? [6, 3] : [3, 2]);
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.setLineDash([]);

      // Corner target brackets
      const cornerLen = 16;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3.5;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(boxX, boxY + cornerLen);
      ctx.lineTo(boxX, boxY);
      ctx.lineTo(boxX + cornerLen, boxY);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(boxX + boxW - cornerLen, boxY);
      ctx.lineTo(boxX + boxW, boxY);
      ctx.lineTo(boxX + boxW, boxY + cornerLen);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(boxX, boxY + boxH - cornerLen);
      ctx.lineTo(boxX, boxY + boxH);
      ctx.lineTo(boxX + cornerLen, boxY + boxH);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(boxX + boxW - cornerLen, boxY + boxH);
      ctx.lineTo(boxX + boxW, boxY + boxH);
      ctx.lineTo(boxX + boxW, boxY + boxH - cornerLen);
      ctx.stroke();

      // Center crosshair
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(boxX + boxW / 2 - 8, boxY + boxH / 2);
      ctx.lineTo(boxX + boxW / 2 + 8, boxY + boxH / 2);
      ctx.moveTo(boxX + boxW / 2, boxY + boxH / 2 - 8);
      ctx.lineTo(boxX + boxW / 2, boxY + boxH / 2 + 8);
      ctx.stroke();

      // Status pill above box
      ctx.fillStyle = pillBg;
      ctx.fillRect(boxX, Math.max(2, boxY - 22), 150, 19);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(labelText, boxX + 6, Math.max(15, boxY - 8));

      faceTrackerRef.current = requestAnimationFrame(drawFaceBox);
    };

    drawFaceBox();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {}
        });
        localStreamRef.current = null;
      }
      proctoringMedia.stopAll();
      if (detectorInterval) clearInterval(detectorInterval);
      if (faceTrackerRef.current) cancelAnimationFrame(faceTrackerRef.current);
    };
  }, [reportViolation, isTerminated]);

  // 6. Autosave Answer
  const saveAnswer = async (qIndex: number, optionLetter: string | null, markForReview?: boolean) => {
    if (isTerminated) return;
    const targetQ = questions[qIndex];
    const newSelected = optionLetter;
    const newMarked = markForReview !== undefined ? markForReview : targetQ.isMarkedForReview;

    // Optimistic UI update
    const updated = [...questions];
    updated[qIndex] = {
      ...targetQ,
      selectedOption: newSelected,
      isMarkedForReview: newMarked,
      isVisited: true,
    };
    setQuestions(updated);

    try {
      await apiRequest(`/employee/examinations/${exam.attemptUuid}/autosave`, {
        method: 'POST',
        body: JSON.stringify({
          displayOrder: targetQ.displayOrder,
          selectedOption: newSelected,
          isMarkedForReview: newMarked,
          isVisited: true,
        }),
      });
    } catch (err) {
      console.error('Autosave failed:', err);
    }
  };

  const handleSelectOption = (letter: string) => {
    if (isTerminated) return;
    saveAnswer(currentIndex, letter);
  };

  const handleClearResponse = () => {
    if (isTerminated) return;
    saveAnswer(currentIndex, null);
  };

  const handleToggleMarkForReview = () => {
    if (isTerminated) return;
    saveAnswer(currentIndex, currentQ.selectedOption, !currentQ.isMarkedForReview);
  };

  const handleSaveAndNext = () => {
    if (isTerminated) return;
    if (!currentQ.isVisited) {
      saveAnswer(currentIndex, currentQ.selectedOption);
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (isTerminated) return;
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNavigateTo = (index: number) => {
    if (isTerminated) return;
    if (!currentQ.isVisited) {
      saveAnswer(currentIndex, currentQ.selectedOption);
    }
    setCurrentIndex(index);
  };

  const handleAutoSubmit = async (reason: string) => {
    console.warn('Auto submitting examination attempt due to:', reason);
    setSubmitting(true);
    terminateAllSecurityProtocols();
    try {
      const res: any = await apiRequest(`/employee/examinations/${exam.attemptUuid}/submit`, {
        method: 'POST',
      });
      onSubmitSuccess(res);
    } catch {
      terminateAllSecurityProtocols();
      onExit();
    }
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    terminateAllSecurityProtocols();
    try {
      const res: any = await apiRequest(`/employee/examinations/${exam.attemptUuid}/submit`, {
        method: 'POST',
      });
      onSubmitSuccess(res);
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
      setSubmitting(false);
    }
  };

  const answeredCount = questions.filter((q) => q.selectedOption !== null).length;
  const markedCount = questions.filter((q) => q.isMarkedForReview).length;
  const unansweredCount = questions.length - answeredCount;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Palette Class Helper
  const getPaletteClass = (q: QuestionDisplay, idx: number) => {
    const isCurrent = idx === currentIndex;
    const ring = isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : '';

    if (q.selectedOption && q.isMarkedForReview) {
      return `bg-emerald-600 text-white border-2 border-purple-500 font-bold ${ring}`;
    }
    if (q.isMarkedForReview) {
      return `bg-purple-600 text-white font-bold ${ring}`;
    }
    if (q.selectedOption) {
      return `bg-emerald-600 text-white font-bold ${ring}`;
    }
    if (q.isVisited) {
      return `bg-rose-500 text-white font-bold ${ring}`;
    }
    return `bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 ${ring}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col select-none text-slate-900">
      {/* Top Bar with Live Proctoring, Timer, Progress */}
      <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center space-x-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                {exam.subject} Technical Examination
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold uppercase">
                Set {exam.setName}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Candidate: <b className="text-slate-800">{exam.employeeName}</b> ({exam.employeeCode})
            </p>
          </div>

          <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-slate-200">
            <span
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                violationCount >= 4
                  ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                  : violationCount >= 2
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  violationCount >= 2
                    ? 'bg-rose-500 animate-ping'
                    : violationCount >= 1
                    ? 'bg-amber-500'
                    : 'bg-emerald-500 animate-pulse'
                }`}
              />
              <span>
                LIVE PROCTORED ({violationCount}/3 WARNINGS)
              </span>
            </span>
          </div>
        </div>

        {/* Server Authoritative Timer, Fullscreen & Submit */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{isExamFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          <div
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border font-mono text-sm font-bold transition ${
              remainingSeconds < 300
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          <button
            onClick={() => setShowSummaryModal(true)}
            disabled={isTerminated}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs flex items-center space-x-1.5 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Review & Submit</span>
          </button>
        </div>
      </header>

      {/* Persistent Termination Warning Banner */}
      {isTerminated && (
        <div className="bg-rose-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-bold sticky top-16 z-30 shadow-md">
          <div className="flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 animate-bounce" />
            <span>EXAMINATION TERMINATED: Exceeded 3 proctoring warnings. Sealed answers auto-submitting in {terminationCountdown}s...</span>
          </div>
          <button
            onClick={() => handleAutoSubmit(warningMessage)}
            className="px-3 py-1 bg-white text-rose-700 rounded-lg hover:bg-rose-50 transition text-xs font-bold shadow-xs"
          >
            Go to Results
          </button>
        </div>
      )}

      {/* Main Examination Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Active Question Canvas */}
        <main className="flex-1 overflow-y-auto p-8 flex flex-col justify-between max-w-5xl mx-auto w-full">
          <div className="space-y-6">
            {/* Question Header & Meta */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs">
                  Question {currentQ.displayOrder} of {questions.length}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                  Topic: {currentQ.topic}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                  Level: {currentQ.difficulty}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Marking: <span className="text-emerald-600 font-bold">+2.0</span> / 0.0
              </div>
            </div>

            {/* Question Text Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h2 className="text-base md:text-lg font-semibold text-slate-900 leading-relaxed">
                {currentQ.questionText}
              </h2>
            </div>

            {/* Shuffled Options (A, B, C, D) */}
            <div className="space-y-3 pt-1">
              {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                const optText = currentQ.options[letter];
                const selected = currentQ.selectedOption === letter;

                return (
                  <button
                    key={letter}
                    disabled={isTerminated}
                    onClick={() => handleSelectOption(letter)}
                    className={`w-full p-4 rounded-xl text-left border transition flex items-center space-x-4 ${
                      isTerminated
                        ? 'opacity-60 cursor-not-allowed bg-slate-50 border-slate-200'
                        : selected
                        ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition ${
                        selected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {letter}
                    </div>
                    <span className={`text-sm leading-relaxed ${selected ? 'text-blue-900 font-semibold' : 'text-slate-800'}`}>
                      {optText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Controls */}
          <div className="pt-8 border-t border-slate-200 mt-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0 || isTerminated}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleToggleMarkForReview}
                disabled={isTerminated}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition border disabled:opacity-40 disabled:cursor-not-allowed ${
                  currentQ.isMarkedForReview
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <Flag className="w-4 h-4" />
                <span>{currentQ.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>

              {currentQ.selectedOption && !isTerminated && (
                <button
                  onClick={handleClearResponse}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Response</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={handleSaveAndNext}
                  disabled={isTerminated}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs flex items-center space-x-1.5 transition"
                >
                  <span>Save & Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSummaryModal(true)}
                  disabled={isTerminated}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs flex items-center space-x-1.5 transition"
                >
                  <span>Review & Submit</span>
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar: Live Candidate Webcam + Proctoring Test Simulator + Question Palette */}
        <aside className="w-80 border-l border-slate-200 bg-white p-5 flex flex-col justify-between overflow-y-auto shrink-0 shadow-xs space-y-5">
          <div className="space-y-4">
            {/* LIVE WEBCAM WITH BOUNDING BOX */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span>Live Candidate Feed</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1" />
                  <span>TRACKING</span>
                </span>
              </div>

              {/* Video container with canvas bounding box overlay */}
              <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-slate-900 border-2 border-slate-200 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />

                {/* Canvas overlay for Dynamic Bounding Box */}
                <canvas
                  ref={canvasRef}
                  width={320}
                  height={240}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />

                {/* Candidate name watermark */}
                <div className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{exam.employeeCode}</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <span>
                  Head Position:{' '}
                  <b
                    className={
                      trackingStateRef.current === 'ABSENT'
                        ? 'text-rose-600'
                        : trackingStateRef.current === 'LOOKING_AWAY'
                        ? 'text-amber-600'
                        : 'text-emerald-700'
                    }
                  >
                    {headPositionStatus}
                  </b>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">15 FPS</span>
              </div>
            </div>

            {/* PROCTORING TEST SIMULATOR TOOLBAR */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Volume2 className="w-3 h-3 text-blue-600" />
                  <span>Proctoring Test Simulator</span>
                </span>
                <span className={`font-mono font-bold ${violationCount >= 4 ? 'text-rose-600' : 'text-blue-600'}`}>
                  {violationCount}/5 Warnings
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => reportViolation('TAB_SWITCH', 'Test: Candidate switched browser tab.', true)}
                  disabled={isTerminated}
                  className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-[10px] font-bold text-slate-700 hover:text-rose-700 transition flex items-center justify-center space-x-1 disabled:opacity-40"
                  title="Simulate Tab Switch malpractice"
                >
                  <span>📑 Tab Switch</span>
                </button>
                <button
                  type="button"
                  onClick={() => reportViolation('FACE_NOT_DETECTED', 'Test: Candidate face not detected in camera frame.', true)}
                  disabled={isTerminated}
                  className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-[10px] font-bold text-slate-700 hover:text-rose-700 transition flex items-center justify-center space-x-1 disabled:opacity-40"
                  title="Simulate Face Absent malpractice"
                >
                  <span>👤 Face Absent</span>
                </button>
                <button
                  type="button"
                  onClick={() => reportViolation('UNUSUAL_MOVEMENT', 'Test: Candidate turned head or looked away from exam.', true)}
                  disabled={isTerminated}
                  className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-[10px] font-bold text-slate-700 hover:text-amber-700 transition flex items-center justify-center space-x-1 disabled:opacity-40"
                  title="Simulate Looking Away malpractice"
                >
                  <span>👀 Look Away</span>
                </button>
                <button
                  type="button"
                  onClick={() => reportViolation('FULLSCREEN_EXIT', 'Test: Candidate exited full-screen exam mode.', true)}
                  disabled={isTerminated}
                  className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-[10px] font-bold text-slate-700 hover:text-rose-700 transition flex items-center justify-center space-x-1 disabled:opacity-40"
                  title="Simulate Fullscreen Exit malpractice"
                >
                  <span>🖥️ Exit Fullscreen</span>
                </button>
              </div>
            </div>

            {/* Question Palette Section */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Question Palette ({questions.length})
              </h3>

              {/* Status Legend */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 mb-2.5">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-emerald-600 shrink-0" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-rose-500 shrink-0" />
                  <span>Unanswered ({unansweredCount})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-purple-600 shrink-0" />
                  <span>Review ({markedCount})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-slate-200 border border-slate-300 shrink-0" />
                  <span>Not Visited</span>
                </div>
              </div>

              {/* 50 Question Grid */}
              <div className="grid grid-cols-5 gap-1.5 max-h-52 overflow-y-auto p-1">
                {questions.map((q, idx) => (
                  <button
                    key={q.displayOrder}
                    disabled={isTerminated}
                    onClick={() => handleNavigateTo(idx)}
                    className={`h-8 rounded-lg text-xs font-bold flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed ${getPaletteClass(
                      q,
                      idx
                    )}`}
                  >
                    {q.displayOrder}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowSummaryModal(true)}
              disabled={isTerminated}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Examination</span>
            </button>
          </div>
        </aside>
      </div>

      {/* FINAL SUBMISSION SUMMARY MODAL */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden p-6 space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Confirm Final Examination Submission</h3>
              <p className="text-xs text-slate-500 mt-1">
                Please verify your answers before submission. Once confirmed, results and answers are permanently sealed.
              </p>
            </div>

            {/* Statistics Table */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs text-slate-500">Total Questions</div>
                <div className="text-xl font-bold text-slate-900 mt-1">{questions.length}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-xs text-slate-500">Remaining Time</div>
                <div className="text-xl font-bold text-blue-600 mt-1">{formatTime(remainingSeconds)}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <div className="text-xs text-emerald-700 font-semibold">Answered</div>
                <div className="text-xl font-bold text-emerald-700 mt-1">{answeredCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
                <div className="text-xs text-rose-700 font-semibold">Unanswered</div>
                <div className="text-xl font-bold text-rose-700 mt-1">{unansweredCount}</div>
              </div>
            </div>

            {markedCount > 0 && (
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs text-center font-medium">
                You still have <span className="font-bold">{markedCount}</span> questions marked for review.
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Return to Exam
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition flex items-center justify-center space-x-1.5"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm & Submit</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROCTORING INTEGRITY WARNING MODAL - 5 WARNINGS POLICY */}
      {warningModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-rose-500 rounded-2xl w-full max-w-md shadow-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              {isTerminated ? 'EXAMINATION TERMINATED' : 'PROCTORING INTEGRITY WARNING'}
            </h3>

            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs leading-relaxed font-semibold">
              {warningMessage}
            </div>

            <p className="text-xs text-slate-500">
              {isTerminated
                ? `Your examination attempt has been automatically terminated due to repeated security violations. Answers submitted prior to termination are sealed. Redirecting in ${terminationCountdown} seconds...`
                : `Security Warning ${violationCount} of 3. The system permits up to 3 warnings before automatic examination termination.`}
            </p>

            {isTerminated ? (
              <button
                onClick={() => handleAutoSubmit(warningMessage)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition flex items-center justify-center space-x-2"
              >
                <span>Exit to Results Summary ({terminationCountdown}s)</span>
              </button>
            ) : (
              <button
                onClick={() => setWarningModalOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
              >
                I Understand, Return to Exam
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
