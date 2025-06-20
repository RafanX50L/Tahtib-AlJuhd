import React, { useState } from "react";
import {
  User,
  Award,
  Video,
  Save,
  X,
  Plus,
  Trash2,
  AlertCircle,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TimezoneSelect from "react-timezone-select";
import { ITrainerWithPersonalization } from "@/pages/trainer/TProfile";
import { TrainerService } from "@/services/implementation/trainerServices";

interface TrainerProfileEditProps {
  setIsEditing: (isEditing: boolean) => void;
  trainerData: ITrainerWithPersonalization;
  refetchTrainerData: () => Promise<void>;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  proofFile?: File | null;
  isNew?: boolean;
}

const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    required?: boolean;
    className?: string;
  }
> = ({ label, required, className = "", ...props }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-white/90">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      className={`w-full bg-[#2a2a2a]/50 border border-[#555] rounded-lg px-3 py-2 text-white placeholder-[#888] focus:ring-2 focus:ring-[#6366f1] focus:border-transparent ${className}`}
      {...props}
    />
  </div>
);

const TimeZonePicker: React.FC<{ onChange: (value: string) => void; value: string }> = ({
  onChange,
  value,
}) => {
  const [selectedTimezone, setSelectedTimezone] = useState(
    value || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-white/90">
        Time Zone <span className="text-red-400">*</span>
      </label>
      <TimezoneSelect
        value={selectedTimezone}
        onChange={(tz) => {
          setSelectedTimezone(tz.value);
          onChange(tz.value);
        }}
        className="w-full bg-[#2a2a2a]/50 border border-[#555] rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "#2a2a2a",
            borderColor: "#555",
            color: "#fff",
            "&:hover": { borderColor: "#6366f1" },
            boxShadow: "none",
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "#2a2a2a",
            color: "#fff",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? "#6366f1" : "#2a2a2a",
            color: "#fff",
            "&:hover": { backgroundColor: "#5855eb" },
          }),
          singleValue: (base) => ({
            ...base,
            color: "#fff",
          }),
          input: (base) => ({
            ...base,
            color: "#fff",
          }),
        }}
      />
    </div>
  );
};

const CheckboxGroup: React.FC<{
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}> = ({ label, options, selectedValues, onChange }) => (
  <div className="space-y-3 mt-4">
    <label className="block text-sm font-medium text-white/90">{label}</label>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option);
        return (
          <label
            key={option}
            className={`
              cursor-pointer group transition-all duration-200
              ${
                isSelected
                  ? "bg-gradient-to-r from-[#6366f1]/20 to-[#8b5cf6]/20 border-[#6366f1] shadow-md shadow-[#6366f1]/20"
                  : "bg-[#2a2a2a]/50 border-[#404040] hover:border-[#6366f1]/50"
              }
              border rounded-xl p-3 backdrop-blur-sm
            `}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() =>
                onChange(
                  isSelected
                    ? selectedValues.filter((v) => v !== option)
                    : [...selectedValues, option]
                )
              }
              className="sr-only"
            />
            <div className="flex items-center space-x-3">
              <div
                className={`
                  w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center
                  ${
                    isSelected
                      ? "bg-[#6366f1] border-[#6366f1]"
                      : "border-[#555] group-hover:border-[#6366f1]/60"
                  }
                `}
              >
                {isSelected && (
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                )}
              </div>
              <span
                className={`text-sm ${isSelected ? "text-white font-medium" : "text-white/80"}`}
              >
                {option}
              </span>
            </div>
          </label>
        );
      })}
    </div>
  </div>
);

