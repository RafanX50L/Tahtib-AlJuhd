import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { TrainerService } from '@/services/implementation/trainerServices';

interface Slot {
  day: string;
  startTime: string;
  endTime: string;
}

export const SetAvailabilityPage = () => {
  const { user } = useSelector((state:RootState)=>state.auth);
  const [slots, setSlots] = useState<Slot[]>([{ day: 'Monday', startTime: '09:00', endTime: '10:00' }]);
  const [existingSlots, setExistingSlots] = useState<Slot[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      api.get(`/availability?trainerId=${user._id}`)
        .then(res => setExistingSlots(res.data.slots || []))
        .catch(err => setError(err.response?.data?.error || 'Error fetching existing availability'));
    }
  }, [user]);

  const handleAddSlot = () => {
    setSlots([...slots, { day: 'Monday', startTime: '09:00', endTime: '10:00' }]);
  };

  const handleSlotChange = (index: number, field: keyof Slot, value: string) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  const handleRemoveSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    //   await api.post('/availability', { trainerId: user!._id, slots });
      await TrainerService.addSlot(slots,user?._id as string);
      // Refresh existing slots after submission
      const res = await api.get(`/availability?trainerId=${user!._id}`);
      setExistingSlots(res.data.slots || []);
      setSlots([{ day: 'Monday', startTime: '09:00', endTime: '10:00' }]);
      setError('');
      alert('Availability set successfully');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error setting availability');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Set Availability</h1>
      {error && <p className="text-destructive mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Slots Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create/Update Time Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {slots.map((slot, index) => (
                <div key={index} className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`day-${index}`}>Day</Label>
                    <Select
                      value={slot.day}
                      onValueChange={(value) => handleSlotChange(index, 'day', value)}
                    >
                      <SelectTrigger id={`day-${index}`}>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`startTime-${index}`}>Start Time</Label>
                    <Input
                      id={`startTime-${index}`}
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`endTime-${index}`}>End Time</Label>
                    <Input
                      id={`endTime-${index}`}
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)}
                      required
                    />
                  </div>
                  {slots.length > 1 && (
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveSlot(index)}
                        className="h-10"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex space-x-4">
                <Button type="button" variant="outline" onClick={handleAddSlot} className="w-full md:w-auto">
                  Add Slot
                </Button>
                <Button type="submit" className="w-full md:w-auto">Set Availability</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        {/* Existing Slots List */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Slots</CardTitle>
          </CardHeader>
          <CardContent>
            {existingSlots.length === 0 ? (
              <p className="text-muted-foreground">No existing slots set yet.</p>
            ) : (
              <div className="space-y-4">
                {existingSlots.map((slot, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <p><strong>Day:</strong> {slot.day}</p>
                      <p><strong>Start Time:</strong> {slot.startTime}</p>
                      <p><strong>End Time:</strong> {slot.endTime}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};