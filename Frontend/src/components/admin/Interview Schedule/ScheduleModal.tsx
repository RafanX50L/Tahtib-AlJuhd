import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Calendar } from 'lucide-react';
import { Trainer } from '@/types/trainer';

interface ScheduleModalProps {
  show: boolean;
  onClose: () => void;
  trainer: Trainer | null;
  onSchedule: (trainerId: string, date: string, time: string) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ show, onClose, trainer, onSchedule }) => {
  const [date, setDate] = React.useState<string>('');
  const [time, setTime] = React.useState<string>('');

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white sm:max-w-md max-w-full">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-medium">Schedule Interview</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-400 mb-1">Trainer</label>
            <Input
              type="text"
              value={trainer?.name || ''}
              readOnly
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-400 mb-1">Select Date</label>
            <Select value={date} onValueChange={setDate}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select a date" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="2025-04-13">April 13, 2025</SelectItem>
                <SelectItem value="2025-04-14">April 14, 2025</SelectItem>
                <SelectItem value="2025-04-15">April 15, 2025</SelectItem>
                <SelectItem value="2025-04-16">April 16, 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-400 mb-1">Select Time</label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="09:00">09:00</SelectItem>
                <SelectItem value="11:00">11:00</SelectItem>
                <SelectItem value="14:00">14:00</SelectItem>
                <SelectItem value="16:00">16:00</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex space-x-3">
              <Button
                className="flex-1 bg-indigo-600 hover:bg-indigo-500"
                onClick={() => {
                  if (trainer?.id && date && time) {
                    onSchedule(trainer.id, date, time);
                  }
                }}
                disabled={!date || !time}
              >
                <Calendar className="h-4 w-4 mr-2" /> Schedule
              </Button>
              <Button className="flex-1 bg-gray-700 hover:bg-gray-600" onClick={onClose}>
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;