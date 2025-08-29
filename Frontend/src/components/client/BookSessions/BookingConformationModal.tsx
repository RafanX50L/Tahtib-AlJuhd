import { X, CheckCircle, Clock, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ITrainerByIdView } from '@/interfaces/client/IClientTrainer';
import { ICurrentTrainerContractView } from '@/interfaces/shared/contract';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedSlot: { time: string; duration: number } | null;
  dateISO: string;
  trainerData: ITrainerByIdView;
  contract: ICurrentTrainerContractView;
  isContractExpired: boolean;
  loading?: boolean;
}

export default function BookingConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  selectedSlot,
  dateISO,
  trainerData,
  contract,
  isContractExpired,
  loading = false
}: BookingConfirmationModalProps) {
  if (!isOpen || !selectedSlot) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border border-[#2A3042] rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-[#2A3042] sticky top-0 bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.9)] backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white leading-tight">
              Confirm Your Booking
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[rgba(42,48,66,0.5)] rounded-full transition-colors flex-shrink-0"
            disabled={loading}
          >
            <X className="h-5 w-5 text-[#A0A7B8]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Session Details Card */}
          <div className="bg-gradient-to-r from-[#5D5FEF]/20 to-[#FF4757]/20 rounded-xl p-3 sm:p-4 border border-[#5D5FEF]/30">
            <h3 className="text-xs sm:text-sm font-medium text-[#5D5FEF] mb-2 sm:mb-3">
              Session Details
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#5D5FEF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-[#5D5FEF]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-[#A0A7B8]">Date</p>
                  <p className="text-xs sm:text-sm font-medium text-white truncate">
                    {format(new Date(dateISO), "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#5D5FEF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-[#5D5FEF]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-[#A0A7B8]">Time & Duration</p>
                  <p className="text-xs sm:text-sm font-medium text-white">
                    {selectedSlot.time} ({selectedSlot.duration} minutes)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trainer Details */}
          {trainerData && (
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[rgba(42,48,66,0.3)] rounded-xl">
              {trainerData.photo && (
                <img 
                  src={trainerData.photo} 
                  alt={trainerData.name} 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#2A3042] shadow-sm flex-shrink-0" 
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-[#A0A7B8]">Your Trainer</p>
                <p className="font-medium text-white text-sm sm:text-base truncate">{trainerData.name}</p>
                <p className="text-xs text-[#A0A7B8] truncate">
                  {trainerData.Specialty?.join(', ')} • {trainerData.experience} years exp.
                </p>
              </div>
            </div>
          )}

          {/* Plan Details */}
          {contract && (
            <div className="p-3 sm:p-4 bg-gradient-to-r from-[#00D68F]/20 to-[#33DEAC]/20 rounded-xl border border-[#00D68F]/30">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#00D68F]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-[#00D68F]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-[#00D68F] font-medium truncate">
                    {contract.planName}
                  </p>
                  <p className="text-xs text-[#00D68F]/80">
                    {contract.sessionsRemaining - 1} sessions will remain after booking
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Warning for expired contract */}
          {isContractExpired && (
            <div className="p-3 sm:p-4 bg-gradient-to-r from-[#FF4757]/20 to-[#FF6B7A]/20 border border-[#FF4757]/30 rounded-xl">
              <p className="text-xs sm:text-sm text-[#FF4757] font-medium">
                Your plan has expired. Please renew your plan to book sessions.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-[#2A3042] sticky bottom-0 bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.9)] backdrop-blur-sm rounded-b-2xl">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="px-4 sm:px-6 py-2 sm:py-2 bg-transparent border-[#2A3042] text-[#A0A7B8] hover:bg-[rgba(42,48,66,0.5)] hover:text-white text-sm sm:text-base w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isContractExpired || loading}
            className="px-4 sm:px-6 py-2 sm:py-2 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] hover:from-[#7577F5] hover:to-[#FF6B7A] text-white border-0 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm sm:text-base w-full sm:w-auto"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Booking...
              </div>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}