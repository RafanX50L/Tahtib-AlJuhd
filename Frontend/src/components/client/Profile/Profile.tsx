import { ClientService } from "@/services/implementation/clientServices";
import { useEffect, useState } from "react";
import {
  FaCamera,
  FaEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaMapMarkerAlt,
} from "react-icons/fa";

export interface ClientProfile {
  name: string;
  email: string;
  phoneNumber: string;
  //   dateOfBirth: string;
  address: string;
  profilePicture: string;
}

const ProfilePicture = ({ user, onPictureUpdate }) => {
  console.log("user", user);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [tempProfilePic, setTempProfilePic] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
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
      const response = await ClientService.updateClientProfilePicture(formData);
      if (response) {
        onPictureUpdate(response.data.profilePicture);
        setMessage("Profile picture updated successfully!");
        setProfilePicFile(null);
        setTempProfilePic(null);
        document.querySelector('input[type="file"]').value = "";
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
            {tempProfilePic || user?.profilePicture ? (
              <img
                src={tempProfilePic || user.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                {/* <FaUser className="text-4xl text-[#A0A7B8]" /> */}
                <div className="w-[98.9%] h-[98.9%] rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-semibold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </>
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

const ProfileInfoField = ({
  icon: Icon,
  label,
  value,
  name,
  type = "text",
  isEditing,
  onChange,
  formData,
}) => (
  <div className="bg-[#1A1F2E] border border-[#2A3042] rounded-xl p-4 hover:border-[#5D5FEF]/30 transition-all">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5D5FEF] to-[#FF4757] flex items-center justify-center">
        <Icon className="text-white text-sm" />
      </div>
      <span className="text-[#A0A7B8] text-sm font-medium">{label}</span>
    </div>
    {isEditing ? (
      <input
        type={type}
        name={name}
        value={formData[name] || ""}
        onChange={onChange}
        className="w-full bg-[#12151E] border border-[#2A3042] rounded-lg px-4 py-3 text-white placeholder-[#A0A7B8] focus:border-[#5D5FEF] focus:outline-none transition-all"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    ) : (
      <p className="text-white font-medium text-lg">
        {value || "Not provided"}
      </p>
    )}
  </div>
);

const ProfilePage = () => {
  const [user, setUser] = useState<ClientProfile | null>(null);
  const [formData, setFormData] = useState<ClientProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null); // Track fetch errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ClientService.getClientProfileData();
        const formattedUser: ClientProfile = {
          name: response.name || "",
          email: response.email || "",
          phoneNumber: response.phoneNumber || "",
          //   dateOfBirth: response.dateOfBirth || "",
          address: response.address || "",
          profilePicture: response.profilePicture || "",
        };
        setUser(formattedUser);
        setFormData(formattedUser);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;
    setLoading(true);
    try {
      //   await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await ClientService.updateClientProfile(formData);
      // Simulate API call
      if (response.success) {
        setUser({ ...formData });
        setMessage("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      setMessage("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePictureUpdate = (newPicture: string) => {
    if (!user || !formData) return;
    setUser({ ...user, profilePicture: newPicture });
    setFormData({ ...formData, profilePicture: newPicture });
  };

  const toggleEdit = () => {
    if (!user) return;
    setIsEditing(!isEditing);
    setFormData({ ...user });
    setMessage("");
  };

  // Render loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-[#5D5FEF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center p-8 bg-[#1A1F2E] border border-[#2A3042] rounded-2xl">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  // Render when user data is available
  if (!user || !formData) {
    return null; // This should never happen due to error handling above
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Card */}
      <div className="bg-[#1A1F2E] border border-[#2A3042] rounded-2xl shadow-2xl overflow-hidden mb-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] p-8 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative">
            <ProfilePicture user={user} onPictureUpdate={handlePictureUpdate} />
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                {user.name}
              </h2>
              <p className="text-white/80 text-lg">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Message */}
          {message && (
            <div
              className={`mb-6 px-4 py-3 rounded-lg text-sm ${
                message.includes("successfully")
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {message}
            </div>
          )}

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ProfileInfoField
              icon={FaUser}
              label="Full Name"
              value={user.name}
              name="name" // Changed to match ClientProfile interface
              isEditing={isEditing}
              onChange={handleChange}
              formData={formData}
            />
            <ProfileInfoField
              icon={FaEnvelope}
              label="Email Address"
              value={user.email}
              name="email"
              type="email"
              isEditing={isEditing}
              onChange={handleChange}
              formData={formData}
            />
            <ProfileInfoField
              icon={FaPhone}
              label="Phone Number"
              value={user.phoneNumber}
              name="phoneNumber"
              type="tel"
              isEditing={isEditing}
              onChange={handleChange}
              formData={formData}
            />
            {/* <ProfileInfoField
              icon={FaCalendar}
              label="Date of Birth"
              value={user.dateOfBirth}
              name="dateOfBirth"
              type="date"
              isEditing={isEditing}
              onChange={handleChange}
              formData={formData}
            /> */}
            <ProfileInfoField
              icon={FaMapMarkerAlt}
              label="Address"
              value={user.address}
              name="address"
              isEditing={isEditing}
              onChange={handleChange}
              formData={formData}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isEditing ? (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-[#5D5FEF] to-[#7B68EE] text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={toggleEdit}
                  className="px-8 py-3 bg-[#2A3042] text-white rounded-full hover:bg-[#374151] transition-all flex items-center justify-center gap-2 font-medium"
                >
                  <FaTimes />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={toggleEdit}
                className="px-8 py-3 bg-gradient-to-r from-[#FF4757] to-[#FF6B7A] text-white rounded-full hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
              >
                <FaEdit />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
