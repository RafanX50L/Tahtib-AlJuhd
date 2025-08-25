// Availability.jsx
import { useCallback, useState } from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, X, Clock, DollarSign } from 'lucide-react';
import { TrainerFormData } from '@/pages/trainer/TSubmittingDetails';

interface AvailabilityProps {
  control: Control<TrainerFormData>;
  watch: UseFormWatch<TrainerFormData>;
  setValue: UseFormSetValue<TrainerFormData>;
  errors: FieldErrors<TrainerFormData>;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Availability: React.FC<AvailabilityProps> = ({ control, watch, setValue, errors }) => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const addTimeSlot = useCallback((day: string) => {
    const currentAvailability = watch('weeklyAvailability') || {};
    const dayAvailability = currentAvailability[day] || { isAvailable: false, timeSlots: [] };
    
    const newTimeSlot = {
      startTime: '09:00',
      endTime: '10:00',
      duration: 60,
      price: 50
    };

    const updatedDayAvailability = {
      ...dayAvailability,
      timeSlots: [...dayAvailability.timeSlots, newTimeSlot]
    };

    setValue('weeklyAvailability', {
      ...currentAvailability,
      [day]: updatedDayAvailability
    });
  }, [watch, setValue]);

  const removeTimeSlot = useCallback((day: string, index: number) => {
    const currentAvailability = watch('weeklyAvailability') || {};
    const dayAvailability = currentAvailability[day] || { isAvailable: false, timeSlots: [] };
    
    const updatedTimeSlots = dayAvailability.timeSlots.filter((_, i) => i !== index);
    
    setValue('weeklyAvailability', {
      ...currentAvailability,
      [day]: {
        ...dayAvailability,
        timeSlots: updatedTimeSlots
      }
    });
  }, [watch, setValue]);

  const updateTimeSlot = useCallback((day: string, index: number, field: string, value: string | number) => {
    const currentAvailability = watch('weeklyAvailability') || {};
    const dayAvailability = currentAvailability[day] || { isAvailable: false, timeSlots: [] };
    
    const updatedTimeSlots = dayAvailability.timeSlots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    );
    
    setValue('weeklyAvailability', {
      ...currentAvailability,
      [day]: {
        ...dayAvailability,
        timeSlots: updatedTimeSlots
      }
    });
  }, [watch, setValue]);

  const toggleDayAvailability = useCallback((day: string, isAvailable: boolean) => {
    const currentAvailability = watch('weeklyAvailability') || {};
    const dayAvailability = currentAvailability[day] || { isAvailable: false, timeSlots: [] };
    
    setValue('weeklyAvailability', {
      ...currentAvailability,
      [day]: {
        ...dayAvailability,
        isAvailable
      }
    });
  }, [watch, setValue]);

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-[#b0b0b0] mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Weekly Availability *
        </Label>
        
        {/* Day Selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          {DAYS_OF_WEEK.map((day) => (
            <Button
              key={day}
              type="button"
              variant={selectedDay === day ? "default" : "outline"}
              onClick={() => setSelectedDay(day)}
              className="text-sm"
            >
              {day.slice(0, 3)}
            </Button>
          ))}
        </div>

        {/* Selected Day Configuration */}
        <div className="bg-[#1a1a1a] border border-[#2c2c2c] p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#f1f1f1] font-medium">{selectedDay}</h3>
            <div className="flex items-center gap-2">
              <Label htmlFor={`availability-${selectedDay}`} className="text-[#b0b0b0] text-sm">
                Available
              </Label>
              <Switch
                id={`availability-${selectedDay}`}
                checked={watch('weeklyAvailability')?.[selectedDay]?.isAvailable || false}
                onCheckedChange={(checked) => toggleDayAvailability(selectedDay, checked)}
              />
            </div>
          </div>

          {watch('weeklyAvailability')?.[selectedDay]?.isAvailable && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[#f1f1f1] font-medium">Time Slots</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTimeSlot(selectedDay)}
                  className="bg-[#1a1a1a] border-[#2c2c2c] text-[#6366f1] hover:bg-[#6366f1]/10"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Slot
                </Button>
              </div>

              {watch('weeklyAvailability')?.[selectedDay]?.timeSlots?.map((slot, index) => (
                <div key={index} className="bg-[#121212] border border-[#2c2c2c] p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-[#f1f1f1] font-medium">Slot {index + 1}</h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTimeSlot(selectedDay, index)}
                      className="text-[#ef4444] hover:text-[#ef4444] hover:bg-[#ef4444]/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-[#b0b0b0] text-sm">Start Time</Label>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(selectedDay, index, 'startTime', e.target.value)}
                        className="bg-[#1a1a1a] border-[#2c2c2c] text-[#f1f1f1]"
                      />
                    </div>
                    <div>
                      <Label className="text-[#b0b0b0] text-sm">End Time</Label>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateTimeSlot(selectedDay, index, 'endTime', e.target.value)}
                        className="bg-[#1a1a1a] border-[#2c2c2c] text-[#f1f1f1]"
                      />
                    </div>
                    <div>
                      <Label className="text-[#b0b0b0] text-sm">Duration (min)</Label>
                      <Input
                        type="number"
                        value={slot.duration}
                        onChange={(e) => updateTimeSlot(selectedDay, index, 'duration', parseInt(e.target.value))}
                        className="bg-[#1a1a1a] border-[#2c2c2c] text-[#f1f1f1]"
                      />
                    </div>
                    <div>
                      <Label className="text-[#b0b0b0] text-sm flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Price ($)
                      </Label>
                      <Input
                        type="number"
                        value={slot.price}
                        onChange={(e) => updateTimeSlot(selectedDay, index, 'price', parseFloat(e.target.value))}
                        className="bg-[#1a1a1a] border-[#2c2c2c] text-[#f1f1f1]"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {(!watch('weeklyAvailability')?.[selectedDay]?.timeSlots || watch('weeklyAvailability')?.[selectedDay]?.timeSlots.length === 0) && (
                <div className="text-center py-8 text-[#b0b0b0]">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No time slots configured for {selectedDay}</p>
                  <p className="text-sm">Click "Add Slot" to configure availability</p>
                </div>
              )}
            </div>
          )}

          {!watch('weeklyAvailability')?.[selectedDay]?.isAvailable && (
            <div className="text-center py-8 text-[#b0b0b0]">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>{selectedDay} is set as unavailable</p>
              <p className="text-sm">Toggle the switch above to enable this day</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="engagementType" className="text-[#b0b0b0]">Engagement Type *</Label>
        <Controller
          name="engagementType"
          control={control}
          render={({ field }) => (
            <div>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="bg-[#1a1a1a] border-[#2c2c2c] text-[#f1f1f1] focus:border-[#6366f1] focus:ring-[#6366f1]/20">
                  <SelectValue placeholder="Select engagement type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e1e] border-[#2c2c2c] text-[#f1f1f1]">
                  <SelectItem value="full-time">Full-Time</SelectItem>
                  <SelectItem value="part-time">Part-Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
              {errors.engagementType && (
                <p className="text-[#ef4444] text-sm mt-1">{errors.engagementType.message}</p>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Availability;