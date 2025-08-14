import { Trainer } from "./CTMainPage"; // Adjust based on your type definitions
import { useNavigate } from "react-router-dom";
import { Clock, DollarSign } from "lucide-react"; // Assuming you're using lucide-react for icons

interface CurrentTrainerCardProps {
  trainer: Trainer;
}

const CurrentTrainerCard: React.FC<CurrentTrainerCardProps> = ({ trainer }) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-gradient-to-br from-[#1E2235] to-[#252A40] border-2 border-[#5D5FEF] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-[0_8px_30px_rgba(93,95,239,0.2)] transition-all duration-500 transform hover:-translate-y-1 backdrop-blur-sm relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(93,95,239,0.1)] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

      {/* Profile Section */}
      <div className="flex items-center gap-4 w-full sm:w-auto relative">
        <div className="relative">
          <img
            src={trainer.photo}
            alt={trainer.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-[#5D5FEF] shadow-lg"
          />
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#10B981] border-2 border-[#1E2235] rounded-full"></div>
          {/* Current Trainer Badge */}
          <div className="absolute -top-2 -left-2 bg-[#5D5FEF] text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            Current
          </div>
        </div>

        {/* Name and basic info - visible on mobile */}
        <div className="flex-1 sm:hidden">
          <h3 className="text-white font-bold text-xl leading-tight">
            {trainer.name}
          </h3>
          <p className="text-[#A0A7B8] text-sm mt-1 line-clamp-2">
            {trainer.speciality?.slice(0, 2).join(", ") || "No specialties"}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 w-full">
        {/* Name - hidden on mobile, shown on desktop */}
        <h3 className="hidden sm:block text-white font-bold text-2xl mb-2 group-hover:text-[#5D5FEF] transition-colors duration-300">
          {trainer.name}
        </h3>

        {/* Specializations */}
        <div className="mb-4">
          <p className="text-[#A0A7B8] text-sm sm:text-base leading-relaxed">
            {trainer.speciality?.join(", ") || "No specialties"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:gap-6">
          {/* Experience */}
          <div className="flex items-center gap-2 text-[#A0A7B8] text-sm group-hover:text-white transition-colors duration-300">
            <div className="p-2 bg-[#2A3042] rounded-lg group-hover:bg-[#5D5FEF] transition-colors duration-300">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase tracking-wide font-medium">
                Experience
              </p>
              <span className="font-semibold">
                {trainer.experience || "N/A"}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 text-[#A0A7B8] text-sm group-hover:text-white transition-colors duration-300">
            <div className="p-2 bg-[#2A3042] rounded-lg group-hover:bg-[#5D5FEF] transition-colors duration-300">
              <DollarSign size={16} />
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase tracking-wide font-medium">
                Rate/Week
              </p>
              <span className="font-semibold">{trainer.price || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full sm:w-auto mt-4 sm:mt-0">
        <button
          onClick={() =>
            navigate(
              `/current-trainer?name=${encodeURIComponent(trainer.name)}&photo=${encodeURIComponent(trainer.photo)}`
            )
          }
          className="w-full sm:w-auto px-6 py-3 bg-[#5D5FEF] text-white rounded-xl font-medium hover:bg-[#4C4EE5] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[0_4px_20px_rgba(93,95,239,0.4)]"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

interface PreviousTrainerCardProps {
  trainer: Trainer;
}

const PreviousTrainerCard: React.FC<PreviousTrainerCardProps> = ({
  trainer,
}) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-gradient-to-br from-[#1E2235] to-[#252A40] border border-[#2A3042] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-[#FF4757] hover:shadow-[0_8px_30px_rgba(255,71,87,0.15)] transition-all duration-500 transform hover:-translate-y-1 backdrop-blur-sm relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,71,87,0.05)] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

      {/* Profile Section */}
      <div className="flex items-center gap-4 w-full sm:w-auto relative">
        <div className="relative">
          <img
            src={trainer.photo}
            alt={trainer.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#2A3042] group-hover:ring-[#FF4757] transition-all duration-300 shadow-md opacity-80"
          />
          {/* Past Trainer Badge */}
          <div className="absolute -top-2 -left-2 bg-[#FF4757] text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            Past
          </div>
        </div>

        {/* Name and basic info - visible on mobile */}
        <div className="flex-1 sm:hidden">
          <h3 className="text-white font-bold text-lg leading-tight opacity-90">
            {trainer.name}
          </h3>
          <p className="text-[#A0A7B8] text-sm mt-1 line-clamp-2 opacity-90">
            {trainer.speciality?.slice(0, 2).join(", ") || "No specialties"}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 w-full">
        {/* Name - hidden on mobile, shown on desktop */}
        <h3 className="hidden sm:block text-white font-bold text-xl mb-2 group-hover:text-[#FF4757] transition-colors duration-300 opacity-90">
          {trainer.name}
        </h3>

        {/* Specializations */}
        <div className="mb-3">
          <p className="text-[#A0A7B8] text-sm sm:text-base leading-relaxed opacity-90">
            {trainer.speciality?.join(", ") || "No specialties"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-6">
          {/* Experience */}
          <div className="flex items-center gap-2 text-[#A0A7B8] text-sm group-hover:text-white transition-colors duration-300 opacity-90">
            <div className="p-1.5 bg-[#2A3042] rounded-lg group-hover:bg-[#FF4757] transition-colors duration-300">
              <Clock size={14} />
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase tracking-wide font-medium">
                Experience
              </p>
              <span className="font-semibold">
                {trainer.experience || "N/A"}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 text-[#A0A7B8] text-sm group-hover:text-white transition-colors duration-300 opacity-90">
            <div className="p-1.5 bg-[#2A3042] rounded-lg group-hover:bg-[#FF4757] transition-colors duration-300">
              <DollarSign size={14} />
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase tracking-wide font-medium">
                Rate/Week
              </p>
              <span className="font-semibold">{trainer.price || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full sm:w-auto mt-2 sm:mt-0">
        <button
          onClick={() => navigate("/trainer-details")}
          className="w-full sm:w-auto px-6 py-2 bg-[#FF4757] text-white rounded-xl font-medium hover:bg-[#E53E4D] transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export { CurrentTrainerCard, PreviousTrainerCard };
