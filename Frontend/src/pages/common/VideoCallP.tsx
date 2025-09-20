import { useState, useRef, useEffect, RefObject } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
    // isReconnecting,
    toggleVideo,
    toggleMic,
    // handleMediaError,
    updatePeersWithStream,
  } = useMediaStream();

  useEffect(() => {
    console.log("streamRef", streamRef);
  });

  const {
    peers,
    // participants,
    messages,
    setVideoRef,
    // remoteVideosRef,
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
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Main Video Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isChatOpen ? "mr-2" : ""
      }`}>
        {/* Header */}
        <div className="flex-shrink-0">
          <VideoCallHeader callStatus={callStatus} />
        </div>

        {/* Video Container - Full height minus header and controls */}
        <div className="flex-1 flex flex-col min-h-0 p-4">
          {/* Main Remote Video Container */}
          <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg relative min-h-0">
            <RemoteVideo
              setVideoRef={setVideoRef}
              remoteVideoEnabled={remoteVideoEnabled}
              remoteAudioEnabled={remoteAudioEnabled}
              isPinned={isPinned}
              setIsPinned={setIsPinned}
            />

            {/* Local video (picture-in-picture) - Fixed positioning */}
            <div className="top-4 right-4 z-10">
              <LocalVideo
                localRef={localRef as RefObject<HTMLVideoElement>}
                isVideoOn={isVideoOn}
                isConnected={!!peers}
              />
            </div>
          </div>
        </div>

        {/* Controls - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 pt-0">
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
      </div>

      {/* Chat Sidebar */}
      {isChatOpen && (
        <div className="w-80 flex-shrink-0 border-l border-slate-700">
          <VideoCallChat
            messages={messages}
            setIsChatOpen={setIsChatOpen}
            user={user}
            sendMessage={sendMessage}
          />
        </div>
      )}
    </div>
  );
};

export default VideoCall;


// import React, { useState, useRef, useEffect } from 'react';
// import { useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import {
//   Settings,
//   Video,
//   Maximize2,
//   Pin,
//   User,
//   Volume2,
//   MicOff,
//   Mic,
//   VideoOff,
//   ScreenShare,
//   MessageSquare,
//   Phone,
//   Camera,
//   X,
//   Send,
//   PhoneOff
// } from "lucide-react";

// import { useMediaStream } from "@/hooks/use-media-stream";
// import { usePeerConnections } from "@/hooks/use-peer-connections";
// import ErrorNotification from "@/components/error-notification";
// import { useSocket } from "@/hooks/socketio";

// const VideoCallHeader = ({ callStatus }) => {
//   const isConnected = callStatus === "Connected";
  
//   return (
//     <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-b border-slate-700/50">
//       <div className="flex items-center space-x-3">
//         <div className="p-2 bg-blue-500/20 rounded-lg">
//           <Video className="h-5 w-5 text-blue-400" />
//         </div>
//         <div>
//           <h1 className="text-lg font-semibold text-white">Video Call</h1>
//           <Badge 
//             variant="outline" 
//             className={`text-xs px-2 py-1 border-0 ${
//               isConnected 
//                 ? "bg-emerald-500/20 text-emerald-400" 
//                 : "bg-amber-500/20 text-amber-400"
//             }`}
//           >
//             <div className={`w-2 h-2 rounded-full mr-2 ${
//               isConnected ? "bg-emerald-400" : "bg-amber-400"
//             } animate-pulse`} />
//             {callStatus}
//           </Badge>
//         </div>
//       </div>
      
//       <Button 
//         variant="ghost" 
//         size="sm" 
//         className="text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
//       >
//         <Settings className="h-4 w-4 mr-2" />
//         Settings
//       </Button>
//     </div>
//   );
// };

// const RemoteVideo = ({
//   setVideoRef,
//   remoteVideoEnabled,
//   remoteAudioEnabled,
//   isPinned,
//   setIsPinned,
// }) => {
//   const togglePinVideo = () => setIsPinned(!isPinned);

//   return (
//     <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden group">
//       {/* Video element */}
//       <video
//         ref={(ref) => setVideoRef(ref)}
//         className={`w-full h-full object-cover transition-opacity duration-300 ${
//           remoteVideoEnabled ? 'opacity-100' : 'opacity-0'
//         }`}
//         style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
//         autoPlay
//         playsInline
//       />
      
//       {/* Camera off overlay */}
//       {!remoteVideoEnabled && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm">
//           <div className="p-6 bg-slate-700/50 rounded-full mb-4 backdrop-blur-sm">
//             <User className="h-16 w-16 text-slate-400" />
//           </div>
//           <p className="text-slate-300 text-lg font-medium">Camera is off</p>
//           <p className="text-slate-500 text-sm mt-1">Participant</p>
//         </div>
//       )}

//       {/* Audio muted indicator */}
//       {!remoteAudioEnabled && (
//         <div className="absolute top-6 left-6 p-2 bg-red-500/20 backdrop-blur-sm rounded-lg border border-red-500/30">
//           <MicOff className="h-4 w-4 text-red-400" />
//         </div>
//       )}

//       {/* Control buttons - appear on hover */}
//       <div className="absolute top-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={togglePinVideo}
//           className="p-2 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm rounded-lg border border-slate-600/50"
//         >
//           <Pin className={`h-4 w-4 ${isPinned ? 'text-blue-400' : 'text-slate-300'}`} />
//         </Button>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="p-2 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm rounded-lg border border-slate-600/50"
//         >
//           <Maximize2 className="h-4 w-4 text-slate-300" />
//         </Button>
//       </div>

//       {/* Connection status */}
//       <div className="absolute bottom-6 left-6">
//         <div className="flex items-center space-x-2 p-2 bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-600/30">
//           <Volume2 className="h-4 w-4 text-emerald-400" />
//           <span className="text-sm text-slate-300 font-medium">Remote User</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const LocalVideo = ({ localRef, isVideoOn, isConnected }) => {
//   useEffect(() => {
//     if (localRef?.current) {
//       localRef.current.style.display = isVideoOn ? "block" : "none";
//     }
//   }, [isVideoOn, localRef]);

//   return (
//     <div className="absolute bottom-6 right-6 w-48 h-32 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-600/50 bg-gradient-to-br from-slate-800 to-slate-900 group hover:scale-105 transition-transform duration-200">
//       <video
//         ref={localRef}
//         className="w-full h-full object-cover"
//         style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
//         autoPlay
//         muted
//         playsInline
//       />
      
//       {!isVideoOn && (
//         <div className="absolute inset-0 flex items-center justify-center bg-slate-800/90 backdrop-blur-sm">
//           <div className="p-3 bg-slate-700/50 rounded-full">
//             <User className="h-6 w-6 text-slate-400" />
//           </div>
//         </div>
//       )}
      
//       <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
//         <div className="flex items-center justify-between">
//           <span className="text-xs text-white font-medium">
//             You {!isVideoOn && "(Camera Off)"}
//           </span>
//           <div className="flex space-x-1">
//             {!isVideoOn && (
//               <div className="p-1 bg-red-500/20 rounded">
//                 <VideoOff className="h-3 w-3 text-red-400" />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const VideoCallControls = ({
//   isMicOn,
//   isVideoOn,
//   isChatOpen,
//   handleAudioToggle,
//   handleVideoToggle,
//   setIsChatOpen,
//   navigate,
// }) => {
//   const controls = [
//     {
//       icon: isMicOn ? Mic : MicOff,
//       onClick: handleAudioToggle,
//       active: isMicOn,
//       className: isMicOn 
//         ? "bg-slate-700/80 hover:bg-slate-600/80 text-white" 
//         : "bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
//     },
//     {
//       icon: isVideoOn ? Camera : VideoOff,
//       onClick: handleVideoToggle,
//       active: isVideoOn,
//       className: isVideoOn
//         ? "bg-slate-700/80 hover:bg-slate-600/80 text-white"
//         : "bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
//     },
//     {
//       icon: MessageSquare,
//       onClick: () => setIsChatOpen(!isChatOpen),
//       active: isChatOpen,
//       className: isChatOpen
//         ? "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30"
//         : "bg-slate-700/80 hover:bg-slate-600/80 text-white"
//     }
//   ];

//   return (
//     <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
//       <div className="flex items-center space-x-4 p-4 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl">
//         {controls.map((control, index) => {
//           const Icon = control.icon;
//           return (
//             <Button
//               key={index}
//               variant="ghost"
//               size="sm"
//               onClick={control.onClick}
//               className={`p-4 rounded-xl border transition-all duration-200 hover:scale-105 ${control.className}`}
//             >
//               <Icon className="h-5 w-5" />
//             </Button>
//           );
//         })}
        
//         <Separator orientation="vertical" className="h-8 bg-slate-600/50" />
        
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => navigate("/")}
//           className="p-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all duration-200 hover:scale-105"
//         >
//           <PhoneOff className="h-5 w-5" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// const VideoCallChat = ({ messages, setIsChatOpen, user, sendMessage }) => {
//   const [newMessage, setNewMessage] = useState("");

