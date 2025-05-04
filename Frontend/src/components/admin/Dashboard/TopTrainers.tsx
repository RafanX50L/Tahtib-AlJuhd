import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Trainer {
  name: string;
  specialization: string;
  revenue: string;
  clients: number;
}

const TopTrainers = () => {
  const trainers: Trainer[] = [
    {
      name: "Jennifer Lee",
      specialization: "Weight Training",
      revenue: "$2,850",
      clients: 32,
    },
    {
      name: "Robert Wilson",
      specialization: "HIIT Training",
      revenue: "$2,340",
      clients: 27,
    },
    {
      name: "Maria Rodriguez",
      specialization: "Nutrition & Fitness",
      revenue: "$2,120",
      clients: 24,
    },
    {
      name: "James Thompson",
      specialization: "Cardio & Strength",
      revenue: "$1,980",
      clients: 20,
    },
  ];

  return (
    <Card className="bg-gray-800 p-6">
      <h3 className="text-lg font-bold text-white mb-4">Top Performing Trainers</h3>
      <div className="space-y-4">
        {trainers.map((trainer, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-md"
          >
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full mr-3"
                src="https://via.placeholder.com/40"
                alt="Trainer"
              />
              <div>
                <h4 className="text-white font-medium">{trainer.name}</h4>
                <p className="text-gray-400 text-xs">{trainer.specialization}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">{trainer.revenue}</p>
              <p className="text-green-400 text-xs">{trainer.clients} active clients</p>
            </div>
          </div>
        ))}
      </div>
      <Button className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white">
        View All Trainers
      </Button>
    </Card>
  );
};

export default TopTrainers;