import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Calendar, 
  Clock, 
  Plus, 
  User, 
  CheckCircle, 
  XCircle, 
  Trash2,
  UserCheck,
  AlertCircle,
  Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RootState } from '@/store/store';
import { TrainerService } from '@/services/implementation/trainerServices';

interface Slot {
  _id: string;
  trainerId: string;
  clientId: string | null;
  clientName?: string;
  startTime: string; // ISO string, e.g., "2025-08-13T03:30:00.000Z"
  endTime: string; // ISO string, e.g., "2025-08-13T04:30:00.000Z"
  status: 'booked' | 'free' | 'cancelled';
  meetingLink: string;
  createdAt: string;
  updatedAt: string;
}

interface NewSlot {
  date: string; // ISO date string, e.g., "2025-08-12"
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "10:00"
}

const SetAvailabilityPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newSlot, setNewSlot] = useState<NewSlot>({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    if (!user?._id) {
      toast.error('User not authenticated');
      setIsLoading(false);
      return;
    }
    fetchSlots();
  }, [selectedDate, user]);

  const fetchSlots = async () => {
    setIsLoading(true);
    try {
      const fromDate = new Date(selectedDate);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(selectedDate);
      toDate.setHours(23, 59, 59, 999);
      const response = await TrainerService.getSlots(user?._id as string, fromDate.toISOString(), toDate.toISOString());
      console.log('Fetched slots:', response.data); // Debug log
      setSlots(response.data || []);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error fetching slots:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch slots');
      setIsLoading(false);
    }
  };

  const getTodaySlots = () => {
    const today = new Date().toDateString();
    return slots.filter(slot => 
      new Date(slot.startTime).toDateString() === today
    );
  };

  const getSelectedDateSlots = () => {
    const selectedDateString = selectedDate.toDateString();
    return slots.filter(slot => 
      new Date(slot.startTime).toDateString() === selectedDateString
    ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  const getStatusIcon = (status: Slot['status']) => {
    switch (status) {
      case 'booked':
        return <UserCheck className="w-4 h-4 text-green-400" />;
      case 'free':
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Slot['status']) => {
    switch (status) {
      case 'booked':
        return 'border-green-500 bg-green-500/10';
      case 'free':
        return 'border-blue-500 bg-blue-500/10';
      case 'cancelled':
        return 'border-red-500 bg-red-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    try {
      await TrainerService.deleteSlot(slotId);
      setSlots(slots.filter(slot => slot._id !== slotId));
      toast.success('Slot deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete slot');
    }
  };

  const handleCancelBooking = async (slotId: string) => {
    try {
      await TrainerService.cancelSlotBooking(slotId);
      setSlots(slots.map(slot => 
        slot._id === slotId 
          ? { ...slot, status: 'free' as const, clientId: null, clientName: undefined }
          : slot
      ));
      toast.success('Booking cancelled successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const handleAddSlot = async () => {
    if (!user?._id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const startDateTime = new Date(`${newSlot.date}T${newSlot.startTime}`);
      const endDateTime = new Date(`${newSlot.date}T${newSlot.endTime}`);
      
      if (endDateTime <= startDateTime) {
        toast.error('End time must be after start time');
        return;
      }

      const slot = {
        date: newSlot.date,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime
      };
      const payload = { trainerId: user._id, slots: [slot] };
      console.log('Sending payload to TrainerService.addSlot:', payload); // Debug log
      await TrainerService.addSlot([slot], user._id);

      // Refresh slots after adding
      await fetchSlots();
      setNewSlot({ date: new Date().toISOString().split('T')[0], startTime: '', endTime: '' });
      setShowAddSlot(false);
      toast.success('Slot added successfully');
    } catch (error: any) {
      console.error('Error adding slot:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const isSlotStartingSoon = (startTime: string) => {
    const now = new Date();
    const slotStart = new Date(startTime);
    const timeDiff = slotStart.getTime() - now.getTime();
    return timeDiff > 0 && timeDiff <= 30 * 60 * 1000; // 30 minutes
  };

  const todaySlots = getTodaySlots();
  const selectedDateSlots = getSelectedDateSlots();
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Session Management</h1>
          <p className="text-gray-400 mt-1">Manage your training sessions and availability</p>
        </div>
        <Button 
          onClick={() => {
            setNewSlot({ ...newSlot, date: selectedDate.toISOString().split('T')[0] });
            setShowAddSlot(true);
          }}
          className="bg-[#6366f1] hover:bg-[#818cf8] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Time Slot
        </Button>
      </div>

      {/* Calendar Date Selector */}
      <div className="bg-[#1e1e1e] rounded-lg border border-[#2c2c2c] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[#6366f1]" />
          <h2 className="text-lg font-semibold text-white">Select Date</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="p-3 bg-[#2c2c2c] border border-[#3c3c3c] rounded-md text-white focus:ring-2 focus:ring-[#6366f1] focus:outline-none"
            min={new Date().toISOString().split('T')[0]}
          />
          <div className="text-sm text-gray-400">
            {isToday ? (
              <span className="text-green-400">Today's sessions</span>
            ) : (
              <span>
                Sessions for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Today's Sessions - Always Visible */}
      {isToday && (
        <div className="bg-[#1e1e1e] rounded-lg border border-[#2c2c2c] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#6366f1]" />
            <h2 className="text-lg font-semibold text-white">Today's Sessions</h2>
            <span className="bg-[#6366f1] text-white text-xs px-2 py-1 rounded-full">
              {todaySlots.length}
            </span>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366f1]"></div>
            </div>
          ) : todaySlots.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No sessions scheduled for today</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {todaySlots.map((slot) => (
                <div
                  key={slot._id}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(slot.status)} ${
                    isSlotStartingSoon(slot.startTime) ? 'ring-2 ring-yellow-500 ring-opacity-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(slot.status)}
                      <span className="font-medium text-white capitalize">
                        {slot.status}
                      </span>
                    </div>
                    {isSlotStartingSoon(slot.startTime) && (
                      <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-medium">
                        Starting Soon
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                    </div>
                    {slot.clientId && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <User className="w-4 h-4" />
                        <span>{slot.clientName || 'Client'}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {slot.status === 'booked' && (
                      <>
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => window.open(`/room/${slot.meetingLink}`, '_blank')}
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Join
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                          onClick={() => handleCancelBooking(slot._id)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {slot.status === 'free' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => handleDeleteSlot(slot._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Date Sessions */}
      <div className="bg-[#1e1e1e] rounded-lg border border-[#2c2c2c] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#6366f1]" />
          <h2 className="text-lg font-semibold text-white">
            {isToday ? "Today's Sessions (Detail View)" : `Sessions for ${formatDate(selectedDate.toISOString())}`}
          </h2>
          <span className="bg-[#6366f1] text-white text-xs px-2 py-1 rounded-full">
            {selectedDateSlots.length}
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366f1]"></div>
          </div>
        ) : selectedDateSlots.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No sessions scheduled for this date</p>
            <Button
              className="mt-4 bg-[#6366f1] hover:bg-[#818cf8] text-white"
              onClick={() => {
                setNewSlot({
                  ...newSlot,
                  date: selectedDate.toISOString().split('T')[0]
                });
                setShowAddSlot(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Session for This Date
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDateSlots.map((slot) => (
              <div
                key={slot._id}
                className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(slot.status)} ${
                  isToday && isSlotStartingSoon(slot.startTime) ? 'ring-2 ring-yellow-500 ring-opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(slot.status)}
                  <div>
                    <div className="flex items-center gap-4 text-white">
                      <span className="font-medium">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                      {isToday && isSlotStartingSoon(slot.startTime) && (
                        <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-medium">
                          Starting Soon
                        </span>
                      )}
                    </div>
                    {slot.clientId && (
                      <p className="text-sm text-gray-400 mt-1">
                        Client: {slot.clientName || 'Unknown'}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="capitalize text-sm px-3 py-1 rounded-full bg-gray-700 text-gray-300">
                    {slot.status}
                  </span>
                  <div className="flex gap-1">
                    {slot.status === 'booked' && (
                      <>
                        {isToday && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white mr-2"
                            onClick={() => window.open(`/room/${slot.meetingLink}`, '_blank')}
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Join
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                          onClick={() => handleCancelBooking(slot._id)}
                        >
                          Cancel Booking
                        </Button>
                      </>
                    )}
                    {slot.status === 'free' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => handleDeleteSlot(slot._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      {showAddSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] rounded-lg border border-[#2c2c2c] p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Add New Time Slot</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                  className="w-full p-3 bg-[#2c2c2c] border border-[#3c3c3c] rounded-md text-white focus:ring-2 focus:ring-[#6366f1] focus:outline-none"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                <input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  className="w-full p-3 bg-[#2c2c2c] border border-[#3c3c3c] rounded-md text-white focus:ring-2 focus:ring-[#6366f1] focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                <input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  className="w-full p-3 bg-[#2c2c2c] border border-[#3c3c3c] rounded-md text-white focus:ring-2 focus:ring-[#6366f1] focus:outline-none"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 border-[#3c3c3c] text-gray-300 hover:bg-[#2c2c2c]"
                onClick={() => setShowAddSlot(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#6366f1] hover:bg-[#818cf8] text-white"
                onClick={handleAddSlot}
                disabled={!newSlot.date || !newSlot.startTime || !newSlot.endTime}
              >
                Add Slot
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetAvailabilityPage;
