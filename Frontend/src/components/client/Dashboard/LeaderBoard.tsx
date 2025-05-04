import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Leaderboard = () => {
  const users = [
    { rank: 1, name: 'Alex Johnson', score: '4,820 pts' },
    { rank: 2, name: 'Sarah Miller', score: '4,650 pts' },
    { rank: 3, name: 'Michael Chen', score: '4,320 pts' },
    { rank: 7, name: 'You', score: '3,450 pts', isYou: true },
  ];

  return (
    <Card className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border-[#2A3042] mb-10 relative animate-[fadeIn_0.6s_ease-out_0.4s_forwards]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00D68F] to-[#5D5FEF]"></div>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-white">Community Leaderboard</CardTitle>
          <div className="text-[#5D5FEF] text-sm cursor-pointer hover:text-[#7577F5] hover:underline flex items-center gap-2">
            View All <span>→</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {users.map((user) => (
          <div
            key={user.rank}
            className="flex items-center p-4 border-b border-[#2A3042] last:border-none hover:bg-[rgba(30,34,53,0.5)] hover:translate-x-1 transition-all"
          >
            <div className="w-8 text-center font-bold text-[#5D5FEF] text-lg">{user.rank}</div>
            <div className="flex items-center gap-4 flex-grow">
              <div
                className={`w-10 h-10 rounded-full border-2 border-[#2A3042] shadow-md ${user.isYou ? 'bg-gradient-to-br from-[#00D68F] to-[#33DEAC] border-[#00D68F]' : 'bg-gradient-to-br from-[#5D5FEF] to-[#FF4757]'}`}
              ></div>
              <div className="flex items-center gap-2">
                <span className="text-white">{user.name}</span>
                {user.isYou && <span className="bg-[#00D68F] text-[#12151E] text-xs px-2 py-1 rounded">You</span>}
              </div>
            </div>
            <div className="font-semibold text-lg text-white">{user.score}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;