import { useState } from 'react';
import { Card,  CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const WeeklyChallenge = () => {
  const [joined, setJoined] = useState([true, false]);

  const toggleJoin = (index:any) => {
    const newJoined = [...joined];
    newJoined[index] = !newJoined[index];
    setJoined(newJoined);
  };

  const challenges = [
    { title: 'Complete 5 Workouts', progress: 60, text: '3 of 5 workouts completed' },
    { title: 'Burn 2,500 Calories', progress: 45, text: '1,125 of 2,500 calories burned', color: 'orange' },
  ];

  return (
    <Card className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042] mb-10 relative animate-[fadeIn_0.6s_ease-out_0.2s_forwards]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9F43] to-[#FF4757]"></div>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-white">Weekly Challenge</CardTitle>
          <div className="text-[#5D5FEF] text-sm cursor-pointer hover:text-[#7577F5] hover:underline flex items-center gap-2">
            View Leaderboard <span>→</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {challenges.map((challenge, index) => (
          <div
            key={challenge.title}
            className={`flex flex-col md:flex-row gap-4 ${index === 0 ? 'pb-4 mb-4 border-b border-[#2A3042]' : ''}`}
          >
            <div className="flex-grow">
              <div className="font-medium mb-3 text-lg text-white">{challenge.title}</div>
              <div className="h-2 bg-[#2A3042] rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${challenge.color === 'orange' ? 'bg-gradient-to-r from-[#FF9F43] to-[#FFAF60]' : 'bg-gradient-to-r from-[#5D5FEF] to-[#7577F5]'}`}
                  style={{ width: `${challenge.progress}%` }}
                ></div>
              </div>
              <div className="text-[#A0A7B8] text-sm">{challenge.text}</div>
            </div>
            <Button
              className={`min-w-[100px] ${joined[index] ? 'border-2 border-[#5D5FEF] text-[#5D5FEF] bg-transparent' : 'bg-gradient-to-r from-[#5D5FEF] to-[#7577F5] text-white hover:-translate-y-1 hover:shadow-xl'}`}
              onClick={() => toggleJoin(index)}
            >
              {joined[index] ? 'Joined' : 'Join'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WeeklyChallenge;