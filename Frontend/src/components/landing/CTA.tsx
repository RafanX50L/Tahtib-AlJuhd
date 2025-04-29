import { Button } from '../ui/button';

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900/80 to-slate-900/90 bg-cover bg-center text-center relative overflow-hidden"
      style={{ backgroundImage: "url('/placeholder/1600/800')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-pink-500/20 z-0"></div>
      <div className="container mx-auto px-5 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your Fitness Journey?
        </h2>
        <p className="text-slate-300 max-w-3xl mx-auto mb-10">
          Join Tahtib AlJuhd today and take the first step towards achieving your fitness goals with professional guidance and personalized plans.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-indigo-500 hover:bg-indigo-600 px-8 py-4 text-lg shadow-lg shadow-indigo-500/50">
            Sign Up Now
          </Button>
          <Button variant="outline" className="px-8 py-4 text-lg">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}