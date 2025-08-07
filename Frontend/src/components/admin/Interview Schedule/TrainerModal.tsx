import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Check } from 'lucide-react';
import { Trainer } from '@/types/trainer';

interface TrainerModalProps {
  show: boolean;
  onClose: () => void;
  trainer: Trainer | null;
  onSave: (trainerId: string) => void;
}

const TrainerModal: React.FC<TrainerModalProps> = ({ show, onClose, trainer, onSave }) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white sm:max-w-md max-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-medium">Update Trainer Details</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-400 mb-1">Trainer Name</label>
            <Input
              type="text"
              value={trainer?.name || ''}
              readOnly
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-400 mb-1">Weekly Salary ($)</label>
            <Input
              type="number"
              placeholder="Enter weekly salary (500-2500)"
              min="500"
              max="2500"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-400 mb-1">Experience (Years)</label>
            <Input
              type="number"
              placeholder="Years of experience"
              min="0"
              defaultValue={trainer?.professionalSummary?.yearsOfExperience || ''}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-400 mb-1">Specializations</label>
            <Input
              type="text"
              placeholder="E.g., CrossFit, Weight Training"
              defaultValue={trainer?.professionalSummary?.specializations?.join(', ') || ''}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-400 mb-1">Coaching Type</label>
            <Select defaultValue={trainer?.professionalSummary?.coachingType[0] || ''}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select coaching type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="One-on-One">One-on-One</SelectItem>
                <SelectItem value="Group">Group</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-400 mb-1">Interview Results</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Communication (1-5)</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  defaultValue={trainer?.interview?.result?.communicationSkills || ''}
                  className="bg-gray-700 border-gray-600 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Technical (1-5)</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  defaultValue={trainer?.interview?.result?.technicalKnowledge || ''}
                  className="bg-gray-700 border-gray-600 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Coaching Style (1-5)</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  defaultValue={trainer?.interview?.result?.coachingStyle || ''}
                  className="bg-gray-700 border-gray-600 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Confidence (1-5)</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  defaultValue={trainer?.interview?.result?.confidencePresence || ''}
                  className="bg-gray-700 border-gray-600 text-white text-sm"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-400 mb-1">Notes</label>
            <Textarea
              placeholder="Add evaluation notes"
              defaultValue={trainer?.interview?.result?.notes || ''}
              className="bg-gray-700 border-gray-600 text-white h-20 resize-none"
            />
          </div>
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex space-x-3">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-500"
                onClick={() => trainer?.id && onSave(trainer.id)}
              >
                <Check className="h-4 w-4 mr-2" /> Save & Hire
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

export default TrainerModal;