import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Plus, 
  X, 
  Calendar,
  Settings,
  Save,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { TrainerService } from '@/services/implementation/trainerServices';

interface TimeSlot {
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  price: number;
}

interface DaySchedule {
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

const WeeklySchedule = () => {
  const [schedule, setSchedule] = useState<WeeklySchedule>({
    monday: { isAvailable: false, timeSlots: [] },
    tuesday: { isAvailable: false, timeSlots: [] },
    wednesday: { isAvailable: false, timeSlots: [] },
    thursday: { isAvailable: false, timeSlots: [] },
    friday: { isAvailable: false, timeSlots: [] },
    saturday: { isAvailable: false, timeSlots: [] },
    sunday: { isAvailable: false, timeSlots: [] }
  });

  const [timezone, setTimezone] = useState('UTC');
  const [isLoading, setIsLoading] = useState(false);

  const days = [
    { key: 'monday', label: 'Monday', short: 'Mon' },
    { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { key: 'thursday', label: 'Thursday', short: 'Thu' },
    { key: 'friday', label: 'Friday', short: 'Fri' },
    { key: 'saturday', label: 'Saturday', short: 'Sat' },
    { key: 'sunday', label: 'Sunday', short: 'Sun' }
  ];

  const durationOptions = [
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 45, label: '45 min' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ];

  const timeOptions = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
    '22:00', '22:30', '23:00', '23:30'
  ];

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await TrainerService.getTrainerSchedule();
        if (data) {
          if (data.weeklySchedule) {
            setSchedule(data.weeklySchedule);
          }
          if (data.timezone) {
            setTimezone(data.timezone);
          }
        }
      } catch (_) {
        // toast already handled in service
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const toggleDayAvailability = (dayKey: keyof WeeklySchedule) => {
    setSchedule(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        isAvailable: !prev[dayKey].isAvailable,
        timeSlots: !prev[dayKey].isAvailable ? [] : prev[dayKey].timeSlots
      }
    }));
  };

  const addTimeSlot = (dayKey: keyof WeeklySchedule) => {
    const newSlot: TimeSlot = {
      startTime: '09:00',
      endTime: '10:00',
      duration: 60,
      price: 50
    };

    setSchedule(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        timeSlots: [...prev[dayKey].timeSlots, newSlot]
      }
    }));
  };

  const updateTimeSlot = (
    dayKey: keyof WeeklySchedule,
    slotIndex: number,
    field: keyof TimeSlot,
    value: string | number
  ) => {
    setSchedule(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        timeSlots: prev[dayKey].timeSlots.map((slot, index) =>
          index === slotIndex ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const removeTimeSlot = (dayKey: keyof WeeklySchedule, slotIndex: number) => {
    setSchedule(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        timeSlots: prev[dayKey].timeSlots.filter((_, index) => index !== slotIndex)
      }
    }));
  };

  const copySchedule = (fromDay: keyof WeeklySchedule, toDay: keyof WeeklySchedule) => {
    setSchedule(prev => ({
      ...prev,
      [toDay]: {
        ...prev[fromDay]
      }
    }));
    toast.success(`Schedule copied from ${days.find(d => d.key === fromDay)?.label} to ${days.find(d => d.key === toDay)?.label}`);
  };

  const saveSchedule = async () => {
    setIsLoading(true);
    try {
      await TrainerService.updateTrainerSchedule({
        weeklySchedule: schedule,
        timezone
      });
    } catch (_) {
      // toast handled in service
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setSchedule({
      monday: { isAvailable: false, timeSlots: [] },
      tuesday: { isAvailable: false, timeSlots: [] },
      wednesday: { isAvailable: false, timeSlots: [] },
      thursday: { isAvailable: false, timeSlots: [] },
      friday: { isAvailable: false, timeSlots: [] },
      saturday: { isAvailable: false, timeSlots: [] },
      sunday: { isAvailable: false, timeSlots: [] }
    });
    toast.success('Schedule cleared');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Weekly Availability</h2>
          <p className="text-gray-400">Set your available time slots for client bookings</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
          <Button onClick={clearAll} variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          <Button onClick={saveSchedule} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Schedule
          </Button>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {days.map((day) => {
          const dayKey = day.key as keyof WeeklySchedule;
          const daySchedule = schedule[dayKey];
          
          return (
            <Card key={day.key} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">{day.short}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={daySchedule.isAvailable}
                      onChange={() => toggleDayAvailability(dayKey)}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-400">Available</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {daySchedule.isAvailable ? (
                  <>
                    <div className="space-y-3">
                      {daySchedule.timeSlots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="p-3 bg-gray-700 rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-300">Time Slot {slotIndex + 1}</span>
                            <Button
                              onClick={() => removeTimeSlot(dayKey, slotIndex)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Start Time</label>
                              <select
                                value={slot.startTime}
                                onChange={(e) => updateTimeSlot(dayKey, slotIndex, 'startTime', e.target.value)}
                                className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                              >
                                {timeOptions.map(time => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">End Time</label>
                              <select
                                value={slot.endTime}
                                onChange={(e) => updateTimeSlot(dayKey, slotIndex, 'endTime', e.target.value)}
                                className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                              >
                                {timeOptions.map(time => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Duration</label>
                              <select
                                value={slot.duration}
                                onChange={(e) => updateTimeSlot(dayKey, slotIndex, 'duration', parseInt(e.target.value))}
                                className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                              >
                                {durationOptions.map(option => (
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Price ($)</label>
                              <Input
                                type="number"
                                value={slot.price}
                                onChange={(e) => updateTimeSlot(dayKey, slotIndex, 'price', parseFloat(e.target.value) || 0)}
                                className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => addTimeSlot(dayKey)}
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Time Slot
                    </Button>
                    
                    {/* Copy to other days */}
                    <div className="pt-2 border-t border-gray-700">
                      <p className="text-xs text-gray-400 mb-2">Copy to:</p>
                      <div className="flex flex-wrap gap-1">
                        {days
                          .filter(d => d.key !== dayKey)
                          .map(otherDay => (
                            <Button
                              key={otherDay.key}
                              onClick={() => copySchedule(dayKey, otherDay.key as keyof WeeklySchedule)}
                              variant="ghost"
                              size="sm"
                              className="text-xs px-2 py-1 h-auto bg-gray-700 hover:bg-gray-600"
                            >
                              {otherDay.short}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Not available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Schedule Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">
                {Object.values(schedule).filter(day => day.isAvailable).length}
              </p>
              <p className="text-sm text-gray-400">Available Days</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                {Object.values(schedule).reduce((total, day) => total + day.timeSlots.length, 0)}
              </p>
              <p className="text-sm text-gray-400">Total Time Slots</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">
                ${Object.values(schedule)
                  .flatMap(day => day.timeSlots)
                  .reduce((total, slot) => total + slot.price, 0)
                  .toFixed(2)}
              </p>
              <p className="text-sm text-gray-400">Total Revenue Potential</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">
                {timezone}
              </p>
              <p className="text-sm text-gray-400">Timezone</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklySchedule;
