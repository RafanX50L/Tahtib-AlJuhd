 

import { Button } from "@/components/ui/button"
import { Maximize2, PinIcon, UserIcon, Volume2, MicOff } from "lucide-react"

interface RemoteVideoProps {
  setVideoRef: (ref: HTMLVideoElement | null) => void
  remoteVideoEnabled: boolean
  remoteAudioEnabled: boolean
  isPinned: boolean
  setIsPinned: (pinned: boolean) => void
}

const RemoteVideo = ({
  setVideoRef,
  remoteVideoEnabled,
  remoteAudioEnabled,
  isPinned,
  setIsPinned,
}: RemoteVideoProps) => {
  const togglePinVideo = () => {
    setIsPinned(!isPinned)
  }

  return (
    <>
      <video
        ref={setVideoRef}
        autoPlay
        playsInline
        className={remoteVideoEnabled ? "h-full w-full object-cover" : "h-full w-full object-cover opacity-0"}
      />

      {/* Show placeholder when remote video is disabled */}
      {!remoteVideoEnabled && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-700">
          <UserIcon className="h-16 w-16 text-slate-400" />
          <div className="mt-2 text-center text-white">Camera Off</div>
        </div>
      )}

      {/* Audio indicator when remote audio is muted */}
      {!remoteAudioEnabled && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-60 p-2 rounded-full">
          <MicOff className="h-5 w-5 text-red-500" />
        </div>
      )}

      {/* Video controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={togglePinVideo}
          className="rounded-full bg-black bg-opacity-30 backdrop-blur-sm border-none"
        >
          <PinIcon className={`h-4 w-4 ${isPinned ? "text-blue-400" : ""}`} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-black bg-opacity-30 backdrop-blur-sm border-none"
        >
          <Volume2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-black bg-opacity-30 backdrop-blur-sm border-none"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </>
  )
}

export default RemoteVideo

