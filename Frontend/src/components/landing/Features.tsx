import { BarChart2, Utensils, User, MessageSquare, Smartphone, Trophy } from 'lucide-react';
import { Card } from '../ui/card';

export default function Features() {
  const features = [
    {
      icon: <BarChart2 size={40} />,
      title: "Personalized 30-Day Plans",
      description: "Start your journey with a customized 30-day workout plan tailored to your fitness goals and preferences."
    },
    {
      icon: <Utensils size={40} />,
      title: "Nutritional Guidance",
      description: "Receive diet recipes and meal plans aligned with your fitness goals and dietary preferences."
    },
    {
      icon: <User size={40} />,
      title: "One-on-One Training",
      description: "Connect with certified trainers for personalized coaching sessions tailored to your specific needs."
    },
    {
      icon: <MessageSquare size={40} />,
      title: "Seamless Communication",
      description: "Share videos, images, and audio with your trainer to ensure effective feedback and progress tracking."
    },
    {
      icon: <Smartphone size={40} />,
      title: "Accessible Anywhere",
      description: "Access your workouts, nutrition plans, and trainer communication from any device."
    },
    {
      icon: <Trophy size={40} />,
      title: "Track Your Progress",
      description: "Monitor your improvement with detailed analytics and achieve your fitness goals faster."
    }
  ];

  return (
    <section id="features" className="py-20 bg-slate-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none"></div>
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            Why Choose Tahtib AlJuhd?
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-indigo-500 to-pink-500"></span>
          </h2>
          <p className="text-slate-300 max-w-3xl mx-auto">
            Our platform offers comprehensive fitness solutions designed to transform your workout experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-slate-700/80 border border-slate-700 hover:border-pink-500/30 hover:translate-y-[-5px] transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-pink-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-pink-500/10 text-pink-500 p-3 rounded-full w-fit mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-slate-300">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}