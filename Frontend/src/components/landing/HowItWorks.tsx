export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Create Your Account",
      description: "Sign up and complete your fitness profile with your goals, preferences, and current fitness level."
    },
    {
      number: "2",
      title: "Get Your 30-Day Plan",
      description: "Receive your personalized workout plan and nutritional guidance based on your profile."
    },
    {
      number: "3",
      title: "Optionally Choose a Trainer",
      description: "Browse trainer profiles and select one for personalized coaching if desired."
    },
    {
      number: "4",
      title: "Track & Communicate",
      description: "Follow your plan, track progress, and stay in touch with your trainer through our platform."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-800 relative overflow-hidden">
      <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-radial-gradient from-violet-500/10 to-transparent pointer-events-none"></div>
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            How It Works
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-indigo-500 to-pink-500"></span>
          </h2>
          <p className="text-slate-300 max-w-3xl mx-auto">
            Getting started with Tahtib AlJuhd is simple and straightforward.
          </p>
        </div>
        
        <div className="relative mt-12">
          <div className="absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 opacity-30 z-0"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto shadow-lg shadow-pink-500/50">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}