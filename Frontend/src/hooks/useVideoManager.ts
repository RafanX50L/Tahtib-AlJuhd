import { useRef, useCallback, useEffect } from 'react';

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
    };
  }, [videoManager]);

  return {
    videoRef,
    handlePlay,
    handlePause,
    pauseVideo
  };
};