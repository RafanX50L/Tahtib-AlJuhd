import React, { useState, useEffect } from "react";
import {
  User,
  Clock,
  CheckCircle,
  ShoppingCart,
  Star,
  MapPin,
  Users,
  Calendar,
  Heart,
  Award,
  Target,
  ArrowLeft,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FaRupeeSign } from "react-icons/fa";
import { ClientService } from "@/services/implementation/clientServices";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { RootState } from "@/store/store";
import { loadStripe } from "@stripe/stripe-js";
import { usePaymentSession } from "@/hooks/usePaymentSession";
import { env } from "@/config/env";

// Interfaces based on Plan.model.ts
interface Plan {
  _id: string;
  title: string;
  price: number;
  sessionsPerWeek: number;
  description?: string;
  durationWeeks: number;
}

interface Trainer {
  id: string;
  name: string;
  email: string;
  Specialty: string[];
  experience: number;
  price: number;
  photo: string;
  bio?: string;
  rating?: number;
  reviews?: number;
  clientsTrained?: string;
  availability?: string;
  skills?: string[];
  location?: string;
  plans: Plan[];
}

const StarRating: React.FC<{ rating: number; total?: number }> = ({
  rating,
  total = 5,
}) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(total)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-400"
          }`}
        />
      ))}
    </div>
  );
};

const TrainerPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Payment session management
  const { 
    hasActiveSession, 
    currentSession, 
    createSession, 
    updateSessionStatus, 
    clearSession, 
    error: paymentError 
  } = usePaymentSession();

  useEffect(() => {
    if (!trainerId) {
      // Invalid trainer ID
      return;
    }
    fetchTrainer();
  }, [trainerId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_status');
    
    if (paymentStatus === 'success' && currentSession) {
      updateSessionStatus('completed');
      clearSession();
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'cancelled' && currentSession) {
      updateSessionStatus('cancelled');
      clearSession();
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (currentSession && currentSession.status === 'expired') {
      clearSession();
    }
  }, [currentSession, updateSessionStatus, clearSession]);

  const fetchTrainer = async () => {
    setIsLoading(true);
    try {
      const response = await ClientService.getTrainerById(trainerId!);
      setTrainer(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching trainer:", error);
      console.error("Failed to fetch trainer details");
      setIsLoading(false);
      navigate("/trainerSession");
    }
  };

  const handlePurchasePlan = async () => {
    if (hasActiveSession) {
      alert('A payment session is already active. Please complete or cancel the existing payment before starting a new one.');
      setShowConfirmModal(false);
      return;
    }

    const stripe = await loadStripe(env.STRIPE_KEY);

    if (!user?._id) {
      // User not logged in
      setShowConfirmModal(false);
      return;
    }
    if (!trainer || !selectedPlan) {
      // No plan selected
      setShowConfirmModal(false);
      return;
    }

    const selectedPlanDetails = trainer.plans.find((plan) => plan._id === selectedPlan);
    if (!selectedPlanDetails) return;

    try {
      const sessionData = {
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user._id,
        trainerId: trainerId!,
        planId: selectedPlan,
        amount: selectedPlanDetails.price * 100, // Dynamic: price in paise
        currency: 'inr'
      };

      createSession(sessionData);

      const data = await ClientService.purchasePlan(
        user._id,
        trainerId!,
        selectedPlan
      );

      if (!data.id) {
        throw new Error('Invalid session ID from server');
      }

      const result = await stripe?.redirectToCheckout({ sessionId: data.id });
      if (result?.error) {
        console.error(result.error);
        updateSessionStatus('cancelled');
      }

      setShowConfirmModal(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error("Error purchasing plan:", error);
      setShowConfirmModal(false);
      updateSessionStatus('cancelled');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1419] to-[#1A1F2E] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366f1] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading trainer details...</p>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1419] to-[#1A1F2E] flex items-center justify-center">
        <div className="text-center py-8 text-gray-400">
          <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Trainer Not Found</h2>
          <p className="mb-6">
            The trainer you're looking for doesn't exist or is no longer available.{/* eslint-disable-line */}
          </p>
          <Button
            className="bg-[#6366f1] hover:bg-[#818cf8] text-white"
            onClick={() => navigate("/trainerSession")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Trainers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1419] to-[#1A1F2E] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="text-gray-400 hover:text-white hover:bg-[#1e1e1e] mb-4"
          onClick={() => navigate("/trainerSession")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Trainers
        </Button>

        {/* Payment Status Banner */}
        {hasActiveSession && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-yellow-200 font-medium">Payment Session Active</p>
                <p className="text-yellow-300/80 text-sm">
                  You have an active payment session. Please complete or cancel it before starting a new payment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Error Banner */}
        {paymentError && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <p className="text-red-200 font-medium">Payment Error</p>
                <p className="text-red-300/80 text-sm">{paymentError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#1E2235] via-[#252A40] to-[rgba(30,34,53,0.8)] border border-[#2A3042] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#6366f1] animate-pulse"></div>

          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            <div className="relative">
              <img
                src={trainer.photo}
                alt={trainer.name}
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-2xl object-cover ring-4 ring-[#2A3042] shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#10B981] border-4 border-[#1E2235] rounded-full"></div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {trainer.name}
              </h1>
              <p className="text-[#A0A7B8] text-lg sm:text-xl lg:text-2xl mb-4">
                {trainer.Specialty[0]}
              </p>

              {trainer.rating && (
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                  <StarRating rating={trainer.rating} />
                  <span className="text-yellow-400 font-semibold text-lg">
                    {trainer.rating}
                  </span>
                  <span className="text-[#A0A7B8]">
                    ({trainer.reviews || 0} reviews)
                  </span>
                </div>
              )}

              {trainer.location && (
                <div className="flex items-center justify-center lg:justify-start gap-2 text-[#A0A7B8] mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{trainer.location}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setShowContactModal(true)}
                variant="outline"
                className="border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1] hover:text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact
              </Button>
              <Button
                onClick={() => setShowConfirmModal(true)}
                className="bg-[#6366f1] hover:bg-[#818cf8] text-white px-8 py-3 text-lg font-semibold"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: Clock,
              label: "Experience",
              value: `${trainer.experience} years`,
              color: "text-blue-400",
            },
            {
              icon: Users,
              label: "Clients",
              value: trainer.clientsTrained || "100+",
              color: "text-green-400",
            },
            {
              icon: FaRupeeSign,
              label: "Starting at",
              value: `₹${trainer.price}`,
              color: "text-yellow-400",
            },
            {
              icon: Award,
              label: "Rating",
              value: trainer.rating ? `${trainer.rating}/5` : "New",
              color: "text-purple-400",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="bg-[#1e1e1e] border-[#2c2c2c] hover:bg-[#252525] transition-colors duration-300"
            >
              <CardContent className="p-4 text-center">
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-opacity-20 mb-3 ${stat.color.replace("text-", "bg-")}`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-white font-semibold text-sm sm:text-base">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* About Section */}
          <div className="lg:col-span-2 space-y-6">
            {trainer.bio && (
              <Card className="bg-[#1e1e1e] border-[#2c2c2c]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Heart className="w-5 h-5 text-red-400" />
                    About {trainer.name.split(" ")[0]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{trainer.bio}</p>
                </CardContent>
              </Card>
            )}

            {trainer.Specialty && trainer.Specialty.length > 0 && (
              <Card className="bg-[#1e1e1e] border-[#2c2c2c]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="w-5 h-5 text-green-400" />
                    Specializations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {trainer.Specialty.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#2c2c2c] text-gray-300 rounded-full text-sm font-medium hover:bg-[#6366f1] hover:text-white transition-colors duration-300 cursor-pointer"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {trainer.availability && (
              <Card className="bg-[#1e1e1e] border-[#2c2c2c]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{trainer.availability}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Training Plans */}
          <div>
            <Card className="bg-[#1e1e1e] border-[#2c2c2c] sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <ShoppingCart className="w-5 h-5 text-[#6366f1]" />
                  Training Plans
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trainer.plans?.length ? (
                  <div className="space-y-4">
                    {trainer.plans.map((plan) => (
                      <div
                        key={plan._id}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          selectedPlan === plan._id
                            ? "border-[#6366f1] bg-[#6366f1] bg-opacity-10"
                            : "border-[#2c2c2c] hover:border-[#6366f1] hover:border-opacity-50"
                        }`}
                        onClick={() => setSelectedPlan(plan._id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-semibold">
                            {plan.title}
                          </h4>
                          <div className="text-right">
                            <p className="text-[#6366f1] font-bold text-lg">
                              ₹{plan.price}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {plan.durationWeeks} weeks
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">
                          {plan.sessionsPerWeek} sessions/week
                        </p>
                        {plan.description && (
                          <p className="text-gray-300 text-xs">
                            {plan.description}
                          </p>
                        )}
                      </div>
                    ))}

                    <Button
                      className="w-full bg-[#6366f1] hover:bg-[#818cf8] text-white py-3 mt-4"
                      onClick={() => setShowConfirmModal(true)}
                      disabled={!selectedPlan}
                    >
                      {selectedPlan ? "Book Selected Plan" : "Select a Plan"}
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    No plans available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Modal */}
        <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
          <DialogContent className="bg-[#1e1e1e] border-[#2c2c2c] text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#6366f1]" />
                Contact {trainer.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#2c2c2c] rounded-lg">
                <Mail className="w-5 h-5 text-[#6366f1]" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{trainer.email}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="border-[#3c3c3c] text-gray-300 hover:bg-[#2c2c2c]"
                onClick={() => setShowContactModal(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Purchase Confirmation Modal */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="bg-[#1e1e1e] border-[#2c2c2c] text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Confirm Booking
              </DialogTitle>
            </DialogHeader>

            {selectedPlan &&
            trainer.plans.find((plan) => plan._id === selectedPlan) ? (
              <div className="space-y-4">
                <div className="bg-[#2c2c2c] rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-2">
                    {
                      trainer.plans.find((plan) => plan._id === selectedPlan)
                        ?.title
                    }
                  </h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>
                      Price: ₹
                      {
                        trainer.plans.find((plan) => plan._id === selectedPlan)
                          ?.price
                      }
                    </p>
                    <p>
                      Sessions:{" "}
                      {
                        trainer.plans.find((plan) => plan._id === selectedPlan)
                          ?.sessionsPerWeek
                      }
                      /week
                    </p>
                    <p>
                      Duration:{" "}
                      {
                        trainer.plans.find((plan) => plan._id === selectedPlan)
                          ?.durationWeeks
                      }
                      weeks
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  You're about to book a training session with{" "}{/*eslint-disable-line*/}
                  <strong>{trainer.name}</strong>. Please confirm to proceed
                  with the payment.
                </p>
              </div>
            ) : (
              <p className="text-gray-300">Please select a plan first.</p>
            )}

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                className="border-[#3c3c3c] text-gray-300 hover:bg-[#2c2c2c]"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#6366f1] hover:bg-[#818cf8] text-white"
                onClick={handlePurchasePlan}
                disabled={!selectedPlan}
              >
                Confirm Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TrainerPage;
