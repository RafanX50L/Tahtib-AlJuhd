import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Mic, Video } from 'lucide-react';

interface SessionModalProps {
  show: boolean;
  onClose: () => void;
  session: { trainer: string; time: string; date: Date } | null;
}

const SessionModal: React.FC<SessionModalProps> = ({ show, onClose, session }) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white sm:max-w-md max-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-medium">Interview Details</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-500 bg-opacity-20 rounded-full mr-4">
              <Mic className="h-8 w-8 text-indigo-400" />
            </div>
            <div>
              <p className="text-lg lg:text-xl font-bold text-white">Trainer Interview</p>
              <p className="text-xs lg:text-sm text-gray-400">
                {session?.date.toLocaleDateString()} - {session?.time}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-400">Trainer Applicant</p>
            <div className="flex items-center mt-1">
              <img src="/api/placeholder/40/40" alt="Trainer" className="rounded-full w-8 h-8 mr-2" />
              <p className="text-white text-xs lg:text-sm">{session?.trainer}</p>
            </div>
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-400">Admin</p>
            <div className="flex items-center mt-1">
              <img src="/api/placeholder/40/40" alt="Admin" className="rounded-full w-8 h-8 mr-2" />
              <p className="text-white text-xs lg:text-sm">Admin User</p>
            </div>
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-400">Location</p>
            <p className="text-white text-xs lg:text-sm">Virtual - Zoom Meeting</p>
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-400">Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200">
              Scheduled
            </span>
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-400">Notes</p>
            <p className="text-white text-xs lg:text-sm">Evaluate trainer's experience and client management skills.</p>
          </div>
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex space-x-3">
              <Button className="flex-1 bg-red-600 hover:bg-red-500">
                <X className="h-4 w-4 mr-2" /> Cancel Interview
              </Button>
              <Button disabled className="flex-1 bg-gray-600 opacity-50">
                <Video className="h-4 w-4 mr-2" /> Join Interview
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionModal;