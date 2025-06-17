"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Peer from "simple-peer"
import { chatEnum } from "@/lib/chat-enum"
import { toast } from "sonner"
import { format } from "date-fns"
import type { Socket } from "socket.io-client"

export const usePeerConnections = (streamRef: any, user: any, meetId: any, socket: Socket) => {
  const [remoteVideoEnabled, setRemoteVideoEnabled] = useState(true)
  const [remoteAudioEnabled, setRemoteAudioEnabled] = useState(true)
  const remoteVideosRef = useRef<HTMLVideoElement | null>(null)
  const peersRef = useRef<{ [key: string]: any }>({})
  const roomIdRef = useRef(meetId)
  const [participants, setParticipants] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("streamRef", streamRef, "\n", "user", user, "\n", "meetId", "\n", meetId, "socket", socket)
  }, [streamRef, user, meetId])

  const notifyVideoStateChange = useCallback(
    (enabled: boolean) => {
      if (!socket) return

      socket.emit(chatEnum.videoState, {
        username: user?.name || "You",
        enabled: enabled,
      })
    },
    [socket, user?.name],
  )

  const notifyAudioStateChange = useCallback(
    (enabled: boolean) => {
      if (!socket) return

      socket.emit(chatEnum.audioState, {
        username: user?.name || "You",
        enabled: enabled,
      })
    },
    [socket, user?.name],
  )

  const sendMessage = useCallback(
    (messageText: string) => {
      if (!socket || !user) return

      const newMessage = {
        id: Date.now().toString(),
        username: user?.name || "You",
        message: messageText,
        timestamp: format(new Date(), "HH:mm"),
      }

      setMessages((prev) => [...prev, newMessage])

      socket.emit(chatEnum.message, {
        message: messageText,
        username: user?.name || "You",
        roomId: roomIdRef.current,
      })
    },
    [socket, user],
  )

  const createPeer = useCallback(
    (to: string, initiator: boolean, stream: any) => {
      console.log(`🔄 Attempting to create peer with ${to}, initiator: ${initiator}`)

      if (!window.RTCPeerConnection) {
        console.error("❌ WebRTC is not supported in this environment")
        return null
      }

      if (!socket) {
        console.error("❌ Socket is not available")
        return null
      }

      if (!stream?.current) {
        console.error("❌ Stream is not available:", stream)
        return null
      }

      if (!user?.email || !user?.name) {
        console.error("❌ User data is incomplete:", user)
        return null
      }

      try {
        console.log(`✅ Creating peer with stream:`, stream.current)
        console.log(`📊 Stream tracks:`, stream.current.getTracks())

        const peer = new Peer({
          initiator: initiator,
          trickle: false,
          stream: stream.current,
          config: {
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
          },
        })

        console.log(`🎯 Peer created for ${to}, waiting for signal...`)

        peer.on("signal", (signal) => {
          console.log(`📡 Signal generated for ${to}:`, signal.type || "unknown")
          console.log(`📤 Emitting signal to backend for ${to}`)

          socket.emit(chatEnum.signal, {
            to,
            from: socket.id,
            signal,
            email: user.email,
            username: user.name,
          })
        })

        peer.on("connect", () => {
          console.log(`🔗 Peer connected with ${to}`)
        })

        peer.on("stream", (remoteStream) => {
          console.log(`📹 Receiving remote stream from ${to}`)
          console.log(`📊 Remote stream tracks:`, remoteStream.getTracks())

          if (remoteVideosRef.current) {
            remoteVideosRef.current.srcObject = remoteStream
            console.log(`✅ Remote stream attached to video element`)
          } else {
            console.warn(`⚠️ No video element available for remote stream`)
          }
        })

        peer.on("error", (err) => {
          console.error(`❌ Peer error with ${to} (${initiator ? "initiator" : "receiver"}):`, err)
          // Clean up failed peer
          if (peersRef.current[to]) {
            delete peersRef.current[to]
          }
        })

        peer.on("close", () => {
          console.log(`🔌 Peer connection with ${to} closed`)
          delete peersRef.current[to]
        })

        // Store the peer connection immediately
        peersRef.current[to] = peer
        console.log(`💾 Peer stored for ${to}`)

        return peer
      } catch (error) {
        console.error(`💥 Failed to create Peer for ${to}:`, error)
        return null
      }
    },
    [socket, user],
  )

  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized")
      return
    }
    if (!streamRef || !user) {
      console.error("Missing streamRef or user")
      return
    }

    roomIdRef.current = meetId
    socket.emit(chatEnum.joinmeet, roomIdRef.current, user.email, user.name)

    socket.on(chatEnum.joined, ({ id, room }) => {
      console.log(`Joined room: ${room?.roomId} with socket ID: ${id}`)

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          username: "System",
          message: "You joined the meeting",
          timestamp: format(new Date(), "HH:mm"),
        },
      ])
    })

    socket.on(chatEnum.userConnected, ({ email, id, username }) => {
      console.log(`👤 New user connected: ${username} (${id})`)
      console.log(`📊 Current stream state:`, streamRef.current)
      console.log(`📊 Stream tracks:`, streamRef.current?.getTracks())

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          username: "System",
          message: `${username} joined the meeting`,
          timestamp: format(new Date(), "HH:mm"),
        },
      ])

      // Add delay to ensure stream is ready
      setTimeout(() => {
        if (!peersRef.current[id] && streamRef.current) {
          console.log(`🚀 Creating peer for new user ${username} (${id})`)
          const peer = createPeer(id, true, streamRef)
          if (peer) {
            console.log(`✅ Peer created successfully for ${username}`)
          } else {
            console.error(`❌ Failed to create peer for ${username}`)
          }
        } else {
          console.warn(`⚠️ Cannot create peer: existing=${!!peersRef.current[id]}, stream=${!!streamRef.current}`)
        }
      }, 100)
    })

    socket.on(chatEnum.signal, ({ from, signal }) => {
      console.log(`📡 Received signal from ${from}:`, signal.type || "unknown")

      if (!peersRef.current[from] && streamRef.current) {
        console.log(`🆕 Creating new peer for incoming signal from ${from}`)
        const peer = createPeer(from, false, streamRef)
        if (!peer) {
          console.error(`❌ Failed to create peer for signal from ${from}`)
          return
        }
      }

      try {
        if (peersRef.current[from]) {
          console.log(`📥 Processing signal from ${from}`)
          peersRef.current[from].signal(signal)
          console.log(`✅ Signal processed successfully`)
        } else {
          console.error(`❌ No peer found for ${from}`)
        }
      } catch (error) {
        console.error(`💥 Error handling signal from ${from}:`, error)
      }
    })

    socket.on(chatEnum.error, (message) => {
      setError(message)
    })

    socket.on(chatEnum.videoState, (data) => {
      console.log(`${data.username} turned ${data.enabled ? "ON" : "OFF"} their video`)
      setRemoteVideoEnabled(data.enabled)

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          username: "System",
          message: `${data.username} turned ${data.enabled ? "on" : "off"} their camera`,
          timestamp: format(new Date(), "HH:mm"),
        },
      ])
    })

    socket.on(chatEnum.audioState, (data) => {
      console.log(`${data.username} turned ${data.enabled ? "ON" : "OFF"} their audio`)
      setRemoteAudioEnabled(data.enabled)

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          username: "System",
          message: `${data.username} turned ${data.enabled ? "on" : "off"} their microphone`,
          timestamp: format(new Date(), "HH:mm"),
        },
      ])
    })

    socket.on(chatEnum.message, (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          username: data.username,
          message: data.message,
          timestamp: format(new Date(), "HH:mm"),
        },
      ])
    })

    socket.on("u-disconnect", (userId) => {
      console.log("User disconnected:", userId)

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          username: "System",
          message: `User disconnected`,
          timestamp: format(new Date(), "HH:mm"),
        },
      ])

      toast.success(`User disconnected`)

      // Clean up peer connection
      if (peersRef.current[userId]) {
        peersRef.current[userId].destroy()
        delete peersRef.current[userId]
      }

      if (remoteVideosRef.current) {
        remoteVideosRef.current.srcObject = null
      }
    })

    return () => {
      // Clean up all peer connections
      Object.values(peersRef.current).forEach((peer: any) => {
        if (peer && typeof peer.destroy === "function") {
          peer.destroy()
        }
      })
      peersRef.current = {}

      socket.off(chatEnum.joined)
      socket.off(chatEnum.userConnected)
      socket.off(chatEnum.signal)
      socket.off(chatEnum.error)
      socket.off(chatEnum.videoState)
      socket.off(chatEnum.audioState)
      socket.off(chatEnum.message)
      socket.off("u-disconnect")
    }
  }, [socket, meetId, user, streamRef, createPeer])

  const setVideoRef = (ref: HTMLVideoElement | null) => {
    remoteVideosRef.current = ref
  }

  const disconnectPeer = useCallback((peerId: string) => {
    if (peersRef.current[peerId]) {
      peersRef.current[peerId].destroy()
      delete peersRef.current[peerId]
    }
  }, [])

  const getAllPeers = useCallback(() => {
    return peersRef.current
  }, [])

  return {
    peers: peersRef.current,
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
    disconnectPeer,
    getAllPeers,
  }
}
