import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Target,
  Edit3,
  X,
  Eye,
  EyeOff,
  Zap,
  Star,
  TrendingUp,
  Award,
} from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import { TrainerService } from "@/services/implementation/trainerServices";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { z } from "zod";
import { PlanSchema } from "./planSchema";



export const validatePlan = (data: Partial<IPlan>) => {
  try {
    PlanSchema.parse(data);
    return { success: true, error: "" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((err) => err.message).join(", "),
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred during validation",
    };
  }
};

export interface IPlan {
  id?: string;
  trainer: string;
  title: string;
  description: string;
  price: number;
  sessionsPerWeek: number;
  durationWeeks: number;
  isActive: boolean;
  isBooked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const SetPlansPage = () => {
  const { user } = useSelector((s: RootState) => s.auth);

  const [plans, setPlans] = useState<IPlan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<IPlan | null>(null);
  const [form, setForm] = useState<Partial<IPlan>>({
    title: "",
    description: "",
    price: 0,
    sessionsPerWeek: 1,
    durationWeeks: 1,
    isActive: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salary, setSalary] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const fetchPlans = async () => {
        try {
          const response = await TrainerService.getPlans(user._id);
          const res = await TrainerService.getSalary();
          setSalary(res.data);
          setPlans(response.data);
        } catch (err) {
          setError(`Failed to load plans : ${err}`);
        }
      };
      fetchPlans();
    }
  }, [user]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    setValidationErrors([]);

    // Validate with Zod-like validation
    const validation = validatePlan(form);
    if (!validation.success) {
      setError(validation.error);
      setIsSubmitting(false);
      setValidationErrors(validationErrors);
      return;
    }

