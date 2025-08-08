import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Paperclip, Mic } from 'lucide-react';

interface MessageInputProps {
  message: string;
  isTyping: boolean;
  onMessageChange: (message: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  isTyping,
  onMessageChange,
  onSend,
  onKeyPress,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="p-6 border-t border-slate-800 bg-slate-900 flex-shrink-0">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => onMessageChange(e.target.value)}
                  onKeyPress={onKeyPress}
                  placeholder="Ask me anything..."
                  className="min-h-[60px] max-h-32 bg-transparent border-0 text-white"
                  rows={2}
                />
              </div>
              <div className="flex gap-2 pb-2">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-violet-400">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-violet-400">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button
                  onClick={onSend}
                  disabled={!message.trim() || isTyping}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessageInput;