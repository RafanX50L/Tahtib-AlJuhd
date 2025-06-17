 

import type React from "react"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"

interface Message {
  id: string
  username: string
  message: string
  timestamp: string
}

interface VideoCallChatProps {
  messages: Message[]
  setIsChatOpen: (isOpen: boolean) => void
  user: any
  sendMessage: (message: string) => void
}

const VideoCallChat = ({ messages, setIsChatOpen, user, sendMessage }: VideoCallChatProps) => {
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      sendMessage(newMessage)
      setNewMessage("")
    }
  }

  return (
    <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col shadow-lg">
      <div className="p-4 flex items-center justify-between border-b border-slate-700 bg-gradient-to-r from-slate-800 to-blue-900">
        <h2 className="font-bold">Chat</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-4">
            <div className="flex justify-between items-center">
              <div className="font-bold text-sm text-blue-400">{message.username}</div>
              <div className="text-xs text-slate-400">{message.timestamp}</div>
            </div>
            <div
              className={`text-sm mt-1 p-3 rounded-md ${
                message.username === user?.name || message.username === "You"
                  ? "bg-blue-800 ml-4 rounded-tr-none"
                  : message.username === "System"
                    ? "bg-slate-700 text-center italic"
                    : "bg-slate-700 mr-4 rounded-tl-none"
              }`}
            >
              {message.message}
            </div>
          </div>
        ))}
      </ScrollArea>

      <Separator />

      <form onSubmit={handleSendMessage} className="p-4 flex gap-2">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-slate-700 border-slate-600"
        />
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Send
        </Button>
      </form>
    </div>
  )
}

export default VideoCallChat

