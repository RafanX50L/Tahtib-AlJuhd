import { Check } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export default function UserTypes() {
  const clientBenefits = [
    "Customized 30-day workout plans upon joining",
    "Personalized diet recipes based on your preferences",
    "Option for one-on-one training with certified coaches",
    "Direct communication with trainers through chat",
    "Share workout videos for feedback and improvements",
    "Track your progress with detailed analytics"
  ];

  const trainerBenefits = [
    "Manage your client roster efficiently",
    "Set your own rates for personalized training",
    "Direct communication with clients through messaging",
    "Review and provide feedback on workout videos",
    "Build your reputation with client testimonials",
    "Grow your professional training business"
  ];

  return (
    <section id="user-types" className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-full bg-radial-gradient from-pink-500/10 to-transparent pointer-events-none"></div>
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            Who Is It For?
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-indigo-500 to-pink-500"></span>
          </h2>
          <p className="text-slate-300 max-w-3xl mx-auto">
            Tahtib AlJuhd serves both fitness enthusiasts and professional trainers.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          <Card className="flex-1 min-w-[300px] max-w-[500px] bg-slate-800 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-700">
            <div 
              className="h-64 bg-cover bg-center relative"
              style={{ backgroundImage: "url('/placeholder/500/250')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-800"></div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4 text-indigo-500 relative">
                For Clients
                <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-pink-500"></span>
              </h3>
              <ul className="space-y-2 mb-6">
                {clientBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start text-slate-300">
                    <Check className="text-emerald-500 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-indigo-500 hover:bg-indigo-600">
                Join as Client
              </Button>
            </div>
          </Card>
          
          <Card className="flex-1 min-w-[300px] max-w-[500px] bg-slate-800 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-700">
            <div 
              className="h-64 bg-cover bg-center relative"
              style={{ backgroundImage: "url('/placeholder/500/250')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-800"></div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4 text-indigo-500 relative">
                For Trainers
                <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-pink-500"></span>
              </h3>
              <ul className="space-y-2 mb-6">
                {trainerBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start text-slate-300">
                    <Check className="text-emerald-500 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-indigo-500 hover:bg-indigo-600">
                Join as Trainer
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}