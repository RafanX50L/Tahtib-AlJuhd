import { useState, useMemo } from "react";
import {
  User,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Award,
  Video,
  Star,
  Edit3,
  Save,
  X,
} from "lucide-react";
import TrainerProfileEdit from "./EditProfile";
import { FaCamera, FaSave } from "react-icons/fa";
import { TrainerService } from "@/services/implementation/trainerServices";
import { ITrainerWithPersonalization } from "@/pages/trainer/TProfile";

interface TrainerProfileProps {
  trainerData: ITrainerWithPersonalization;
  refetchTrainerData: () => Promise<void>;
}

const TrainerProfile: React.FC<TrainerProfileProps> = ({
  trainerData,
  refetchTrainerData,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<ITrainerWithPersonalization>({
    ...trainerData,
    availability: trainerData.availability || {
      engagementType: "",
      weeklySlots: [],
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: keyof ITrainerWithPersonalization,
    field: string,
    index: number | null = null
  ) => {
    const value = e.target.value;
    setFormData((prev) => {
      if (index !== null && Array.isArray(prev[section][field])) {
        const updatedArray = [...(prev[section][field] as any[])];
        updatedArray[index] = value;
        return {
          ...prev,
          [section]: { ...prev[section], [field]: updatedArray },
        };
      }
      return {
        ...prev,
        [section]: { ...prev[section], [field]: value },
      };
    });
  };

  const StarRating: React.FC<{ rating: number; label: string }> = ({
    rating,
    label,
  }) => (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-[#ffffff]/80">{label}:</span>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-[#ffffff]/30"
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-[#ffffff]/60">({rating}/5)</span>
    </div>
  );

  const StyledInput: React.FC<
    React.InputHTMLAttributes<HTMLInputElement> & { className?: string }
  > = ({
    type = "text",
    value,
    onChange,
    placeholder,
    className = "",
    ...props
  }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-3 bg-[#2a2a2a] border border-[#404040] rounded-lg text-[#ffffff] placeholder-[#ffffff]/50 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all ${className}`}
      {...props}
    />
  );

  const SectionHeader: React.FC<{
    icon: React.ComponentType<any>;
    title: string;
  }> = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-[#6366f1]/20 rounded-lg">
        <Icon className="w-5 h-5 text-[#6366f1]" />
      </div>
      <h3 className="text-lg font-semibold text-[#ffffff]">{title}</h3>
    </div>
  );

  const profileContent = useMemo(() => {
    if (isEditing) {
      return (
        <TrainerProfileEdit
          setIsEditing={setIsEditing}
          trainerData={trainerData}
          refetchTrainerData={refetchTrainerData}
        />
      );
    }

    return (
      <div className="bg-[#1e1e1e]/70 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] p-4 sm:p-6 max-w-10xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-[#6366f1]">
            Trainer Profile
          </h2>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 bg-[#6366f1] text-white px-4 py-2 rounded-lg hover:bg-[#5855eb] transition-all duration-200 text-sm sm:text-base"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
        <div className="border border-[#6366f1]/0 pb-5 relative">
          <div className="absolute inset-0 bg-gradient-to-r to-transparent"></div>
          <div className="relative">
            <ProfilePicture
              user={trainerData}
              refetchTrainerData={refetchTrainerData}
            />
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                {trainerData.name}
              </h2>
              <p className="text-white/80 text-lg">{trainerData.email}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-6">
            <div className="bg-[#2a2a2a]/50 p-4 sm:p-6 rounded-lg">
              <SectionHeader icon={User} title="Basic Information" />
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#6366f1]" />
                    <span className="text-[#ffffff]/80">Phone:</span>
                  </div>
                  <span className="text-[#ffffff] break-all sm:break-normal">
                    {trainerData.basicInfo.phoneNumber}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#6366f1]" />
                    <span className="text-[#ffffff]/80">Location:</span>
                  </div>
                  <span className="text-[#ffffff]">
                    {trainerData.basicInfo.location}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#6366f1]" />
                    <span className="text-[#ffffff]/80">Time Zone:</span>
                  </div>
                  <span className="text-[#ffffff]">
                    {trainerData.basicInfo.timeZone}
                  </span>
                </div>
                {trainerData.basicInfo.dateOfBirth && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-[#6366f1]" />
                      <span className="text-[#ffffff]/80">Date of Birth:</span>
                    </div>
                    <span className="text-[#ffffff]">
                      {new Date(
                        trainerData.basicInfo.dateOfBirth
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {trainerData.basicInfo.age && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-[#6366f1]" />
                      <span className="text-[#ffffff]/80">Age:</span>
                    </div>
                    <span className="text-[#ffffff]">
                      {trainerData.basicInfo.age}
                    </span>
                  </div>
                )}
                {trainerData.basicInfo.gender && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-[#6366f1]" />
                      <span className="text-[#ffffff]/80">Gender:</span>
                    </div>
                    <span className="text-[#ffffff] capitalize">
                      {trainerData.basicInfo.gender}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-[#2a2a2a]/50 p-4 sm:p-6 rounded-lg">
              <SectionHeader icon={Video} title="Sample Materials" />
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-3">
                    <Video className="w-4 h-4 text-[#6366f1]" />
                    <span className="text-[#ffffff]/80">Demo Video:</span>
                  </div>
                  <a
                    href={trainerData.sampleMaterials.demoVideoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6366f1] hover:text-[#5855eb] transition-colors break-all"
                  >
                    Watch Demo
                  </a>
                </div>
                {trainerData.sampleMaterials.portfolioLinks?.length && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Award className="w-4 h-4 text-[#6366f1]" />
                      <span className="text-[#ffffff]/80">Portfolio:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trainerData.sampleMaterials.portfolioLinks.map(
                        (link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#6366f1] hover:text-[#5855eb] transition-colors text-xs sm:text-sm bg-[#6366f1]/20 px-2 py-1 rounded"
                          >
                            Portfolio {index + 1}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-[#2a2a2a]/50 p-4 sm:p-6 rounded-lg">
              <SectionHeader icon={Clock} title="Availability" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <span className="text-[#ffffff]/80">Engagement Type:</span>
                <span className="bg-[#6366f1]/20 text-[#6366f1] px-3 py-1 rounded-full text-xs sm:text-sm capitalize w-fit">
                  {trainerData.availability.engagementType}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-[#2a2a2a]/50 p-4 sm:p-6 rounded-lg">
              <SectionHeader icon={Award} title="Professional Summary" />
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-[#ffffff]/80">Experience:</span>
                  <span className="text-[#ffffff] font-semibold">
                    {trainerData.professionalSummary.yearsOfExperience} years
                  </span>
                </div>
                <div>
                  <span className="text-[#ffffff]/80 block mb-2">
                    Specializations:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {trainerData.professionalSummary.specializations.map(
                      (spec, index) => (
                        <span
                          key={index}
                          className="bg-[#6366f1]/20 text-[#6366f1] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                        >
                          {spec}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-[#ffffff]/80 block mb-2">
                    Coaching Type:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {trainerData.professionalSummary.coachingType.map(
                      (type, index) => (
                        <span
                          key={index}
                          className="bg-green-500/20 text-green-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                        >
                          {type}
                        </span>
                      )
                    )}
                  </div>
                </div>
                {trainerData.professionalSummary.platformsUsed?.length && (
                  <div>
                    <span className="text-[#ffffff]/80 block mb-2">
                      Platforms:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {trainerData.professionalSummary.platformsUsed.map(
                        (platform, index) => (
                          <span
                            key={index}
                            className="bg-blue-500/20 text-blue-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                          >
                            {platform}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-[#ffffff]/80 block mb-2">
                    Certifications:
                  </span>
                  <div className="space-y-2">
                    {trainerData.professionalSummary.certifications.map(
                      (cert, index) => (
                        <div
                          key={index}
                          className="bg-[#404040]/50 p-3 rounded-lg cursor-pointer transition hover:bg-[#525252]/70"
                          onClick={() => window.open(cert.proofFile, "_blank")}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                            <span className="text-[#ffffff] font-medium text-sm sm:text-base">
                              {cert.name}
                            </span>
                          </div>
                          <span className="text-[#ffffff]/60 text-xs sm:text-sm">
                            by {cert.issuer}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {trainerData.evaluation && (
          <div className="mt-6 lg:mt-8 bg-[#2a2a2a]/50 p-4 sm:p-6 rounded-lg">
            <SectionHeader icon={Star} title="Performance Evaluation" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4">
              <StarRating
                rating={trainerData.evaluation.communicationSkills || 0}
                label="Communication"
              />
              <StarRating
                rating={trainerData.evaluation.technicalKnowledge || 0}
                label="Technical Knowledge"
              />
              <StarRating
                rating={trainerData.evaluation.coachingStyle || 0}
                label="Coaching Style"
              />
              <StarRating
                rating={trainerData.evaluation.confidencePresence || 0}
                label="Confidence Presence"
              />
              <StarRating
                rating={trainerData.evaluation.brandAlignment || 0}
                label="Brand Alignment"
              />
              <StarRating
                rating={trainerData.evaluation.equipmentQuality || 0}
                label="Equipment Quality"
              />
            </div>
            {trainerData.evaluation.notes && (
              <div className="bg-[#404040]/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-[#ffffff]/80 mb-2">
                  Notes:
                </h4>
                <p className="text-[#ffffff] text-sm sm:text-base">
                  {trainerData.evaluation.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }, [trainerData, isEditing, refetchTrainerData]);

  return profileContent;
};

const ProfilePicture: React.FC<{
  user: ITrainerWithPersonalization;
  refetchTrainerData: () => Promise<void>;
}> = ({ user, refetchTrainerData }) => {
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [tempProfilePic, setTempProfilePic] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
      file.size <= 5 * 1024 * 1024
    ) {
      setProfilePicFile(file);
      setTempProfilePic(URL.createObjectURL(file));
      setMessage("Image selected. Click Update to save.");
    } else {
      setMessage("Please upload a JPEG/PNG/WebP image under 5MB.");
      setProfilePicFile(null);
      setTempProfilePic(null);
    }
  };

  const handlePictureUpdate = async () => {
    if (!profilePicFile) {
      setMessage("Please select an image first.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("profilePicture", profilePicFile);
      const response =
        await TrainerService.updateTrainerProfilePicture(formData);
      if (response) {
        setMessage("Profile picture updated successfully!");
        setProfilePicFile(null);
        setTempProfilePic(null);
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        await refetchTrainerData();
      } else {
        setMessage("Failed to upload image.");
      }
    } catch (error) {
      setMessage("Something went wrong uploading the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#5D5FEF] to-[#FF4757] p-1 shadow-2xl">
          <div className="w-full h-full rounded-full overflow-hidden bg-[#1A1F2E] flex items-center justify-center">
            {tempProfilePic || user.basicInfo.profilePhoto ? (
              <img
                src={tempProfilePic || user.basicInfo.profilePhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-[98.9%] h-[98.9%] rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-semibold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
        </div>
        <label className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-br from-[#5D5FEF] to-[#FF4757] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-lg">
          <FaCamera className="text-white text-sm" />
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      {profilePicFile && (
        <button
          onClick={handlePictureUpdate}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-[#5D5FEF] to-[#7B68EE] text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Updating...
            </>
          ) : (
            <>
              <FaSave />
              Update Picture
            </>
          )}
        </button>
      )}
      {message && (
        <div
          className={`mt-3 px-4 py-2 rounded-lg text-sm ${
            message.includes("successfully")
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default TrainerProfile;
