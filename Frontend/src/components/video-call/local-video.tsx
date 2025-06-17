 

import { Card } from "@/components/ui/card"
import { UserIcon } from "lucide-react"
import { useEffect, type RefObject } from "react"

interface LocalVideoProps {
  localRef: RefObject<HTMLVideoElement> | null
  isVideoOn: boolean
  isConnected: boolean
}

const LocalVideo = ({ localRef, isVideoOn, isConnected }: LocalVideoProps) => {
  // Add useEffect to handle video visibility changes
  useEffect(() => {
    if (localRef?.current) {
      if (isVideoOn) {
        // Ensure video is visible when enabled
        localRef.current.style.display = "block"
      } else {
        // Hide video element when disabled
        localRef.current.style.display = "none"
      }
    }
  }, [isVideoOn, localRef])

  return (
    <div className="absolute bottom-5 right-5">
      <Card className="h-32 w-40 flex-shrink-0 bg-slate-800 border-slate-700 rounded-xl overflow-hidden shadow-lg relative">
        <video
          ref={localRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover ${isVideoOn ? "block" : "hidden"}`}
        />
        {!isVideoOn && (
          <div className="absolute inset-0 flex items-center justify-center">
            <UserIcon className="h-8 w-8 text-slate-400" />
          </div>
        )}
        <div className="absolute bottom-1 left-1 bg-white bg-opacity-60 px-2 py-0.5 rounded-md text-xs backdrop-blur-sm">
          You {!isVideoOn && "(Camera Off)"}
        </div>
        <div className="absolute top-1 right-1">
          <svg
            className={`h-4 w-4 ${isConnected ? "text-green-500" : "text-gray-400"}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
          </svg>
        </div>
      </Card>
    </div>
  )
}

export default LocalVideo

