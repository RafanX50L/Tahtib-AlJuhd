const LevelTabs = ({ setActiveTab,activeTab}) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // In a real app, you would load the appropriate content
  };
  const tabs = [
    'Week 1: Foundation',
    'Week 2: Build',
    'Week 3: Intensity',
    'Week 4: Transformation',
  ];
  return (
    <div className="flex gap-3 mb-6 border-b border-gray-700 pb-3">
      {tabs.map((tab,index) => (
        <LevelTab
          key={tab}
          label={tab}
          isActive={activeTab === index+1}
          onClick={() => handleTabClick(index+1)}
        />
      ))}
    </div>
  );
};

export default LevelTabs;

const LevelTab = ({ label, isActive, onClick }) => {
  return (
    <div
      className={`px-4 py-2 rounded-lg cursor-pointer text-sm transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] text-white font-medium shadow-lg"
          : "text-gray-400 hover:text-[#5D5FEF]"
      }`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};
