import { useState } from "react";

const ProfilePage = () => {
  // Mock user data (replace with API fetch in production)
  const [user, setUser] = useState({
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    phoneNumber: "+1234567890",
    dateOfBirth: "1990-01-01",
    address: "123 Fitness St, Health City",
    profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
  });
  const [formData, setFormData] = useState({ ...user });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [tempProfilePic, setTempProfilePic] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [picMessage, setPicMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false); // New state for hover

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile picture selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      ["image/jpeg", "image/png"].includes(file.type) &&
      file.size <= 5 * 1024 * 1024
    ) {
      setProfilePicFile(file);
      setTempProfilePic(URL.createObjectURL(file));
      setPicMessage("Image selected. Click 'Update Picture' to save.");
    } else {
      setPicMessage("Please upload a JPEG/PNG image under 5MB.");
      setProfilePicFile(null);
      setTempProfilePic(null);
    }
  };

  // Handle profile picture update
  const handlePictureUpdate = async () => {
    if (!profilePicFile) {
      setPicMessage("Please select an image first.");
      return;
    }

    setPicLoading(true);
    setPicMessage("");
    
    const data = new FormData();
    data.append("profilePicture", profilePicFile);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(prev => ({ ...prev, profilePicture: tempProfilePic }));
      setPicMessage("Profile picture updated successfully!");
      setProfilePicFile(null);
      setTempProfilePic(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setPicMessage("Error: Could not update profile picture.");
    } finally {
      setPicLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "profilePicture") {
        data.append(key, formData[key]);
      }
    });

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUser(prev => ({ ...prev, ...formData, profilePicture: prev.profilePicture }));
      setMessage("Profile information updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setMessage("Error: Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setFormData({ ...user });
    setMessage("");
  };

  // Cancel picture selection
  const cancelPictureSelection = () => {
    setProfilePicFile(null);
    setTempProfilePic(null);
    setPicMessage("");
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div 
      className="min-h-screen flex"
      style={{
        background: '#121212',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
      }}
    >
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg border transition-all duration-200"
        style={{
          background: '#1e1e1e',
          borderColor: '#2c2c2c',
          color: '#6366f1'
        }}
      >
        <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed md:relative w-72 h-full border-r transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          background: '#0f0f13',
          borderColor: '#2c2c2c',
          padding: '1.5rem'
        }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div 
            className="w-8 h-8 flex items-center justify-center"
            style={{ color: '#6366f1' }}
          >
            <i className="fas fa-dumbbell text-xl"></i>
          </div>
          <span className="text-xl font-bold">FitTrack Pro</span>
        </div>

        <nav className="space-y-1">
          <a 
            href="/dashboard" 
            className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800"
            style={{ color: '#b0b0b0' }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(99, 102, 241, 0.1)';
              e.target.style.color = '#6366f1';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#b0b0b0';
            }}
          >
            <i className="fas fa-tachometer-alt w-5 text-center"></i>
            <span>Dashboard</span>
          </a>
          <div 
            className="flex items-center gap-3 px-3 py-3 rounded-lg border-l-4"
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              color: '#6366f1',
              borderLeftColor: '#6366f1'
            }}
          >
            <i className="fas fa-user w-5 text-center"></i>
            <span className="font-semibold">Profile</span>
          </div>
          <a 
            href="/sessions" 
            className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200"
            style={{ color: '#b0b0b0' }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(99, 102, 241, 0.1)';
              e.target.style.color = '#6366f1';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#b0b0b0';
            }}
          >
            <i className="fas fa-calendar-alt w-5 text-center"></i>
            <span>Sessions</span>
          </a>
          <a 
            href="/clients" 
            className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200"
            style={{ color: '#b0b0b0' }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(99, 102, 241, 0.1)';
              e.target.style.color = '#6366f1';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#b0b0b0';
            }}
          >
            <i className="fas fa-users w-5 text-center"></i>
            <span>Clients</span>
          </a>
          <a 
            href="/logout" 
            className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 mt-8"
            style={{ color: '#ef4444' }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            <i className="fas fa-sign-out-alt w-5 text-center"></i>
            <span>Logout</span>
          </a>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-0 p-4 md:p-8">
        <div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 rounded-lg shadow-lg"
          style={{
            background: 'rgba(20, 20, 20, 0.7)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h1 
            className="text-3xl font-bold mb-4 md:mb-0"
            style={{ color: '#6366f1' }}
          >
            Trainer Profile
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Alex Johnson</span>
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User avatar"
              className="w-10 h-10 rounded-full object-cover border-2"
              style={{ borderColor: '#6366f1' }}
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Profile Header with Hoverable Picture Update */}
          <div 
            className="flex flex-col md:flex-row items-center gap-6 mb-8 p-6 rounded-lg shadow-lg"
            style={{
              background: '#1e1e1e',
              border: '1px solid #2c2c2c',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div 
              className="flex flex-col items-center gap-4 relative"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => {
                if (!profilePicFile) setIsHovering(false); // Keep visible if file selected
              }}
            >
              <div className="relative">
                <img
                  src={tempProfilePic || user.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 transition-transform duration-300 hover:scale-105"
                  style={{ borderColor: tempProfilePic ? '#10b981' : '#6366f1' }}
                />
                {tempProfilePic && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-white text-xs"></i>
                  </div>
                )}
                {(isHovering || profilePicFile) && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-opacity duration-200">
                    <i className="fas fa-camera text-white text-lg"></i>
                  </div>
                )}
              </div>
              
              {/* Profile Picture Update Section (Visible on Hover or File Selected) */}
              {(isHovering || profilePicFile) && (
                <div className="w-full max-w-xs transition-all duration-200">
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="w-full p-2 text-sm rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
                    style={{
                      background: '#121212',
                      color: 'white',
                      borderColor: '#2c2c2c'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6366f1';
                      e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#2c2c2c';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  
                  {profilePicFile && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handlePictureUpdate}
                        disabled={picLoading}
                        className="flex-1 py-2 px-3 text-sm rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                        style={{
                          background: picLoading ? '#4b5563' : '#10b981',
                          color: 'white'
                        }}
                      >
                        {picLoading ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-1"></i>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-upload mr-1"></i>
                            Update Picture
                          </>
                        )}
                      </button>
                      <button
                        onClick={cancelPictureSelection}
                        disabled={picLoading}
                        className="py-2 px-3 text-sm rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                        style={{
                          background: '#ef4444',
                          color: 'white'
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                  
                  {picMessage && (
                    <div 
                      className={`p-2 rounded-lg mt-2 text-xs border transition-all duration-300 ${
                        picMessage.includes("success") || picMessage.includes("selected") 
                          ? "border-green-500 bg-green-500 bg-opacity-10 text-green-400" 
                          : "border-red-500 bg-red-500 bg-opacity-10 text-red-400"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <i className={`fas ${picMessage.includes("success") || picMessage.includes("selected") ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                        <span>{picMessage}</span>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    <i className="fas fa-info-circle mr-1"></i>
                    JPEG/PNG only, max 5MB
                  </p>
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{user.fullName}</h2>
              <p className="text-gray-400 mb-2">{user.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500">
                <i className="fas fa-map-marker-alt"></i>
                <span>{user.address || "Location not specified"}</span>
              </div>
            </div>
          </div>

          {/* Main Profile Card */}
          <div 
            className="p-6 md:p-8 rounded-lg shadow-lg"
            style={{
              background: '#1e1e1e',
              border: '1px solid #2c2c2c',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h3 
                className="text-xl font-semibold mb-4 md:mb-0 pb-2 border-b"
                style={{ 
                  color: '#6366f1',
                  borderColor: '#2c2c2c'
                }}
              >
                Personal Information
              </h3>
              <button
                onClick={toggleEdit}
                className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:transform hover:scale-105"
                style={{
                  background: isEditing ? '#ef4444' : '#6366f1',
                  color: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                }}
              >
                <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'} mr-2`}></i>
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {message && (
              <div 
                className={`p-4 rounded-lg mb-6 border transition-all duration-300 ${
                  message.includes("success") 
                    ? "border-green-500 bg-green-500 bg-opacity-10 text-green-400" 
                    : "border-red-500 bg-red-500 bg-opacity-10 text-red-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <i className={`fas ${message.includes("success") ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                  <span>{message}</span>
                </div>
              </div>
            )}

            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="fullName">
                      <i className="fas fa-user mr-2" style={{ color: '#6366f1' }}></i>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full p-4 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
                      style={{
                        background: '#121212',
                        color: 'white',
                        borderColor: '#2c2c2c'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#6366f1';
                        e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#2c2c2c';
                        e.target.style.boxShadow = 'none';
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="email">
                      <i className="fas fa-envelope mr-2" style={{ color: '#6366f1' }}></i>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-4 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
                      style={{
                        background: '#121212',
                        color: 'white',
                        borderColor: '#2c2c2c'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#6366f1';
                        e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#2c2c2c';
                        e.target.style.boxShadow = 'none';
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="phoneNumber">
                      <i className="fas fa-phone mr-2" style={{ color: '#6366f1' }}></i>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full p-4 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
                      style={{
                        background: '#121212',
                        color: 'white',
                        borderColor: '#2c2c2c'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#6366f1';
                        e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#2c2c2c';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="dateOfBirth">
                      <i className="fas fa-calendar mr-2" style={{ color: '#6366f1' }}></i>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full p-4 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
                      style={{
                        background: '#121212',
                        color: 'white',
                        borderColor: '#2c2c2c'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#6366f1';
                        e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#2c2c2c';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="address">
                    <i className="fas fa-map-marker-alt mr-2" style={{ color: '#6366f1' }}></i>
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-4 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2"
                    style={{
                      background: '#121212',
                      color: 'white',
                      borderColor: '#2c2c2c'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6366f1';
                      e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#2c2c2c';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: loading ? '#4b5563' : '#10b981',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.background = '#059669';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.background = '#10b981';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className="p-4 rounded-lg transition-all duration-200 hover:shadow-lg"
                  style={{
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-user" style={{ color: '#6366f1' }}></i>
                    <strong className="text-gray-300">Full Name</strong>
                  </div>
                  <p className="text-white pl-6">{user.fullName}</p>
                </div>
                <div 
                  className="p-4 rounded-lg transition-all duration-200 hover:shadow-lg"
                  style={{
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-envelope" style={{ color: '#6366f1' }}></i>
                    <strong className="text-gray-300">Email</strong>
                  </div>
                  <p className="text-white pl-6">{user.email}</p>
                </div>
                <div 
                  className="p-4 rounded-lg transition-all duration-200 hover:shadow-lg"
                  style={{
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-phone" style={{ color: '#6366f1' }}></i>
                    <strong className="text-gray-300">Phone Number</strong>
                  </div>
                  <p className="text-white pl-6">{user.phoneNumber || "Not provided"}</p>
                </div>
                <div 
                  className="p-4 rounded-lg transition-all duration-200 hover:shadow-lg"
                  style={{
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-calendar" style={{ color: '#6366f1' }}></i>
                    <strong className="text-gray-300">Date of Birth</strong>
                  </div>
                  <p className="text-white pl-6">{user.dateOfBirth || "Not provided"}</p>
                </div>
                <div 
                  className="p-4 rounded-lg transition-all duration-200 hover:shadow-lg md:col-span-2"
                  style={{
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-map-marker-alt" style={{ color: '#6366f1' }}></i>
                    <strong className="text-gray-300">Address</strong>
                  </div>
                  <p className="text-white pl-6">{user.address || "Not provided"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;