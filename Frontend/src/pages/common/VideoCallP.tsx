import { useState, useRef, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
// import type { storeType } from "@/lib/store";
import { useMediaStream } from "@/hooks/use-media-stream";
import { usePeerConnections } from "@/hooks/use-peer-connections";
import ErrorNotification from "@/components/error-notification";
import VideoCallControls, {
  NavigateFunction,
} from "@/components/video-call/video-call-controls";
import VideoCallChat from "@/components/video-call/video-call-chat";
import RemoteVideo from "@/components/video-call/remote-video";
import LocalVideo from "@/components/video-call/local-video";
import VideoCallHeader from "@/components/video-call/video-call-header";
import { RootState } from "@/store/store";
import { useSocket } from "@/hooks/socketio";

const VideoCall = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const socket = useSocket();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [callStatus, setCallStatus] = useState("Waiting to connect");
  const [isPinned, setIsPinned] = useState(false);
  //   const { meetid: meetId } = useParams();
  //   const router = useRouter();
  const { meetId } = useParams();
  const navigate = useNavigate() as NavigateFunction;
  // if (!socket) return;
  console.log("user", user, "meetId", meetId);

  const {
    stream,
    streamRef,
    isVideoOn,
    isMicOn,
    isReconnecting,
    toggleVideo,
    toggleMic,
    handleMediaError,
    updatePeersWithStream,
  } = useMediaStream();

  useEffect(() => {
    console.log("streamRef", streamRef);
  });

  const {
    peers,
    participants,
    messages,
    setVideoRef,
    remoteVideosRef,
    notifyVideoStateChange,
    notifyAudioStateChange,
    remoteVideoEnabled,
    remoteAudioEnabled,
    error,
    sendMessage,
  } = usePeerConnections(streamRef, user, meetId, socket);

  const localRef = useRef<HTMLVideoElement | null>(null);

  // Handle video toggle with notification to peers
  const handleVideoToggle = async () => {
    await toggleVideo();
    notifyVideoStateChange(!isVideoOn);

    if (peers) {
      updatePeersWithStream(peers);
    }
  };

  // Handle audio toggle with notification to peers
  const handleAudioToggle = async () => {
    await toggleMic();
    notifyAudioStateChange(!isMicOn);

    if (peers) {
      updatePeersWithStream(peers);
    }
  };

  // Update connection status based on participants
  useEffect(() => {
    if (peers) {
      setCallStatus("Connected");
    } else {
      setCallStatus("Waiting to connect");
    }
  }, [peers]);

  // Connect local video stream to video element
  useEffect(() => {
    if (streamRef?.current && localRef?.current) {
      localRef.current.srcObject = streamRef.current;
    }
  }, [stream, streamRef, isVideoOn]);

  if (error) {
    setTimeout(() => {
      //   router.push("/");
      navigate("/");
    }, 5000);
    return <ErrorNotification errorMessage={error} />;
  }

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Main Video Area */}
      <div className={`flex-1 flex flex-col ${isChatOpen ? "pr-4" : ""}`}>
        {/* Header */}
        <VideoCallHeader callStatus={callStatus} />

        {/* Video Grid */}
        <div className="flex-1 p-4 flex flex-col h-full relative">
          {/* Main Remote Video */}
          <div className="flex-1 bg-slate-800 border-slate-700 rounded-xl overflow-hidden shadow-lg mb-4 relative">
            <RemoteVideo
              setVideoRef={setVideoRef}
              remoteVideoEnabled={remoteVideoEnabled}
              remoteAudioEnabled={remoteAudioEnabled}
              isPinned={isPinned}
              setIsPinned={setIsPinned}
            />

            {/* Local video (picture-in-picture) */}
            <LocalVideo
              localRef={localRef}
              isVideoOn={isVideoOn}
              isConnected={!!peers}
            />
          </div>
        </div>

        {/* Controls */}
        <VideoCallControls
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
          isChatOpen={isChatOpen}
          handleAudioToggle={handleAudioToggle}
          handleVideoToggle={handleVideoToggle}
          setIsChatOpen={setIsChatOpen}
          //   router={router}
          navigate={navigate}
        />
      </div>

      {/* Chat Sidebar */}
      {isChatOpen && (
        <VideoCallChat
          messages={messages}
          setIsChatOpen={setIsChatOpen}
          user={user}
          sendMessage={sendMessage}
        />
      )}
    </div>
  );
};

export default VideoCall;
