import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Video } from "lucide-react"

interface VideoCallHeaderProps {
  callStatus: string
}

const VideoCallHeader = ({ callStatus }: VideoCallHeaderProps) => {
  const isConnected = callStatus === "Connected"

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-800 to-slate-800">
      <div className="flex items-center gap-2">
        <Video className="h-5 w-5 text-blue-400" />
        <h1 className="text-xl font-bold">Video Call</h1>
        <Badge variant="outline" className={`ml-2 ${isConnected ? "bg-green-600" : "bg-amber-600"}`}>
          {callStatus}
        </Badge>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="text-blue-300">
          <Settings className="h-4 w-4 mr-1" />
          Settings
        </Button>
      </div>
    </div>
  )
}

export default VideoCallHeader

