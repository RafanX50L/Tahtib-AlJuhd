import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '@/store/store';
import { fetchAvailability, bookSlot, setDate, setTrainer, setCalendlyLink } from '@/store/slices/schedulingSlice';
import { format } from 'date-fns';
// import { TrainerAPI } from '@/services/implementation/trainerService';
import { ClientService } from '@/services/implementation/clientServices';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { InlineWidget } from 'react-calendly';

export default function CBooking() {
  const dispatch = useDispatch<any>();
  const params = useParams();
  const { trainerId, dateISO, slots, loading, bookingStatus, calendlyLink } = useSelector((s: RootState) => s.scheduling);
  const authUser = useSelector((s: RootState) => s.auth.user);
  const [contract, setContract] = useState<any>(null);
  const [contractLoading, setContractLoading] = useState(false);

  useEffect(() => {
    const id = params.trainerId as string | undefined;
    if (id) dispatch(setTrainer(id));
  }, [params.trainerId]);

  useEffect(() => {
    if (trainerId) dispatch(fetchAvailability({ trainerId, dateISO }));
  }, [trainerId, dateISO]);

  useEffect(() => {
    (async () => {
      if (!trainerId) return;
      try {
        const data = await ClientService.getTrainerById(trainerId);
        const link = data?.calendlyLink || data?.trainer?.calendlyLink;
        if (link) dispatch(setCalendlyLink(link));
      } catch (_) {}
    })();
  }, [trainerId]);

  // Fetch contract data
  useEffect(() => {
    const fetchContract = async () => {
      if (!authUser?._id) return;
      setContractLoading(true);
      try {
        const response = await ClientService.getCurrentTrainerContract();
        console.log('contract resonse',response);
        setContract(response);
      } catch (error) {
        console.error('Error fetching contract:', error);
        // Contract not found is expected for new users
      } finally {
        setContractLoading(false);
      }
    };
    fetchContract();
  }, [authUser?._id]);

  const onBook = async (time: string, duration: number) => {
    const clientId = authUser?._id as string | undefined;
    if (!trainerId || !clientId) return;
    
    // Check plan validity
    if (!contract) {
      toast.error("No active plan found. Please purchase a plan first.");
      return;
    }
    
    if (contract.sessionsRemaining <= 0) {
      toast.error("No sessions remaining in your plan");
      return;
    }
    
    const planEndDate = new Date(contract.endDate);
    if (planEndDate < new Date()) {
      toast.error("Your plan has expired. Please renew your plan.");
      return;
    }
    
    const res = await dispatch(bookSlot({ trainerId, clientId, date: dateISO, time, duration }));
    if ((res as any).meta?.requestStatus === 'fulfilled') {
      dispatch(fetchAvailability({ trainerId, dateISO }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Book a Session</h1>
        
        {/* Plan Status Banner */}
        {contract && (
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">Active Plan: {contract.planName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-green-300">
                    Sessions Remaining: {contract.sessionsRemaining}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-yellow-300">
                  Expires: {format(new Date(contract.endDate), "MMM d, yyyy")}
                </span>
              </div>
            </div>
            
            {/* Warning if plan is expiring soon or no sessions left */}
            {(contract.sessionsRemaining <= 2 || new Date(contract.endDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) && (
              <div className="mt-3 flex items-center gap-2 text-amber-300">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  {contract.sessionsRemaining <= 2 
                    ? `Only ${contract.sessionsRemaining} session${contract.sessionsRemaining === 1 ? '' : 's'} remaining!`
                    : "Plan expires soon. Consider renewing!"
                  }
                </span>
              </div>
            )}
          </div>
        )}
        
        {!contract && !contractLoading && (
          <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 border border-amber-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-amber-300">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">No active plan found. Please purchase a plan from your trainer to book sessions.</span>
            </div>
          </div>
        )}
        {calendlyLink ? (
          <div aria-label="Calendly booking widget" className="mb-6 rounded-lg overflow-hidden">
            {/* @ts-ignore: optional widget */}
            <InlineWidget
              url={calendlyLink}
              styles={{ height: '750px', backgroundColor: '#111827' }}
              pageSettings={{ backgroundColor: '1F2937', primaryColor: '5D5FEF', textColor: 'FFFFFF' } as any}
            />
          </div>
        ) : null}
        <div className="flex items-center gap-2 mb-4">
          <input
            aria-label="Select date"
            type="date"
            className="bg-gray-800 text-white rounded px-3 py-2"
            value={dateISO}
            onChange={(e) => dispatch(setDate(e.target.value))}
          />
        </div>
        {loading ? (
          <p>Loading slots...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {slots.map((s) => (
              <button
                key={s.time}
                onClick={() => onBook(s.time,s.duration)}
                aria-label={`Book ${s.time}`}
                className="group relative rounded-xl p-3 bg-gray-800/70 hover:bg-gray-700 border border-gray-700 hover:border-indigo-500 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{s.time}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-300">Available</span>
                </div>
                <div className="mt-1 text-xs text-gray-400">{s.duration}m</div>
                <div className="absolute inset-0 rounded-xl ring-0 group-hover:ring-2 ring-indigo-500/40 pointer-events-none" />
              </button>
            ))}
            {slots.length === 0 && <p className="text-gray-400">No slots available for the selected date.</p>}
          </div>
        )}
        {bookingStatus === 'success' && <p className="mt-3 text-green-400">Booked successfully.</p>}
        {bookingStatus === 'error' && <p className="mt-3 text-red-400">Failed to book.</p>}
      </div>
    </div>
  );
}