    try {
      const planData = {
        ...form,
        price: (salary + 100) * form.durationWeeks! - 1,
        trainer: user?._id,
      };

      if (editingPlan) {
        await TrainerService.updatePlan(editingPlan.id!, planData);

        const updatedPlan: IPlan = {
          ...editingPlan,
          ...planData,
          trainer: planData.trainer || "", // ensure it’s a string
          updatedAt: new Date().toISOString(),
        };

        setPlans(plans.map((p) => (p.id === editingPlan.id ? updatedPlan : p)));
        setSuccess("Plan updated successfully!");
      } else {
        await TrainerService.AddnewPlan(form, user!._id);

        const newPlan: IPlan = {
          id: Math.random().toString(36).substr(2, 9), // temporary ID
          title: planData.title!,
          description: planData.description!,
          price: planData.price,
          sessionsPerWeek: planData.sessionsPerWeek!,
          durationWeeks: planData.durationWeeks!,
          isActive: planData.isActive!,
          isBooked: planData.isBooked!,
          trainer: planData.trainer || "", // required
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setPlans([...plans, newPlan]);
        setSuccess("Plan created successfully!");
      }

      resetForm();
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(`${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (plan: IPlan) => {
    if (plan.isBooked) {
      setError("Cannot edit a plan that has been booked by clients");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setEditingPlan(plan);
    setForm({
      title: plan.title,
      description: plan.description,
      price: plan.price,
      sessionsPerWeek: plan.sessionsPerWeek,
      durationWeeks: plan.durationWeeks,
      isActive: plan.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDeactivate = async (planId: string) => {
    try {
      await TrainerService.deactivatePlan(planId);
      setPlans(
        plans.map((p) => (p.id === planId ? { ...p, isActive: false } : p))
      );
      setSuccess("Plan deactivated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(`Failed to deactivate plan : ${err}`);
      setTimeout(() => setError(""), 3000);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: 0,
      sessionsPerWeek: 1,
      durationWeeks: 1,
      isActive: true,
    });
    setEditingPlan(null);
    setIsModalOpen(false);
    setError("");
    setValidationErrors([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalSessions = (plan: IPlan) =>
    plan.sessionsPerWeek * plan.durationWeeks;
  const pricePerSession = (plan: IPlan) =>
    Math.round(plan.price / totalSessions(plan));

  const getStatusIcon = (plan: IPlan) => {
    if (plan.isBooked) return <Star className="h-4 w-4 text-yellow-400" />;
    if (plan.isActive) return <Zap className="h-4 w-4 text-green-400" />;
    return <EyeOff className="h-4 w-4 text-gray-400" />;
  };

  const getStatusText = (plan: IPlan) => {
    if (plan.isBooked) return "Booked";
    if (plan.isActive) return "Active";
    return "Inactive";
  };

  const getStatusColor = (plan: IPlan) => {
    if (plan.isBooked)
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
    if (plan.isActive)
      return "bg-green-500/20 text-green-400 border-green-500/40";
    return "bg-gray-500/20 text-gray-400 border-gray-500/40";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f0f] to-[#1a0a1a]">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-[#8b5cf6]/20 to-[#ec4899]/20 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-r from-[#1e1e1e]/80 via-[#2a2a2a]/80 to-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-8 border border-[#404040]/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">
                    Training Plans
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400 font-medium">
                      {plans.filter((p) => p.isActive).length} Active Plans
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[#ffffff]/70 text-lg">
                Create and manage your premium fitness training programs
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-[#6366f1]/25 transition-all duration-300 font-semibold text-lg transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#5855eb] via-[#7c3aed] to-[#db2777] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <PlusCircle className="w-6 h-6" />
                Create New Plan
              </div>
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#404040]/30">
            <div className="bg-[#1a1a1a]/50 p-4 rounded-xl border border-[#404040]/20">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-[#6366f1]" />
                <div>
                  <p className="text-2xl font-bold text-[#6366f1]">
                    {plans.length}
                  </p>
                  <p className="text-sm text-[#ffffff]/60">Total Plans</p>
                </div>
              </div>
            </div>
            <div className="bg-[#1a1a1a]/50 p-4 rounded-xl border border-[#404040]/20">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-yellow-400">
                    {plans.filter((p) => p.isBooked).length}
                  </p>
                  <p className="text-sm text-[#ffffff]/60">Booked Plans</p>
                </div>
              </div>
            </div>
            <div className="bg-[#1a1a1a]/50 p-4 rounded-xl border border-[#404040]/20">
              <div className="flex items-center gap-3">
                <FaRupeeSign className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    ₹
                    {plans.reduce(
                      (sum, p) => (p.isBooked ? sum + p.price : sum),
                      0
                    )}
                  </p>
                  <p className="text-sm text-[#ffffff]/60">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Alerts */}
        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/40 rounded-xl flex items-center gap-3 backdrop-blur-sm">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border border-red-500/40 rounded-xl flex items-center gap-3 backdrop-blur-sm">
            <XCircle className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Enhanced Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {plans.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-gradient-to-br from-[#1e1e1e]/80 via-[#2a2a2a]/80 to-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl p-16 text-center border border-[#404040]/30 shadow-2xl">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#6366f1]/30 to-[#8b5cf6]/30 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Target className="h-16 w-16 text-[#6366f1]" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 animate-ping"></div>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent mb-4">
                  No Plans Yet
                </h3>
                <p className="text-[#ffffff]/60 mb-8 text-lg leading-relaxed max-w-md mx-auto">
                  Start your coaching journey by creating your first premium
                  training plan!
                </p>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-[#6366f1]/25 transition-all duration-300 font-semibold text-lg transform hover:scale-105"
                >
                  <PlusCircle className="w-5 h-5 mr-3" />
                  Create Your First Plan
                </Button>
              </div>
            </div>
          ) : (
            plans.map((plan) => (
              <Card
                key={plan.id}
                className="group bg-gradient-to-br from-[#2a2a2a]/60 via-[#1e1e1e]/60 to-[#2a2a2a]/60 backdrop-blur-xl border border-[#404040]/40 hover:border-[#6366f1]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#6366f1]/10 rounded-2xl overflow-hidden transform hover:scale-[1.02]"
              >
                <CardHeader className="pb-4 relative">
                  {/* Gradient overlay */}
                  <div className="absolute top-8 left-0 right-0 h-2 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899]"></div>

                  <div className="flex justify-between items-start mb-3">
                    <CardTitle className="text-xl font-bold text-[#ffffff] line-clamp-1 group-hover:text-[#6366f1] transition-colors duration-300">
                      {plan.title}
                    </CardTitle>
                    <Badge
                      className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(plan)}`}
                    >
                      {getStatusIcon(plan)}
                      {getStatusText(plan)}
                    </Badge>
                  </div>
                  <p className="text-[#ffffff]/70 text-sm leading-relaxed line-clamp-2">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  {/* Enhanced Price Section */}
                  <div className="bg-gradient-to-r from-[#1a1a1a]/80 to-[#2a2a2a]/80 p-5 rounded-xl border border-[#404040]/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                          <FaRupeeSign className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm text-[#ffffff]/70 font-medium">
                          Total Investment
                        </span>
                      </div>
                      <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        ₹{plan.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-xs text-[#ffffff]/50">
                        Per Session Value
                      </span>
                      <span className="text-lg font-semibold text-[#ffffff]/90">
                        ₹{pricePerSession(plan)}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 p-4 rounded-xl border border-[#6366f1]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-[#6366f1]" />
                        <span className="text-xs text-[#ffffff]/60 font-medium">
                          Weekly Sessions
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-[#6366f1]">
                        {plan.sessionsPerWeek}
                      </span>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/10 to-[#8b5cf6]/10 p-4 rounded-xl border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        <span className="text-xs text-[#ffffff]/60 font-medium">
                          Duration
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-purple-400">
                        {plan.durationWeeks}w
                      </span>
                    </div>
                  </div>

                  {/* Total Sessions Highlight */}
                  <div className="bg-gradient-to-r from-[#6366f1]/10 via-[#8b5cf6]/10 to-[#ec4899]/10 p-4 rounded-xl border border-[#6366f1]/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1]/5 via-[#8b5cf6]/5 to-[#ec4899]/5 animate-pulse"></div>
                    <div className="flex items-center gap-3 relative z-10">
                      <Users className="h-5 w-5 text-[#6366f1]" />
                      <span className="text-sm text-[#6366f1] font-semibold">
                        Total Training Sessions: {totalSessions(plan)}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Actions and Date */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#404040]/30">
                    <div className="text-xs text-[#ffffff]/50">
                      Created:{" "}
                      {plan.createdAt ? formatDate(plan.createdAt) : "Unknown"}
                      {plan.updatedAt && (
                        <div>Updated: {formatDate(plan.updatedAt)}</div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(plan)}
                        disabled={plan.isBooked}
                        className={`transition-all duration-300 ${
                          plan.isBooked
                            ? "text-gray-500 hover:bg-gray-500/5 border-gray-500/30 cursor-not-allowed opacity-50"
                            : "text-[#6366f1] hover:bg-[#6366f1]/10 border-[#6366f1]/40 hover:border-[#6366f1]/60 hover:shadow-lg"
                        }`}
                        title={
                          plan.isBooked
                            ? "Cannot edit booked plans"
                            : "Edit plan"
                        }
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => plan.id && handleDeactivate(plan.id)}
                        className={`transition-all duration-300 ${
                          plan.isActive
                            ? "text-red-400 hover:bg-red-500/10 border-red-500/40 hover:border-red-500/60 hover:shadow-lg"
                            : "text-green-400 hover:bg-green-500/10 border-green-500/40 hover:border-green-500/60 hover:shadow-lg"
                        }`}
                      >
                        {plan.isActive ? (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Enhanced Create/Edit Plan Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-[#1e1e1e] via-[#2a2a2a] to-[#1e1e1e] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto border border-[#404040]/40">
              {/* Enhanced Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] p-8 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      {editingPlan ? (
                        <Edit3 className="w-6 h-6 text-white" />
                      ) : (
                        <PlusCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {editingPlan
                          ? "Edit Training Plan"
                          : "Create New Training Plan"}
                      </h2>
                      <p className="text-white/80">
                        {editingPlan
                          ? "Update your existing plan"
                          : "Design your premium fitness program"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetForm}
                    className="text-white hover:bg-white/20 p-3 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-8">
                {error && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border border-red-500/40 rounded-xl flex items-center gap-3">
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <div className="space-y-8">
                  {/* Title Field */}
                  <div className="space-y-3">
                    <Label className="text-[#ffffff]/90 font-semibold text-base flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#6366f1]" />
                      Plan Title *
                    </Label>
                    <Input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="e.g., Ultimate Weight Loss Transformation"
                      className="bg-[#2a2a2a]/80 border-[#404040]/60 text-[#ffffff] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/30 rounded-xl py-3 px-4 text-base transition-all duration-300 placeholder:text-[#ffffff]/40"
                    />
                  </div>

                  {/* Description Field */}
                  <div className="space-y-3">
                    <Label className="text-[#ffffff]/90 font-semibold text-base flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-purple-400" />
                      Description *
                    </Label>
                    <Textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Describe your training plan, goals, methods, and what clients can expect..."
                      rows={4}
                      className="bg-[#2a2a2a]/80 border-[#404040]/60 text-[#ffffff] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/30 rounded-xl py-3 px-4 text-base resize-none transition-all duration-300 placeholder:text-[#ffffff]/40"
                    />
                  </div>

                  {/* Enhanced Input Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[#ffffff]/90 font-semibold text-base flex items-center gap-2">
                        <FaRupeeSign className="w-4 h-4 text-green-400" />
                        Price (Auto-calculated)
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={
                            form.durationWeeks
                              ? (salary + 100) * form.durationWeeks - 1
                              : 0
                          }
                          readOnly
                          className="bg-[#1a1a1a]/80 border-[#404040]/40 text-green-400 font-bold text-lg rounded-xl py-3 px-4 cursor-not-allowed"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center">
                            <DollarSign className="w-3 h-3 text-green-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[#ffffff]/90 font-semibold text-base flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#6366f1]" />
                        Sessions per Week *
                      </Label>
                      <Input
                        type="number"
                        value={form.sessionsPerWeek}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            sessionsPerWeek: Number(e.target.value),
                          })
                        }
                        placeholder="1"
                        min="1"
                        max="14"
                        className="bg-[#2a2a2a]/80 border-[#404040]/60 text-[#ffffff] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/30 rounded-xl py-3 px-4 text-base transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[#ffffff]/90 font-semibold text-base flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      Duration (Weeks) *
                    </Label>
                    <Input
                      type="number"
                      value={form.durationWeeks}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          durationWeeks: Number(e.target.value),
                        })
                      }
                      placeholder="1"
                      min="1"
                      max="52"
                      className="bg-[#2a2a2a]/80 border-[#404040]/60 text-[#ffffff] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/30 rounded-xl py-3 px-4 text-base transition-all duration-300"
                    />
                  </div>

                  {/* Enhanced Active Toggle */}
                  <div className="bg-gradient-to-r from-[#1a1a1a]/80 to-[#2a2a2a]/80 p-6 rounded-xl border border-[#404040]/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-lg flex items-center justify-center">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <Label className="text-[#ffffff]/90 font-semibold text-base">
                            Plan Visibility
                          </Label>
                          <p className="text-sm text-[#ffffff]/60">
                            Make this plan available to clients
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.isActive}
                          onChange={(e) =>
                            setForm({ ...form, isActive: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-[#404040]/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#6366f1] peer-checked:to-[#8b5cf6]"></div>
                      </label>
                    </div>
                  </div>

                  {/* Enhanced Preview Section */}
                  {form.title && form.durationWeeks && form.sessionsPerWeek && (
                    <div className="bg-gradient-to-br from-[#6366f1]/5 via-[#8b5cf6]/5 to-[#ec4899]/5 p-6 rounded-xl border border-[#6366f1]/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 rounded-full -translate-y-16 translate-x-16"></div>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent mb-4 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-[#6366f1]" />
                        Plan Preview
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#6366f1] mb-1">
                            {form.sessionsPerWeek! * form.durationWeeks!}
                          </div>
                          <div className="text-sm text-[#ffffff]/60">
                            Total Sessions
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400 mb-1">
                            ₹
                            {form.durationWeeks
                              ? Math.round(
                                  ((salary + 100) * form.durationWeeks - 1) /
                                    (form.sessionsPerWeek! *
                                      form.durationWeeks!)
                                )
                              : 0}
                          </div>
                          <div className="text-sm text-[#ffffff]/60">
                            Per Session
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400 mb-1">
                            {form.durationWeeks}
                          </div>
                          <div className="text-sm text-[#ffffff]/60">
                            Weeks Duration
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      onClick={resetForm}
                      variant="outline"
                      className="flex-1 bg-transparent border-[#404040]/60 text-[#ffffff]/80 hover:bg-[#2a2a2a]/50 hover:border-[#404040] rounded-xl py-3 transition-all duration-300 font-medium"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        isSubmitting || !form.title || !form.description
                      }
                      className="flex-1 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] text-white hover:from-[#5855eb] hover:via-[#7c3aed] hover:to-[#db2777] disabled:from-gray-500 disabled:via-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl py-3 transition-all duration-300 font-semibold shadow-lg hover:shadow-2xl transform hover:scale-[1.02] disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          {editingPlan ? "Updating..." : "Creating..."}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          {editingPlan ? (
                            <Edit3 className="w-5 h-5" />
                          ) : (
                            <PlusCircle className="w-5 h-5" />
                          )}
                          {editingPlan ? "Update Plan" : "Create Plan"}
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetPlansPage;
