// Availability.jsx
import { useCallback } from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Clock } from 'lucide-react';
import { TrainerFormData } from '@/pages/trainer/TSubmittingDetails';

interface AvailabilityProps {
  control: Control<TrainerFormData>;
  watch: UseFormWatch<TrainerFormData>;
  setValue: UseFormSetValue<TrainerFormData>;
  errors: FieldErrors<TrainerFormData>;
}

const Availability: React.FC<AvailabilityProps> = ({ control, watch, setValue, errors }) => {
  const addWeeklySlot = useCallback(() => {
    setValue('weeklySlots', [...watch('weeklySlots'), { day: 'Monday', startTime: '', endTime: '' }]);
  }, [watch, setValue]);

  const removeWeeklySlot = useCallback(
    (index: number) => {
      setValue('weeklySlots', watch('weeklySlots').filter((_, i) => i !== index));
    },
    [watch, setValue],
  );

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-[#b0b0b0] mb-4  flex items-center gap-2">
          <Clock className="w-4 h-4" /> Weekly Availability *
        </Label>
        <div className="space-y-4">
          {watch('weeklySlots').map((_, index) => (
            <div key={`slot-${index}`} className="bg-[#1a1a1a] border border-[#2c2c2c] p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[#f1f1f1] font-medium">Time Slot {index + 1}</h4>
                {watch('weeklySlots').length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWeeklySlot(index)}
                    className="text-[#ef4444] hover:text-[#ef4444] hover:bg-[#ef4444]/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`weeklySlots[${index}].day`} className="text-[#b0b0b0]">
                    Day *
                  </Label>
                  <Controller
                    name={`weeklySlots.${index}.day`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="bg-[#121212] border-[#2c2c2c] text-[#f1f1f1] focus:border-[#6366f1] focus:ring-[#6366f1]/20">
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1e1e1e] border-[#2c2c2c] text-[#f1f1f1]">
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                            <SelectItem value="Thursday">Thursday</SelectItem>
                            <SelectItem value="Friday">Friday</SelectItem>
                            <SelectItem value="Saturday">Saturday</SelectItem>
                            <SelectItem value="Sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.weeklySlots?.[index]?.day && (
                          <p className="text-[#ef4444] text-sm mt-1">
                            {errors.weeklySlots[index].day.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor={`weeklySlots[${index}].startTime`} className="text-[#b0b0b0]">
                    Start Time *
                  </Label>
                  <Controller
                    name={`weeklySlots.${index}.startTime`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          id={`weeklySlots[${index}].startTime`}
                          type="time"
                          className="bg-[#121212] border-[#2c2c2c] text-[#f1f1f1] focus:border-[#6366f1] focus:ring-[#6366f1]/20"
                        />
                        {errors.weeklySlots?.[index]?.startTime && (
                          <p className="text-[#ef4444] text-sm mt-1">
                            {errors.weeklySlots[index].startTime.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor={`weeklySlots[${index}].endTime`} className="text-[#b0b0b0]">
                    End Time *
                  </Label>
                  <Controller
                    name={`weeklySlots.${index}.endTime`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          id={`weeklySlots[${index}].endTime`}
                          type="time"
                          className="bg-[#121212] border-[#2c2c2c] text-[#f1f1f1] focus:border-[#6366f1] focus:ring-[#6366f1]/20"
                        />
                        {errors.weeklySlots?.[index]?.endTime && (
                          <p className="text-[#ef4444] text-sm mt-1">
                            {errors.weeklySlots[index].endTime.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addWeeklySlot}
            className="bg-[#1a1a1a] border-[#2c2c2c] text-[#6366f1] hover:bg-[#6366f1]/10 hover:text-[#6366f1] border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Time Slot
          </Button>
        </div>
        {errors.weeklySlots && (
          <p className="text-[#ef4444] text-sm mt-1">{errors.weeklySlots.message}</p>
        )}
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