import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  DollarSign,
  X,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { TrainerService } from '@/services/implementation/trainerServices';

interface Trainer {
  _id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  hourlyRate: number;
  location: string;
  bio: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
}

interface DaySchedule {
  date: string;
  dayName: string;
  timeSlots: TimeSlot[];
}

const BookingCalendar = ({ trainerId }: { trainerId: string }) => {
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([]);
  const [slotsByDate, setSlotsByDate] = useState<Record<string, TimeSlot[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    // TODO: Replace with real trainer data API if needed
    const mockTrainer: Trainer = {
      _id: trainerId,
      name: 'Trainer',
      rating: 4.8,
      reviewCount: 127,
      specialties: ['Strength', 'Weight Loss'],
      hourlyRate: 75,
      location: '—',
      bio: 'Personal training sessions'
    };

    setTrainer(mockTrainer);
    generateWeek(currentWeek);
    setIsLoading(false);
  }, [trainerId]);

  const generateWeek = (anchor: Date) => {
    const days: DaySchedule[] = [];
    const startOfWeek = new Date(anchor);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateString = date.toISOString().split('T')[0];
      days.push({ date: dateString, dayName, timeSlots: slotsByDate[dateString] || [] });
    }
    setWeeklySchedule(days);
  };

  const fetchSlotsForDate = async (dateISO: string) => {
    try {
      const slots: TimeSlot[] = await TrainerService.getAvailableSlotsByDate(trainerId, dateISO);
      setSlotsByDate(prev => ({ ...prev, [dateISO]: slots || [] }));
      setWeeklySchedule(prev => prev.map(d => d.date === dateISO ? { ...d, timeSlots: slots || [] } : d));
    } catch (_) {
      // toast handled inside service
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    if (direction === 'prev') newWeek.setDate(newWeek.getDate() - 7);
    else newWeek.setDate(newWeek.getDate() + 7);
    setCurrentWeek(newWeek);
    generateWeek(newWeek);
    setSelectedDate('');
    setSelectedSlot(null);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    if (!slotsByDate[date]) fetchSlotsForDate(date);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleBooking = async () => {
    if (!selectedSlot || !selectedDate) {
      toast.error('Please select a date and time slot');
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = async () => {
    try {
      // Payment and booking creation flow to be integrated with backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Booking confirmed!');
      setShowPayment(false);
      setSelectedSlot(null);
      setSelectedDate('');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  if (isLoading || !trainer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trainer Info */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={trainer.avatar} />
              <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-xl font-bold text-white">{trainer.name}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">{trainer.rating}</span>
                  <span className="text-gray-400">({trainer.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{trainer.location}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <DollarSign className="w-4 h-4" />
                  <span>${trainer.hourlyRate}/hour</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {trainer.specialties.map(specialty => (
                  <Badge key={specialty} variant="outline" className="border-gray-600 text-gray-300">
                    {specialty}
                  </Badge>
                ))}
              </div>
              <p className="text-gray-300 text-sm">{trainer.bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <Button onClick={() => navigateWeek('prev')} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous Week
        </Button>
        <h3 className="text-lg font-semibold text-white">
          {currentWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <Button onClick={() => navigateWeek('next')} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          Next Week
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Weekly Calendar */}
      <div className="grid grid-cols-7 gap-4">
        {weeklySchedule.map((day) => (
          <Card 
            key={day.date} 
            className={`bg-gray-800 border-gray-700 cursor-pointer transition-colors ${selectedDate === day.date ? 'border-blue-500 bg-blue-900/20' : 'hover:bg-gray-700'}`}
            onClick={() => handleDateSelect(day.date)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-center text-sm">{day.dayName}</CardTitle>
              <p className="text-gray-400 text-center text-xs">{new Date(day.date).getDate()}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1 min-h-[52px]">
                {(slotsByDate[day.date] || []).slice(0, 3).map((slot, index) => (
                  <div key={index} className="text-xs p-1 rounded bg-green-600/20 text-green-400">
                    {slot.startTime}
                  </div>
                ))}
                {slotsByDate[day.date] && (slotsByDate[day.date].length > 3) && (
                  <div className="text-xs text-gray-500 text-center">+{slotsByDate[day.date].length - 3} more</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Time Slots for Selected Date */}
      {selectedDate && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              Available Times for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {(slotsByDate[selectedDate] || []).map((slot, index) => (
                <Button
                  key={index}
                  onClick={() => handleSlotSelect(slot)}
                  variant={selectedSlot === slot ? "default" : "outline"}
                  className={`h-auto p-3 flex flex-col items-center space-y-1 ${selectedSlot === slot ? 'bg-blue-600 border-blue-600' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}`}
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{slot.startTime}</span>
                  <span className="text-xs text-gray-400">{slot.duration} min</span>
                  <span className="text-xs font-semibold">${slot.price}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Summary */}
      {selectedSlot && selectedDate && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><span className="text-gray-400">Trainer:</span><span className="text-white font-medium">{trainer.name}</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-400">Date:</span><span className="text-white font-medium">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-400">Time:</span><span className="text-white font-medium">{selectedSlot.startTime} - {selectedSlot.endTime} ({selectedSlot.duration} min)</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-400">Total:</span><span className="text-white font-bold text-lg">${selectedSlot.price}</span></div>
            <Button onClick={handleBooking} className="w-full bg-blue-600 hover:bg-blue-700">
              <CreditCard className="w-4 h-4 mr-2" />
              Book Session
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-white">Complete Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><span className="text-gray-400">Amount:</span><span className="text-white font-bold text-lg">${selectedSlot?.price}</span></div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">CVC</label>
                    <input type="text" placeholder="123" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400"><Shield className="w-4 h-4" /><span>Your payment is secure and encrypted</span></div>
              <div className="flex space-x-3">
                <Button onClick={() => setShowPayment(false)} variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">Cancel</Button>
                <Button onClick={handlePayment} className="flex-1 bg-blue-600 hover:bg-blue-700"><CreditCard className="w-4 h-4 mr-2" />Pay ${selectedSlot?.price}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;

