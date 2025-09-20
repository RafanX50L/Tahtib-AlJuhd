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
    <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900 flex-shrink-0">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-end gap-3 sm:gap-4">
              <div className="flex-1">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => onMessageChange(e.target.value)}
                  onKeyPress={onKeyPress}
                  placeholder="Ask me anything..."
                  className="min-h-[48px] sm:min-h-[60px] max-h-28 bg-transparent border-0 text-white text-sm"
                  rows={2}
                />
              </div>
              <div className="flex gap-2 pb-1 sm:pb-2">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-violet-400 p-1 sm:p-2">
                  <Paperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-violet-400 p-1 sm:p-2">
                  <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  onClick={onSend}
                  disabled={!message.trim() || isTyping}
                  className="bg-violet-600 hover:bg-violet-700 p-1 sm:p-2"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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