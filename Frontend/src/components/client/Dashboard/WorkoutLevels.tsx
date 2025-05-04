import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FaDumbbell, FaHeartbeat, FaRunning, FaWeightHanging } from 'react-icons/fa';

const WorkoutLevels = () => {
  const [activeTab, setActiveTab] = useState('Beginner');

  const muscles = [
    { title: 'ABS Beginner', count: 8, icon: FaDumbbell },
    { title: 'CHEST Beginner', count: 6, icon: FaHeartbeat },
    { title: 'ARM Beginner', count: 7, icon: FaDumbbell },
    { title: 'LEG Beginner', count: 5, icon: FaRunning },
    { title: 'SHOULDER Beginner', count: 4, icon: FaWeightHanging },
    { title: 'BACK Beginner', count: 6, icon: FaDumbbell },
  ];

  return (
    <div className="mb-10 animate-[fadeIn_0.6s_ease-out_0.3s_forwards]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Targeted Workouts</h2>
        <div className="text-[#5D5FEF] text-sm cursor-pointer hover:text-[#7577F5] hover:underline flex items-center gap-2">
          View All <span>→</span>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 gap-3 mb-6 border-b border-[#2A3042] pb-3 bg-transparent">
          {['Beginner', 'Intermediate', 'Advanced'].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={`px-4 py-2 rounded-lg text-[#A0A7B8] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#5D5FEF] data-[state=active]:to-[#7577F5] data-[state=active]:text-white data-[state=active]:font-medium data-[state=active]:shadow-lg hover:text-[#5D5FEF] transition-all`}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {muscles.map((muscle) => (
              <Card
                key={muscle.title}
                className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042] hover:-translate-y-1 hover:border-[#5D5FEF] hover:shadow-lg transition-all cursor-pointer"
                onClick={() => console.log(`Selected workout: ${muscle.title}`)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5D5FEF] via-[#7577F5] to-[#FF4757] flex items-center justify-center text-white shadow-lg">
                      <muscle.icon />
                    </div>
                    <CardTitle className="font-semibold text-lg text-white">{muscle.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-[#A0A7B8] text-sm flex items-center gap-2">
                    <span className="text-[#5D5FEF] text-xl">•</span>
                    {muscle.count} workouts available
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkoutLevels;