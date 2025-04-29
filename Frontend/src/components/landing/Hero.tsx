import { Button } from '../ui/button';

export default function Hero() {
  return (
    <section 
      className="relative bg-gradient-to-b from-slate-900/70 to-slate-900/90 bg-cover bg-center h-[600px] flex items-center mt-24"
      style={{ backgroundImage: "url('/placeholder/1600/800')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-pink-500/30 z-0"></div>
      <div className="container mx-auto px-5 relative z-10">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Transform Your Fitness Journey
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Tahtib AlJuhd connects you with professional trainers and personalized workout plans to help you achieve your fitness goals.
          </p>
          <Button className="bg-indigo-500 hover:bg-indigo-600 px-8 py-4 text-lg shadow-lg shadow-indigo-500/50">
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
}