import { useRef, useCallback, useEffect } from 'react';
import { ProgressService } from '@/services/progress.service';

// Global video manager to ensure only one video plays at a time
class VideoManager {
  private static instance: VideoManager;
  private currentPlayingVideo: HTMLVideoElement | null = null;

  static getInstance(): VideoManager {
    if (!VideoManager.instance) {
      VideoManager.instance = new VideoManager();
    }
    return VideoManager.instance;
  }

  setCurrentVideo(video: HTMLVideoElement | null) {
    // Pause the previous video if it exists and is different
    if (this.currentPlayingVideo && this.currentPlayingVideo !== video) {
      this.currentPlayingVideo.pause();
    }
    
    this.currentPlayingVideo = video;
  }

  pauseCurrentVideo() {
    if (this.currentPlayingVideo) {
      this.currentPlayingVideo.pause();
      this.currentPlayingVideo = null;
    }
  }

  getCurrentVideo(): HTMLVideoElement | null {
    return this.currentPlayingVideo;
  }
}

export const useVideoManager = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoManager = VideoManager.getInstance();
  const lastSentRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const avgRateRef = useRef<number>(1);
  const videoIdRef = useRef<string | null>(null);

  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      videoManager.setCurrentVideo(videoRef.current);
    }
  }, [videoManager]);

  const handlePause = useCallback(() => {
    if (videoRef.current === videoManager.getCurrentVideo()) {
      videoManager.setCurrentVideo(null);
    }
  }, [videoManager]);

  const pauseVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  // Cleanup effect to pause video when component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current === videoManager.getCurrentVideo()) {
        videoManager.pauseCurrentVideo();
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [videoManager]);

  const startTracking = useCallback((videoId: string) => {
    videoIdRef.current = videoId;
    lastSentRef.current = 0;
    const tick = () => {
      const el = videoRef.current;
      if (!el || !videoIdRef.current) return;
      const duration = el.duration || 0;
      if (duration > 0) {
        const percent = Math.min(100, Math.round((el.currentTime / duration) * 100));
        avgRateRef.current = (avgRateRef.current + (el.playbackRate || 1)) / 2;
        const now = Date.now();
        if (percent !== lastSentRef.current && now - (window as any).__lastVideoSendAt__ > 1000) {
          (window as any).__lastVideoSendAt__ = now;
          lastSentRef.current = percent;
          ProgressService.upsertVideo({
            videoId: videoIdRef.current,
            watchPercent: percent,
            avgPlaybackRate: avgRateRef.current,
          }).catch(() => {});
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopTracking = useCallback(() => {
    videoIdRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  return {
    videoRef,
    handlePlay,
    handlePause,
    pauseVideo,
    startTracking,
    stopTracking
  };
};