const CertificationCard: React.FC<{
  certification: Certification;
  onRemove?: (id: string) => void;
  canEdit: boolean;
}> = ({ certification, onRemove, canEdit }) => (
  <div className="bg-[#2a2a2a]/30 rounded-lg p-3 flex justify-between items-center">
    <div>
      <h4 className="text-sm font-medium text-white">{certification.name}</h4>
      <p className="text-xs text-white/70">Issuer: {certification.issuer}</p>
    </div>
    {canEdit && onRemove && (
      <button
        onClick={() => onRemove(certification.id)}
        className="text-red-400 hover:text-red-300"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    )}
  </div>
);

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] rounded-lg p-5 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        {children}
        <div className="flex gap-3 justify-end mt-4">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#3a3a3a]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-2 bg-[#6366f1] text-white rounded-lg hover:bg-[#5855eb]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const TrainerProfileEdit: React.FC<TrainerProfileEditProps> = ({
  setIsEditing,
  trainerData,
  refetchTrainerData,
}) => {
  const [formData, setFormData] = useState<ITrainerWithPersonalization>({
    ...trainerData,
    availability: trainerData.availability || { engagementType: "", weeklySlots: [] },
  });
  const [newCertifications, setNewCertifications] = useState<Certification[]>([]);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [newCert, setNewCert] = useState<Certification>({
    id: "",
    name: "",
    issuer: "",
    proofFile: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  const specializationOptions = [
    "Weight Loss",
    "Muscle Building",
    "Strength Training",
    "Cardio Training",
    "Yoga",
    "Pilates",
    "CrossFit",
    "HIIT",
    "Functional Training",
    "Sports-Specific Training",
    "Rehabilitation",
    "Senior Fitness",
  ];
  const coachingTypeOptions = ["One-on-One", "Group", "Hybrid"];
  const platformOptions = ["Zoom", "Google Meet", "Microsoft Teams"];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.basicInfo.phoneNumber) newErrors.phoneNumber = "Phone number is required.";
    if (!formData.basicInfo.location) newErrors.location = "Location is required.";
    if (!formData.basicInfo.timeZone) newErrors.timeZone = "Time zone is required.";
    if (formData.professionalSummary.yearsOfExperience < 0)
      newErrors.yearsOfExperience = "Years of experience cannot be negative.";
    if (!formData.sampleMaterials.demoVideoLink.match(/^https?:\/\/.+/))
      newErrors.demoVideoLink = "Please enter a valid URL.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = (): boolean => {
    const isBasicInfoChanged =
      formData.basicInfo.phoneNumber !== trainerData.basicInfo.phoneNumber ||
      formData.basicInfo.location !== trainerData.basicInfo.location ||
      formData.basicInfo.timeZone !== trainerData.basicInfo.timeZone;
    const isProfessionalSummaryChanged =
      formData.professionalSummary.yearsOfExperience !==
        trainerData.professionalSummary.yearsOfExperience ||
      JSON.stringify(formData.professionalSummary.specializations) !==
        JSON.stringify(trainerData.professionalSummary.specializations) ||
      JSON.stringify(formData.professionalSummary.coachingType) !==
        JSON.stringify(trainerData.professionalSummary.coachingType) ||
      JSON.stringify(formData.professionalSummary.platformsUsed) !==
        JSON.stringify(trainerData.professionalSummary.platformsUsed);
    const isSampleMaterialsChanged =
      formData.sampleMaterials.demoVideoLink !== trainerData.sampleMaterials.demoVideoLink;
    const hasNewCertifications = newCertifications.length > 0;

    return (
      isBasicInfoChanged ||
      isProfessionalSummaryChanged ||
      isSampleMaterialsChanged ||
      hasNewCertifications
    );
  };

  const handleInputChange = (
    section: keyof ITrainerWithPersonalization,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleArrayChange = (
    section: keyof ITrainerWithPersonalization,
    field: string,
    values: string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: values },
    }));
  };

  const handleAddCertification = () => {
    if (newCert.name && newCert.issuer && newCert.proofFile) {
      setNewCertifications((prev) => [
        ...prev,
        { ...newCert, id: `new_cert_${Date.now()}`, isNew: true },
      ]);
      setNewCert({ id: "", name: "", issuer: "", proofFile: null });
      setShowCertModal(false);
      setErrors({});
    } else {
      setErrors({
        certName: !newCert.name ? "Certification name is required." : "",
        certIssuer: !newCert.issuer ? "Issuer is required." : "",
        certProof: !newCert.proofFile ? "Proof file is required." : "",
      });
    }
  };

  const handleRemoveNewCertification = (id: string) => {
    setNewCertifications((prev) => prev.filter((cert) => cert.id !== id));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!hasChanges()) {
      setShowConfirmModal(false);
      setIsEditing(false);
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append(
        "basicInfo",
        JSON.stringify(formData.basicInfo)
      );
      formDataToSend.append(
        "professionalSummary",
        JSON.stringify({
          yearsOfExperience: formData.professionalSummary.yearsOfExperience,
          specializations: formData.professionalSummary.specializations,
          coachingType: formData.professionalSummary.coachingType,
          platformsUsed: formData.professionalSummary.platformsUsed,
        })
      );
      formDataToSend.append(
        "sampleMaterials",
        JSON.stringify(formData.sampleMaterials)
      );
      newCertifications.forEach((cert, index) => {
        formDataToSend.append(
          `newCertifications[${index}][name]`,
          cert.name
        );
        formDataToSend.append(
          `newCertifications[${index}][issuer]`,
          cert.issuer
        );
        if (cert.proofFile) {
          formDataToSend.append(
            `newCertifications[${index}][proofFile]`,
            cert.proofFile
          );
        }
      });
      console.log('cerificates',newCertifications);

      const response = await TrainerService.updateTrainerProfile(formDataToSend);
      
      if(response.data.success){

        await refetchTrainerData();
        navigate("/trainer/profile");
        setShowConfirmModal(false);
        setIsEditing(false);
      }
    } catch (error) {
      setShowConfirmModal(false);
      console.error("Error updating profile:", error);
      setErrors({ submit: "Failed to update profile. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] p-4">
      <div className="bg-[#1e1e1e]/70 rounded-xl p-5 max-w-4xl mx-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-[#6366f1]">Edit Trainer Profile</h2>
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-[#6366f1] text-white px-3 py-2 rounded-lg hover:bg-[#5855eb]"
            >
              <Save className="w-4 h-4" /> Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 bg-[#2a2a2a] text-white px-3 py-2 rounded-lg hover:bg-[#3a3a3a]"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
        {errors.submit && (
          <div className="bg-red-500/20 text-red-400 border border-red-500/30 p-3 rounded-lg mb-4">
            {errors.submit}
          </div>
        )}
        <div className="bg-[#2a2a2a]/50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-[#6366f1]" />
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Phone Number"
                required
                value={formData.basicInfo.phoneNumber}
                onChange={(e) =>
                  handleInputChange("basicInfo", "phoneNumber", e.target.value)
                }
                placeholder="Enter phone number"
              />
              {errors.phoneNumber && (
                <p className="text-red-400 text-xs mt-1">{errors.phoneNumber}</p>
              )}
            </div>
            <div>
              <Input
                label="Location"
                required
                value={formData.basicInfo.location}
                onChange={(e) => handleInputChange("basicInfo", "location", e.target.value)}
                placeholder="City, State/Country"
              />
              {errors.location && (
                <p className="text-red-400 text-xs mt-1">{errors.location}</p>
              )}
            </div>
            <div>
              <TimeZonePicker
                value={formData.basicInfo.timeZone}
                onChange={(value) => handleInputChange("basicInfo", "timeZone", value)}
              />
              {errors.timeZone && (
                <p className="text-red-400 text-xs mt-1">{errors.timeZone}</p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-[#2a2a2a]/50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[#6366f1]" />
            <h3 className="text-lg font-semibold text-white">Professional Summary</h3>
          </div>
          <div>
            <Input
              label="Years of Experience"
              required
              type="number"
              value={formData.professionalSummary.yearsOfExperience}
              onChange={(e) =>
                handleInputChange(
                  "professionalSummary",
                  "yearsOfExperience",
                  parseInt(e.target.value) || 0
                )
              }
              placeholder="Enter years of experience"
              min="0"
            />
            {errors.yearsOfExperience && (
              <p className="text-red-400 text-xs mt-1">{errors.yearsOfExperience}</p>
            )}
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-white/90">Certifications</h4>
              <button
                onClick={() => setShowCertModal(true)}
                className="flex items-center gap-2 bg-[#6366f1] text-white px-3 py-2 rounded-lg hover:bg-[#5855eb]"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {formData.professionalSummary.certifications.map((cert) => (
                <CertificationCard key={cert.id} certification={cert} canEdit={false} />
              ))}
              {newCertifications.map((cert) => (
                <CertificationCard
                  key={cert.id}
                  certification={cert}
                  onRemove={handleRemoveNewCertification}
                  canEdit={true}
                />
              ))}
            </div>
          </div>
          <CheckboxGroup
            label="Specializations"
            options={specializationOptions}
            selectedValues={formData.professionalSummary.specializations}
            onChange={(values) =>
              handleArrayChange("professionalSummary", "specializations", values)
            }
          />
          <CheckboxGroup
            label="Coaching Types"
            options={coachingTypeOptions}
            selectedValues={formData.professionalSummary.coachingType}
            onChange={(values) =>
              handleArrayChange("professionalSummary", "coachingType", values)
            }
          />
          <CheckboxGroup
            label="Platforms Used"
            options={platformOptions}
            selectedValues={formData.professionalSummary.platformsUsed}
            onChange={(values) =>
              handleArrayChange("professionalSummary", "platformsUsed", values)
            }
          />
        </div>
        <div className="bg-[#2a2a2a]/50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Video className="w-5 h-5 text-[#6366f1]" />
            <h3 className="text-lg font-semibold text-white">Sample Materials</h3>
          </div>
          <div>
            <Input
              label="Demo Video Link"
              type="url"
              value={formData.sampleMaterials.demoVideoLink}
              onChange={(e) =>
                handleInputChange("sampleMaterials", "demoVideoLink", e.target.value)
              }
              placeholder="https://youtube.com/watch?v=..."
            />
            {errors.demoVideoLink && (
              <p className="text-red-400 text-xs mt-1">{errors.demoVideoLink}</p>
            )}
          </div>
        </div>
        <div className="bg-[#2a2a2a]/50 p-6 rounded-lg border-l-4 border-yellow-500">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="text-lg font-medium text-yellow-400 mb-2">
                Read-Only Information
              </h4>
              <p className="text-sm text-[#ffffff]/70">
                The following sections are managed by the system and cannot be edited:
              </p>
              <ul className="list-disc list-inside text-sm text-[#ffffff]/60 mt-2 space-y-1">
                <li>Personal details (Age, Date of Birth, Gender)</li>
                <li>Availability and scheduling details</li>
                <li>Performance evaluation and ratings</li>
                <li>Existing verified certifications</li>
              </ul>
            </div>
          </div>
        </div>
        <Modal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          onConfirm={handleAddCertification}
          title="Add Certification"
        >
          <div className="space-y-3">
            <div>
              <Input
                label="Certification Name"
                required
                value={newCert.name}
                onChange={(e) =>
                  setNewCert((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Certified Personal Trainer"
              />
              {errors.certName && (
                <p className="text-red-400 text-xs mt-1">{errors.certName}</p>
              )}
            </div>
            <div>
              <Input
                label="Issuing Organization"
                required
                value={newCert.issuer}
                onChange={(e) =>
                  setNewCert((prev) => ({ ...prev, issuer: e.target.value }))
                }
                placeholder="e.g., NASM, ACE"
              />
              {errors.certIssuer && (
                <p className="text-red-400 text-xs mt-1">{errors.certIssuer}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-white/90">
                Proof of Certification <span className="text-red-400">*</span>
              </label>
              <input
                type="file"
                onChange={(e) =>
                  setNewCert((prev) => ({
                    ...prev,
                    proofFile: e.target.files?.[0] || null,
                  }))
                }
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full bg-[#2a2a2a]/50 border border-[#555] rounded-lg px-3 py-2 text-white file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#6366f1] file:text-white hover:file:bg-[#5855eb]"
              />
              {errors.certProof && (
                <p className="text-red-400 text-xs mt-1">{errors.certProof}</p>
              )}
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmSubmit}
          title="Confirm Profile Update"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <p className="text-white/80">
              {hasChanges()
                ? "Are you sure you want to save these changes? New certifications will be pending verification."
                : "No changes detected. Please make some changes to update your profile."}
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TrainerProfileEdit;