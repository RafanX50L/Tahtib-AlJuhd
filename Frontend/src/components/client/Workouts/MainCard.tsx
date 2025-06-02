import { useEffect } from "react";

interface MainCardProps {
  data:{
    notes: string,
    Workout_Duration: string,
    Workout_Days_Per_Week: number,
    Workout_Completed: number
  };
}

const MainCard: React.FC<MainCardProps> = ({ data }) => {
  console.log("main card", data);
  useEffect(() => {
    console.log("chabged", data, data);
  }, [data]);
  return (
    <div className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border border-gray-700 rounded-xl p-6 mb-10 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757]"></div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          4-Week Body Transformation
        </h2>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <p className="text-gray-400 text-sm">{data.notes}</p>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <p className="text-gray-400 text-sm">
          <span className="text-white font-medium">
            {data.Workout_Duration} min/day
          </span>{" "}
          •{" "}
          <span className="text-white font-medium">
            {data.Workout_Days_Per_Week} days/week
          </span>{" "}
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-2 bg-gray-700 rounded-full flex-grow overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] rounded-full transition-all duration-1000"
            style={{
              width: `${(data.Workout_Completed / (4*data.Workout_Days_Per_Week)) * 100}%`,
            }}
          ></div>
        </div>
        <div className="text-gray-400 text-sm">
          Day {data.Workout_Completed} of {data.Workout_Days_Per_Week * 4} • {"  "}
          {(data.Workout_Completed / (4*data.Workout_Days_Per_Week)) * 100}%{" "}
          completed
        </div>
      </div>
    </div>
  );
};

export default MainCard;
