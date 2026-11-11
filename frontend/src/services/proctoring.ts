import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export class ProctoringMediaService {
  private webcamStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;

  async requestWebcam(): Promise<MediaStream> {
    if (this.webcamStream) return this.webcamStream;
    try {
      this.webcamStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { max: 15 } },
        audio: false,
      });
      return this.webcamStream;
    } catch (err: any) {
      throw new Error(`Webcam access denied or unavailable: ${err.message}`);
    }
  }

  async requestScreenShare(onEndedCallback?: () => void): Promise<MediaStream> {
    if (this.screenStream) return this.screenStream;
    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { max: 10 } },
        audio: false,
      });

      const track = this.screenStream.getVideoTracks()[0];
      if (track) {
        track.onended = () => {
          this.screenStream = null;
          if (onEndedCallback) onEndedCallback();
        };
      }
      return this.screenStream;
    } catch (err: any) {
      throw new Error(`Screen sharing permission denied: ${err.message}`);
    }
  }

  stopAll(): void {
    if (this.webcamStream) {
      this.webcamStream.getTracks().forEach((t) => {
        try {
          t.enabled = false;
          t.stop();
        } catch {}
      });
      this.webcamStream = null;
    }
    if (this.screenStream) {
      this.screenStream.getTracks().forEach((t) => {
        try {
          t.enabled = false;
          t.stop();
        } catch {}
      });
      this.screenStream = null;
    }
  }

  getWebcamStream(): MediaStream | null {
    return this.webcamStream;
  }

  getScreenStream(): MediaStream | null {
    return this.screenStream;
  }
}

export const proctoringMedia = new ProctoringMediaService();

export function createStompClient(): Client {
  const client = new Client({
    webSocketFactory: () => new SockJS('/ws'),
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
  });
  return client;
}

