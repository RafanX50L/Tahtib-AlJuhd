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
  Camera,
  Save,
} from "lucide-react";
import { TrainerService } from "@/services/implementation/trainerServices";
import { ITrainerWithPersonalization } from "@/pages/trainer/TProfile";
import { updateTrainerSchema } from "./ProfileSchema";

interface TrainerProfileProps {
  trainerData: ITrainerWithPersonalization;
  setTrainerData: React.Dispatch<
    React.SetStateAction<ITrainerWithPersonalization | null>
  >;
}

const TrainerProfile: React.FC<TrainerProfileProps> = ({
  trainerData,
  setTrainerData,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: trainerData.name,
    phoneNumber: trainerData.basicInfo.phoneNumber,
    location: trainerData.basicInfo.location,
  });
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [tempProfilePic, setTempProfilePic] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phoneNumber?: string;
    location?: string;
  }>({});

  const hasChanges = useMemo(
    () =>
      formData.name !== trainerData.name ||
      formData.phoneNumber !== trainerData.basicInfo.phoneNumber ||
      formData.location !== trainerData.basicInfo.location,
    [formData, trainerData]
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    try {
      // ✅ Validate entire form
      const validated = updateTrainerSchema.parse(formData);

      // Build only changed fields
      const updateData = {
        ...(validated.name !== trainerData.name && { name: validated.name }),
        ...(validated.phoneNumber !== trainerData.basicInfo.phoneNumber && {
          phoneNumber: validated.phoneNumber,
        }),
        ...(validated.location !== trainerData.basicInfo.location && {
          location: validated.location,
        }),
      };

      await TrainerService.updateTrainerProfile(updateData as FormData);

      setTrainerData((prev) =>
        prev
          ? {
              ...prev,
              name: validated.name,
              basicInfo: {
                ...prev.basicInfo,
                phoneNumber: validated.phoneNumber,
                location: validated.location,
              },
            }
          : prev
      );

      setIsEditing(false);
      setMessage("Profile updated successfully!");
      setErrors({});
    } catch (err: any) {//eslint-disable-line
      if (err.name === "ZodError") {
        // Map Zod errors to form fields
        const fieldErrors: any = {};//eslint-disable-line
        err.errors.forEach((e: any) => {//eslint-disable-line
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
        setMessage("Please correct the highlighted errors.");
      } else {
        setMessage(`Failed to update profile: ${err}`);
      }
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
        setTrainerData((prev) =>
          prev
            ? {
                ...prev,
                basicInfo: {
                  ...prev.basicInfo,
                  profilePhoto: URL.createObjectURL(profilePicFile),
                },
              }
            : prev
        );
        setProfilePicFile(null);
        setTempProfilePic(null);
        setMessage("Profile picture updated successfully!");
        (
          document.querySelector('input[type="file"]') as HTMLInputElement
        ).value = "";
      }
    } catch (error) {
      setMessage(`Failed to upload image : ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const profileContent = useMemo(
    () => (
      <div className="bg-[#1e1e1e]/70 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#6366f1] text-center sm:text-left">
            Trainer Profile
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-[#6366f1] text-white px-6 py-3 rounded-lg hover:bg-[#5855eb] transition-all text-sm sm:text-base font-medium shadow-lg hover:shadow-xl"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-[#5D5FEF] to-[#FF4757] p-1 shadow-2xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#1A1F2E] flex items-center justify-center">
              {tempProfilePic || trainerData.basicInfo.profilePhoto ? (
                <img
                  src={tempProfilePic || trainerData.basicInfo.profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-[98.9%] h-[98.9%] rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-semibold">
                  {trainerData.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <label className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-br from-[#5D5FEF] to-[#FF4757] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-lg">
              <Camera className="text-white w-5 h-5" />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (
                    file &&
                    ["image/jpeg", "image/png", "image/webp"].includes(
                      file.type
                    ) &&
                    file.size <= 5 * 1024 * 1024
                  ) {
                    setProfilePicFile(file);
                    setTempProfilePic(URL.createObjectURL(file));
                    setMessage("Image selected. Click Update to save.");
                  } else {
                    setMessage(
                      "Please upload a JPEG/PNG/WebP image under 5MB."
                    );
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          {/* Name and Basic Info Display */}
          <div className="text-center mt-4">
            <h3 className="text-2xl font-bold text-white mb-2">
              {trainerData.name}
            </h3>
            <p className="text-[#ffffff]/70 text-lg">{trainerData.email}</p>
          </div>

          {profilePicFile && (
            <button
              onClick={handlePictureUpdate}
              disabled={loading}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-[#5D5FEF] to-[#7B68EE] text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Picture
                </>
              )}
            </button>
          )}

          {message && (
            <div
              className={`mt-4 px-6 py-3 rounded-lg text-sm font-medium ${
                message.includes("successfully")
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {isEditing ? (
          /* Edit Mode */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[#ffffff]/80 font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange(e, "name")}
                  className={`w-full p-4 bg-[#2a2a2a] border rounded-lg text-[#ffffff] focus:outline-none transition-all ${
                    errors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-[#404040] focus:border-[#6366f1] focus:ring-[#6366f1]/20"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-[#ffffff]/80 font-medium mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange(e, "phoneNumber")}
                  className={`w-full p-4 bg-[#2a2a2a] border rounded-lg text-[#ffffff] focus:outline-none transition-all ${
                    errors.phoneNumber
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-[#404040] focus:border-[#6366f1] focus:ring-[#6366f1]/20"
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="text-red-400 text-sm">{errors.phoneNumber}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-[#ffffff]/80 font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange(e, "location")}
                  className={`w-full p-4 bg-[#2a2a2a] border rounded-lg text-[#ffffff] focus:outline-none transition-all ${
                    errors.location
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-[#404040] focus:border-[#6366f1] focus:ring-[#6366f1]/20"
                  }`}
                />
                {errors.location && (
                  <p className="text-red-400 text-sm">{errors.location}</p>
                )}
              </div>
            </div>
            <div className="flex justify-center pt-4">
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="px-8 py-3 bg-[#6366f1] text-white rounded-lg hover:bg-[#5855eb] transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          /* Display Mode */
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-[#2a2a2a]/50 p-6 rounded-xl border border-[#404040]/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#6366f1]/20 rounded-lg">
                    <User className="w-5 h-5 text-[#6366f1]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#ffffff]">
                    Basic Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-[#1a1a1a]/50 rounded-lg">
                    <Phone className="w-5 h-5 text-[#6366f1] flex-shrink-0" />
                    <div>
                      <span className="text-[#ffffff]/60 text-sm block">
                        Phone
                      </span>
                      <span className="text-white font-medium">
                        {trainerData.basicInfo.phoneNumber}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-[#1a1a1a]/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-[#6366f1] flex-shrink-0" />
                    <div>
                      <span className="text-[#ffffff]/60 text-sm block">
                        Location
                      </span>
                      <span className="text-white font-medium">
                        {trainerData.basicInfo.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-[#1a1a1a]/50 rounded-lg">
                    <Clock className="w-5 h-5 text-[#6366f1] flex-shrink-0" />
                    <div>
                      <span className="text-[#ffffff]/60 text-sm block">
                        Time Zone
                      </span>
                      <span className="text-white font-medium">
                        {trainerData.basicInfo.timeZone}
                      </span>
                    </div>
                  </div>
                  {trainerData.basicInfo.dateOfBirth && (
                    <div className="flex items-center gap-4 p-3 bg-[#1a1a1a]/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-[#6366f1] flex-shrink-0" />
                      <div>
                        <span className="text-[#ffffff]/60 text-sm block">
                          Date of Birth
                        </span>
                        <span className="text-white font-medium">
                          {new Date(
                            trainerData.basicInfo.dateOfBirth
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                  {trainerData.basicInfo.age && (
                    <div className="flex items-center gap-4 p-3 bg-[#1a1a1a]/50 rounded-lg">
                      <User className="w-5 h-5 text-[#6366f1] flex-shrink-0" />
                      <div>
                        <span className="text-[#ffffff]/60 text-sm block">
                          Age
                        </span>
                        <span className="text-white font-medium">
                          {trainerData.basicInfo.age} years
                        </span>
                      </div>
                    </div>
                  )}
                  {trainerData.basicInfo.gender && (
                    <div className="flex items-center gap-4 p-3 bg-[#1a1a1a]/50 rounded-lg">
                      <User className="w-5 h-5 text-[#6366f1] flex-shrink-0" />
                      <div>
                        <span className="text-[#ffffff]/60 text-sm block">
                          Gender
                        </span>
                        <span className="text-white font-medium capitalize">
                          {trainerData.basicInfo.gender}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Materials */}
              <div className="bg-[#2a2a2a]/50 p-6 rounded-xl border border-[#404040]/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#6366f1]/20 rounded-lg">
                    <Video className="w-5 h-5 text-[#6366f1]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#ffffff]">
                    Sample Materials
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-[#1a1a1a]/50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Video className="w-5 h-5 text-[#6366f1]" />
                      <span className="text-white font-medium">Demo Video</span>
                    </div>
                    <a
                      href={trainerData.sampleMaterials.demoVideoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#6366f1] hover:text-[#5855eb] transition-colors text-sm underline"
                    >
                      Watch Demo Video
                    </a>
                  </div>
                  {trainerData.sampleMaterials.portfolioLinks &&
                    trainerData.sampleMaterials.portfolioLinks?.length > 0 && (
                      <div className="p-4 bg-[#1a1a1a]/50 rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <Award className="w-5 h-5 text-[#6366f1]" />
                          <span className="text-white font-medium">
                            Portfolio
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {trainerData.sampleMaterials.portfolioLinks.map(
                            (link, index) => (
                              <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[#6366f1] hover:text-[#5855eb] bg-[#6366f1]/10 hover:bg-[#6366f1]/20 px-4 py-2 rounded-lg text-sm transition-all border border-[#6366f1]/20"
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

              {/* Availability */}
              <div className="bg-[#2a2a2a]/50 p-6 rounded-xl border border-[#404040]/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#6366f1]/20 rounded-lg">
                    <Clock className="w-5 h-5 text-[#6366f1]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#ffffff]">
                    Availability
                  </h3>
                </div>
                <div className="flex justify-center">
                  <span className="bg-gradient-to-r from-[#6366f1]/20 to-[#8b5cf6]/20 text-[#6366f1] px-6 py-3 rounded-full text-sm font-medium capitalize border border-[#6366f1]/30">
                    {trainerData.availability.engagementType}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Professional Summary */}
              <div className="bg-[#2a2a2a]/50 p-6 rounded-xl border border-[#404040]/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#6366f1]/20 rounded-lg">
                    <Award className="w-5 h-5 text-[#6366f1]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#ffffff]">
                    Professional Summary
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="p-4 bg-[#1a1a1a]/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[#ffffff]/70">
                        Years of Experience
                      </span>
                      <span className="text-2xl font-bold text-[#6366f1]">
                        {trainerData.professionalSummary.yearsOfExperience}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[#ffffff]/80 font-medium mb-3">
                      Specializations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {trainerData.professionalSummary.specializations.map(
                        (spec, index) => (
                          <span
                            key={index}
                            className="bg-[#6366f1]/10 text-[#6366f1] px-4 py-2 rounded-full text-sm font-medium border border-[#6366f1]/20"
                          >
                            {spec}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[#ffffff]/80 font-medium mb-3">
                      Coaching Type
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {trainerData.professionalSummary.coachingType.map(
                        (type, index) => (
                          <span
                            key={index}
                            className="bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-500/20"
                          >
                            {type}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  {trainerData.professionalSummary.platformsUsed?.length >
                    0 && (
                    <div>
                      <h4 className="text-[#ffffff]/80 font-medium mb-3">
                        Platforms Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {trainerData.professionalSummary.platformsUsed.map(
                          (platform, index) => (
                            <span
                              key={index}
                              className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/20"
                            >
                              {platform}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="text-[#ffffff]/80 font-medium mb-3">
                      Certifications
                    </h4>
                    <div className="space-y-3">
                      {trainerData.professionalSummary.certifications.map(
                        (cert, index) => (
                          <div
                            key={index}
                            className="bg-[#1a1a1a]/50 p-4 rounded-lg cursor-pointer hover:bg-[#333333]/70 transition-all border border-[#404040]/30 hover:border-[#6366f1]/30"
                            onClick={() =>
                              window.open(cert.proofFile, "_blank")
                            }
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Award className="w-5 h-5 text-yellow-400" />
                              <span className="font-medium text-white">
                                {cert.name}
                              </span>
                            </div>
                            <span className="text-[#ffffff]/60 text-sm">
                              Issued by {cert.issuer}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Evaluation */}
              {trainerData.evaluation && (
                <div className="bg-[#2a2a2a]/50 p-6 rounded-xl border border-[#404040]/30">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#6366f1]/20 rounded-lg">
                      <Star className="w-5 h-5 text-[#6366f1]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#ffffff]">
                      Performance Evaluation
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[
                      "communicationSkills",
                      "technicalKnowledge",
                      "coachingStyle",
                      "confidencePresence",
                      "brandAlignment",
                      "equipmentQuality",
                    ].map(
                      (key, index) =>
                        trainerData.evaluation?.[
                          key as keyof typeof trainerData.evaluation
                        ] && (
                          <div
                            key={index}
                            className="p-4 bg-[#1a1a1a]/50 rounded-lg"
                          >
                            <div className="flex flex-col gap-2">
                              <span className="text-sm text-[#ffffff]/80 font-medium">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </span>
                              <div className="flex items-center gap-3">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <=
                                        (trainerData.evaluation?.[
                                          key as keyof typeof trainerData.evaluation
                                        ] as number)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-[#ffffff]/20"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-[#ffffff]/60 font-medium">
                                  (
                                  {
                                    trainerData.evaluation?.[
                                      key as keyof typeof trainerData.evaluation
                                    ]
                                  }
                                  /5)
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                  {trainerData.evaluation.notes && (
                    <div className="bg-[#1a1a1a]/50 p-5 rounded-lg mt-6 border border-[#404040]/30">
                      <h4 className="text-sm font-medium text-[#ffffff]/80 mb-3">
                        Evaluation Notes
                      </h4>
                      <p className="text-sm text-[#ffffff]/90 leading-relaxed">
                        {trainerData.evaluation.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    ),
    [
      trainerData,
      isEditing,
      formData,
      profilePicFile,
      tempProfilePic,
      message,
      loading,
      hasChanges,
    ]
  );

  return profileContent;
};

export default TrainerProfile;
