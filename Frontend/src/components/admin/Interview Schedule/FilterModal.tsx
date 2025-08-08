import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, RefreshCw } from 'lucide-react';
import { Trainer, Filters } from '@/types/trainer';

interface FilterModalProps {
  show: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  trainers: Trainer[];
}

const FilterModal: React.FC<FilterModalProps> = ({ show, onClose, filters, setFilters, trainers }) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white sm:max-w-md max-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-medium">Filter Interviews</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-400 mb-1">Date Range</label>
            <div className="flex space-x-3">
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                className="flex-1 bg-gray-700 border-gray-600 text-white"
              />
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                className="flex-1 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-400 mb-1">Trainer</label>
            <Select
              value={filters.trainer}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, trainer: value }))}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="All Trainers" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="">All Trainers</SelectItem>
                {trainers.map((trainer) => (
                  <SelectItem key={trainer.id} value={trainer.name}>
                    {trainer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-400 mb-1">Status</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <Checkbox
                  id="status-scheduled"
                  checked={filters.statuses.scheduled}
                  onCheckedChange={(checked) =>
                    setFilters((prev) => ({
                      ...prev,
                      statuses: { ...prev.statuses, scheduled: checked as boolean },
                    }))
                  }
                />
                <label htmlFor="status-scheduled" className="ml-2 text-white text-xs lg:text-sm">
                  Scheduled
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="status-pending"
                  checked={filters.statuses.pending}
                  onCheckedChange={(checked) =>
                    setFilters((prev) => ({
                      ...prev,
                      statuses: { ...prev.statuses, pending: checked as boolean },
                    }))
                  }
                />
                <label htmlFor="status-pending" className="ml-2 text-white text-xs lg:text-sm">
                  Not Scheduled
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="status-completed"
                  checked={filters.statuses.completed}
                  onCheckedChange={(checked) =>
                    setFilters((prev) => ({
                      ...prev,
                      statuses: { ...prev.statuses, completed: checked as boolean },
                    }))
                  }
                />
                <label htmlFor="status-completed" className="ml-2 text-white text-xs lg:text-sm">
                  Completed
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="status-canceled"
                  checked={filters.statuses.canceled}
                  onCheckedChange={(checked) =>
                    setFilters((prev) => ({
                      ...prev,
                      statuses: { ...prev.statuses, canceled: checked as boolean },
                    }))
                  }
                />
                <label htmlFor="status-canceled" className="ml-2 text-white text-xs lg:text-sm">
                  Canceled
                </label>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex space-x-3">
              <Button
                className="flex-1 bg-indigo-600 hover:bg-indigo-500"
                onClick={onClose} // Apply filters logic can be added here
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586a1 1 0 01-1.707.707l-2-2a1 1 0 01-.293-.707v-2.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Apply Filters
              </Button>
              <Button
                className="flex-1 bg-gray-700 hover:bg-gray-600"
                onClick={() => {
                  setFilters({
                    startDate: '',
                    endDate: '',
                    trainer: '',
                    statuses: {
                      scheduled: false,
                      pending: false,
                      completed: false,
                      canceled: false,
                    },
                  });
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Reset
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;