//   const handleSendMessage = (e) => {
//     e?.preventDefault();
//     if (newMessage.trim()) {
//       sendMessage(newMessage);
//       setNewMessage("");
//     }
//   };

//   return (
//     <div className="w-80 h-full bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 flex flex-col animate-in slide-in-from-right duration-300">
//       {/* Chat Header */}
//       <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
//         <div className="flex items-center space-x-2">
//           <div className="p-2 bg-blue-500/20 rounded-lg">
//             <MessageSquare className="h-4 w-4 text-blue-400" />
//           </div>
//           <h3 className="text-lg font-semibold text-white">Chat</h3>
//         </div>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => setIsChatOpen(false)}
//           className="text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
//         >
//           <X className="h-4 w-4" />
//         </Button>
//       </div>

//       {/* Messages */}
//       <ScrollArea className="flex-1 p-4">
//         <div className="space-y-4">
//           {messages && messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex flex-col space-y-2 ${
//                 message.username === user?.name || message.username === 'You' ? 'items-end' : 'items-start'
//               }`}
//             >
//               <div className="flex items-center space-x-2 text-xs text-slate-400">
//                 <span className="font-medium">{message.username}</span>
//                 <span>{message.timestamp}</span>
//               </div>
//               <div
//                 className={`max-w-[80%] p-3 rounded-2xl ${
//                   message.username === user?.name || message.username === 'You'
//                     ? 'bg-blue-500/20 text-blue-100 border border-blue-500/30'
//                     : 'bg-slate-700/50 text-slate-200 border border-slate-600/50'
//                 }`}
//               >
//                 {message.message}
//               </div>
//             </div>
//           ))}
//         </div>
//       </ScrollArea>

