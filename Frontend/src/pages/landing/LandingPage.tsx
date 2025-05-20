import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import UserTypes from "../../components/landing/UserTypes";
import HowItWorks from "../../components/landing/HowItWorks";
import CTA from "../../components/landing/CTA";
import Footer from "../../components/landing/Footer";

function LandingPage() {
  console.log('entered to landing pagew')
  return (
    <>
      <div className="bg-slate-900 text-slate-100 min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <UserTypes />
          <HowItWorks />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
