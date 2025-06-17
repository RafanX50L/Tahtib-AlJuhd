import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"

export function useMediaStream({ initialVideoEnabled = true, initialAudioEnabled = true } = {}) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isVideoOn, setIsVideoOn] = useState(initialVideoEnabled)
  const [isMicOn, setIsMicOn] = useState(initialAudioEnabled)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)

  // Get initial media on mount only
  useEffect(() => {
    async function getMedia() {
      try {
        // Clean up any existing stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }

        setIsReconnecting(true)

        // Request media with initial settings
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: initialVideoEnabled,
          audio: initialAudioEnabled,
        })

        // Store the stream
        streamRef.current = mediaStream
        setStream(mediaStream)

        // Ensure state matches what we actually got
        setIsVideoOn(mediaStream.getVideoTracks().some((track) => track.enabled))
        setIsMicOn(mediaStream.getAudioTracks().some((track) => track.enabled))
      } catch (error) {
        console.error("Media error:", error)
        toast.error("Could not access media devices")
        setIsVideoOn(false)
        setIsMicOn(false)
      } finally {
        setIsReconnecting(false)
      }
    }

    getMedia()

    // Clean up on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [initialVideoEnabled, initialAudioEnabled])

  // Toggle video - the key fix
  const toggleVideo = async () => {
    if (!streamRef.current) return

    const videoTracks = streamRef.current.getVideoTracks()

    if (isVideoOn) {
      // Important: DISABLE tracks when turning off, don't remove them
      videoTracks.forEach((track) => {
        track.enabled = false
      })
      setIsVideoOn(false)
      toast.success("Camera disabled")
    } else {
      // If no video tracks or all are disabled, enable them or get new ones
      if (videoTracks.length === 0) {
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          })
          videoStream.getVideoTracks().forEach((track) => {
            streamRef.current?.addTrack(track)
          })
          // Force update the stream reference to trigger UI updates
          setStream(streamRef.current?.clone() || null)
          setIsVideoOn(true)
        } catch (err) {
          console.error("Failed to get video:", err)
          toast.error("Could not access camera")
        }
      } else {
        // Enable existing tracks
        videoTracks.forEach((track) => {
          track.enabled = true
        })
        // Force update the stream reference to trigger UI updates
        setStream(streamRef.current?.clone() || null)
        setIsVideoOn(true)
      }
      toast.success("Camera enabled")
    }
  }

  // Toggle microphone (similar to video)
  const toggleMic = async () => {
    if (!streamRef.current) return

    const audioTracks = streamRef.current.getAudioTracks()

    if (isMicOn) {
      // Disable tracks when turning off
      audioTracks.forEach((track) => {
        track.enabled = false
      })
      setIsMicOn(false)
      toast.success("Microphone disabled")
    } else {
      if (audioTracks.length === 0) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          })
          audioStream.getAudioTracks().forEach((track) => {
            streamRef.current?.addTrack(track)
          })
          setIsMicOn(true)
          setStream(streamRef.current?.clone() || null)
        } catch (err) {
          console.error("Failed to get audio:", err)
          toast.error("Could not access microphone")
        }
      } else {
        // Enable existing tracks
        audioTracks.forEach((track) => {
          track.enabled = true
        })
        setIsMicOn(true)
      }
      toast.success("Microphone enabled")
    }
  }

  // Update peers with current stream tracks
  const updatePeersWithStream = (peers: any) => {
    if (!streamRef.current) return

    Object.values(peers).forEach((peer: any) => {
      if (peer && !peer.destroyed) {
        // Get all current tracks from the stream
        const tracks = streamRef.current?.getTracks() || []

        // Add each track to the peer
        tracks.forEach((track) => {
          // Only add tracks that match our enabled state
          if ((track.kind === "video" && isVideoOn) || (track.kind === "audio" && isMicOn)) {
            try {
              if (streamRef.current) {
                peer.addTrack(track, streamRef.current)
              }
            } catch (e) {
              // Might already have this track, try replacing instead
              try {
                const senders = peer.getSenders?.() || []
                const sender = senders.find((s: any) => s.track && s.track.kind === track.kind)
                if (sender) {
                  sender.replaceTrack(track)
                }
              } catch (err) {
                console.warn("Error updating peer track:", err)
              }
            }
          }
        })
      }
    })
  }

  // Simple function to handle media errors
  const handleMediaError = () => {
    toast.error("Media device disconnected")
    // Force refresh the stream next time it's used
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setStream(null)
    }
  }

  return {
    stream,
    streamRef,
    isVideoOn,
    isMicOn,
    isReconnecting,
    toggleVideo,
    toggleMic,
    handleMediaError,
    updatePeersWithStream,
  }
}