//       <Separator className="bg-slate-700/50" />

//       {/* Message Input */}
//       <div className="p-4">
//         <div className="flex space-x-2">
//           <Input
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={(e) => {
//               if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSendMessage(e);
//               }
//             }}
//             placeholder="Type a message..."
//             className="flex-1 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl"
//           />
//           <Button
//             onClick={handleSendMessage}
//             size="sm"
//             className="px-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-xl transition-all duration-200 hover:scale-105"
//           >
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main VideoCall Component - Real Implementation
// const VideoCall = () => {
//   const { user } = useSelector((state) => state.auth);
//   const socket = useSocket();
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [callStatus, setCallStatus] = useState("Waiting to connect");
//   const [isPinned, setIsPinned] = useState(false);
//   const { meetId } = useParams();
//   const navigate = useNavigate();

//   console.log("user", user, "meetId", meetId);

//   const {
//     stream,
//     streamRef,
//     isVideoOn,
//     isMicOn,
//     isReconnecting,
//     toggleVideo,
//     toggleMic,
//     handleMediaError,
//     updatePeersWithStream,
//   } = useMediaStream();

//   useEffect(() => {
//     console.log("streamRef", streamRef);
//   }, [streamRef]);

//   const {
//     peers,
//     participants,
//     messages,
//     setVideoRef,
//     remoteVideosRef,
//     notifyVideoStateChange,
//     notifyAudioStateChange,
//     remoteVideoEnabled,
//     remoteAudioEnabled,
//     error,
//     sendMessage,
//   } = usePeerConnections(streamRef, user, meetId, socket);

//   const localRef = useRef(null);

//   // Handle video toggle with notification to peers
//   const handleVideoToggle = async () => {
//     await toggleVideo();
//     notifyVideoStateChange(!isVideoOn);

//     if (peers) {
//       updatePeersWithStream(peers);
//     }
//   };

//   // Handle audio toggle with notification to peers
//   const handleAudioToggle = async () => {
//     await toggleMic();
//     notifyAudioStateChange(!isMicOn);

//     if (peers) {
//       updatePeersWithStream(peers);
//     }
//   };

//   // Update connection status based on participants
//   useEffect(() => {
//     if (peers) {
//       setCallStatus("Connected");
//     } else {
//       setCallStatus("Waiting to connect");
//     }
//   }, [peers]);

//   // Connect local video stream to video element
//   useEffect(() => {
//     if (streamRef?.current && localRef?.current) {
//       localRef.current.srcObject = streamRef.current;
//     }
//   }, [stream, streamRef, isVideoOn]);

//   if (error) {
//     setTimeout(() => {
//       navigate("/");
//     }, 5000);
//     return <ErrorNotification errorMessage={error} />;
//   }

//   return (
//     <div className="h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex overflow-hidden">
//       {/* Main Video Area */}
//       <div className="flex-1 flex flex-col relative">
//         {/* Header */}
//         <VideoCallHeader callStatus={callStatus} />
        
//         {/* Video Container */}
//         <div className="flex-1 p-6 relative">
//           <RemoteVideo
//             setVideoRef={setVideoRef}
//             remoteVideoEnabled={remoteVideoEnabled}
//             remoteAudioEnabled={remoteAudioEnabled}
//             isPinned={isPinned}
//             setIsPinned={setIsPinned}
//           />
          
//           {/* Local Video (Picture-in-Picture) */}
//           <LocalVideo
//             localRef={localRef}
//             isVideoOn={isVideoOn}
//             isConnected={!!peers}
//           />
//         </div>
        
//         {/* Controls */}
//         <VideoCallControls
//           isMicOn={isMicOn}
//           isVideoOn={isVideoOn}
//           isChatOpen={isChatOpen}
//           handleAudioToggle={handleAudioToggle}
//           handleVideoToggle={handleVideoToggle}
//           setIsChatOpen={setIsChatOpen}
//           navigate={navigate}
//         />
//       </div>

//       {/* Chat Sidebar */}
//       {isChatOpen && (
//         <VideoCallChat
//           messages={messages}
//           setIsChatOpen={setIsChatOpen}
//           user={user}
//           sendMessage={sendMessage}
//         />
//       )}
//     </div>
//   );
// };

// export default VideoCall;