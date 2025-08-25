import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, DollarSign, Plus, X, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface TimeSlot {
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
}

interface DaySchedule {
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

interface WeeklySchedule {
  [key: string]: DaySchedule;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WeeklyScheduleManager: React.FC = () => {
  const [schedule, setSchedule] = useState<WeeklySchedule>({});
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Initialize schedule if empty
    if (Object.keys(schedule).length === 0) {
      const initialSchedule: WeeklySchedule = {};
      DAYS_OF_WEEK.forEach(day => {
        initialSchedule[day] = {
          isAvailable: false,
          timeSlots: []
        };
      });
      setSchedule(initialSchedule);
    }
  }, [schedule]);

  const toggleDayAvailability = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day].isAvailable
      }
    }));
  };

  const addTimeSlot = (day: string) => {
    const newSlot: TimeSlot = {
      startTime: '09:00',
      endTime: '10:00',
      duration: 60,
      price: 50
    };

    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [...prev[day].timeSlots, newSlot]
      }
    }));
  };

  const removeTimeSlot = (day: string, index: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((_, i) => i !== index)
      }
    }));
  };

  const updateTimeSlot = (day: string, index: number, field: keyof TimeSlot, value: string | number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, i) => 
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const saveSchedule = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would call your actual API
      // const response = await trainerScheduleService.updateSchedule(schedule);
      
      toast.success('Schedule saved successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to save schedule');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSchedule = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Here you would call your actual API
      // const response = await trainerScheduleService.getSchedule();
      // setSchedule(response.data);
      
      toast.success('Schedule loaded successfully!');
    } catch (error) {
      toast.error('Failed to load schedule');
    } finally {
      setIsLoading(false);
    }
  };

  const getDayStatus = (day: string) => {
    const daySchedule = schedule[day];
    if (!daySchedule?.isAvailable) return 'unavailable';
    if (daySchedule.timeSlots.length === 0) return 'no-slots';
    return 'available';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'no-slots': return 'bg-yellow-500';
      case 'unavailable': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Weekly Schedule</h2>
          <p className="text-gray-400">Manage your availability for client bookings</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadSchedule}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Load
          </Button>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          {isEditing && (
            <Button
              onClick={saveSchedule}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          )}
        </div>
      </div>

      {/* Day Selection */}
      <div className="grid grid-cols-7 gap-2">
        {DAYS_OF_WEEK.map((day) => {
          const status = getDayStatus(day);
          return (
            <Card
              key={day}
              className={`cursor-pointer transition-all ${
                selectedDay === day ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedDay(day)}
            >
              <CardContent className="p-3 text-center">
                <div className="text-sm font-medium text-white mb-1">
                  {day.slice(0, 3)}
                </div>
                <div className={`w-2 h-2 rounded-full mx-auto ${getStatusColor(status)}`} />
                <div className="text-xs text-gray-400 mt-1">
                  {schedule[day]?.timeSlots?.length || 0} slots
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Day Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">{selectedDay}</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor={`availability-${selectedDay}`} className="text-gray-300 text-sm">
                Available
              </Label>
              <Switch
                id={`availability-${selectedDay}`}
                checked={schedule[selectedDay]?.isAvailable || false}
                onCheckedChange={() => toggleDayAvailability(selectedDay)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {schedule[selectedDay]?.isAvailable ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">Time Slots</h4>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeSlot(selectedDay)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Slot
                  </Button>
                )}
              </div>

              {schedule[selectedDay]?.timeSlots?.map((slot, index) => (
                <div key={index} className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-white font-medium">Slot {index + 1}</h5>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeSlot(selectedDay, index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-gray-300 text-sm">Start Time</Label>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(selectedDay, index, 'startTime', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">End Time</Label>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateTimeSlot(selectedDay, index, 'endTime', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm">Duration (min)</Label>
                      <Input
                        type="number"
                        value={slot.duration}
                        onChange={(e) => updateTimeSlot(selectedDay, index, 'duration', parseInt(e.target.value))}
                        disabled={!isEditing}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-sm flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Price ($)
                      </Label>
                      <Input
                        type="number"
                        value={slot.price}
                        onChange={(e) => updateTimeSlot(selectedDay, index, 'price', parseFloat(e.target.value))}
                        disabled={!isEditing}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {(!schedule[selectedDay]?.timeSlots || schedule[selectedDay]?.timeSlots.length === 0) && (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No time slots configured for {selectedDay}</p>
                  {isEditing && (
                    <p className="text-sm">Click "Add Slot" to configure availability</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>{selectedDay} is set as unavailable</p>
              {isEditing && (
                <p className="text-sm">Toggle the switch above to enable this day</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Schedule Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {DAYS_OF_WEEK.filter(day => schedule[day]?.isAvailable).length}
              </div>
              <div className="text-sm text-gray-400">Available Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {DAYS_OF_WEEK.reduce((total, day) => total + (schedule[day]?.timeSlots?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-400">Total Slots</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                ${DAYS_OF_WEEK.reduce((total, day) => {
                  const dayTotal = schedule[day]?.timeSlots?.reduce((sum, slot) => sum + slot.price, 0) || 0;
                  return total + dayTotal;
                }, 0)}
              </div>
              <div className="text-sm text-gray-400">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {DAYS_OF_WEEK.reduce((total, day) => {
                  const dayHours = schedule[day]?.timeSlots?.reduce((sum, slot) => sum + slot.duration, 0) || 0;
                  return total + dayHours;
                }, 0) / 60}
              </div>
              <div className="text-sm text-gray-400">Total Hours</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyScheduleManager;
