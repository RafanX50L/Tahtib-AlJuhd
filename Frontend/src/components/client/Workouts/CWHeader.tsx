import { FaUser } from "react-icons/fa";

const CWHeader = () => (
  <div className="flex justify-between items-center mb-10">
    <div>
      <h1 className="text-4xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
        My Workouts
      </h1>
      <p className="text-gray-400 text-base">
        Track your progress in the 28-Day Challenge
      </p>
    </div>
    {/* <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5D5FEF] to-[#FF4757] border-2 border-gray-700 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg">
      <FaUser className="text-white" />
    </div> */}
  </div>
);

export default CWHeader;
