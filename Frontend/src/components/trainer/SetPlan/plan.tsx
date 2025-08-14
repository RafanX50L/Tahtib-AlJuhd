import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Trash2,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { TrainerService } from "@/services/implementation/trainerServices";
import { FaRupeeSign } from "react-icons/fa";

export interface IPlan {
  _id?: string;
  trainerId: string;
  title: string;
  description: string;
  price: number;
  sessionsPerWeek: number;
  durationWeeks: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
const SetPlansPage = () => {
  // Mock user selector
  const { user } = useSelector((state: RootState) => state.auth);

  const [plans, setPlans] = useState<IPlan[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => {
    if (user) {
      const fetchPlans = async () => {
        try {
          // const response = await mockTrainerService.getPlans(user._id);
          const response = await TrainerService.getPlans(user._id);
          const res = await TrainerService.getSalary();
          setSalary(res.data);
          setPlans(response.data);
        } catch (err) {
          setError("Failed to load plans");
        }
      };
      fetchPlans();
    }
  }, [user]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (
      !form.title ||
      !form.description ||
      // !form.price ||
      !form.sessionsPerWeek ||
      !form.durationWeeks
    ) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const newPlan = await TrainerService.AddnewPlan(form, user!._id);
      setPlans([...plans, newPlan.data]);
      setForm({
        title: "",
        description: "",
        price: 0,
        sessionsPerWeek: 1,
        durationWeeks: 1,
        isActive: true,
      });
      setSuccess("Plan created successfully!");
      setIsModalOpen(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error creating plan");
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-[#1e1e1e]/70 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#6366f1] mb-2">
                Training Plans
              </h1>
              <p className="text-[#ffffff]/70">
                Create and manage your fitness training programs
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white px-6 py-3 rounded-lg hover:from-[#5855eb] hover:to-[#7c3aed] transition-all font-medium shadow-lg hover:shadow-xl"
            >
              <PlusCircle className="w-5 h-5" />
              Create New Plan
            </Button>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5" />
            {success}
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-[#1e1e1e]/70 rounded-xl p-12 text-center">
                <div className="w-20 h-20 bg-[#6366f1]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-10 w-10 text-[#6366f1]" />
                </div>
                <h3 className="text-xl font-semibold text-[#ffffff] mb-2">
                  No Plans Yet
                </h3>
                <p className="text-[#ffffff]/60 mb-6">
                  Create your first training plan to get started with coaching
                  clients!
                </p>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white px-6 py-3 rounded-lg hover:from-[#5855eb] hover:to-[#7c3aed] transition-all font-medium"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Your First Plan
                </Button>
              </div>
            </div>
          ) : (
            plans.map((plan) => (
              <Card
                key={plan._id}
                className="bg-[#2a2a2a]/50 border border-[#404040]/30 hover:border-[#6366f1]/30 transition-all duration-200 hover:shadow-lg"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold text-[#ffffff] line-clamp-1">
                      {plan.title}
                    </CardTitle>
                    <Badge
                      variant={plan.isActive ? "default" : "secondary"}
                      className={`text-xs ${
                        plan.isActive
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}
                    >
                      {plan.isActive ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="text-[#ffffff]/70 text-sm leading-relaxed line-clamp-2">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Price Section */}
                  <div className="bg-[#1a1a1a]/50 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FaRupeeSign className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-[#ffffff]/70">
                          Total Price
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-green-400">
                        ₹{plan.price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#ffffff]/50">
                        Per Session
                      </span>
                      <span className="text-sm font-semibold text-[#ffffff]/80">
                        ₹{pricePerSession(plan)}
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#1a1a1a]/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-[#6366f1]" />
                        <span className="text-xs text-[#ffffff]/60">
                          Sessions/Week
                        </span>
                      </div>
                      <span className="text-lg font-bold text-[#6366f1]">
                        {plan.sessionsPerWeek}
                      </span>
                    </div>

                    <div className="bg-[#1a1a1a]/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        <span className="text-xs text-[#ffffff]/60">
                          Duration
                        </span>
                      </div>
                      <span className="text-lg font-bold text-purple-400">
                        {plan.durationWeeks}w
                      </span>
                    </div>
                  </div>

                  {/* Total Sessions */}
                  <div className="bg-[#6366f1]/10 p-3 rounded-lg mb-4 border border-[#6366f1]/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-[#6366f1]" />
                      <span className="text-sm text-[#6366f1] font-medium">
                        Total Sessions: {totalSessions(plan)}
                      </span>
                    </div>
                  </div>

                  {/* Actions and Date */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#404040]/30">
                    <div className="text-xs text-[#ffffff]/50">
                      Created:{" "}
                      {plan.createdAt ? formatDate(plan.createdAt) : "Unknown"}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[#6366f1] hover:bg-[#6366f1]/10 border-[#6366f1]/30 hover:border-[#6366f1]/50"
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-400 hover:bg-red-500/10 border-red-500/30 hover:border-red-500/50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Deactivate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Create Plan Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e1e1e] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    Create New Training Plan
                  </h2>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setError("");
                      setForm({
                        title: "",
                        description: "",
                        price: 0,
                        sessionsPerWeek: 1,
                        durationWeeks: 1,
                        isActive: true,
                      });
                    }}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg flex items-center gap-3">
                    <XCircle className="h-5 w-5" />
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[#ffffff]/80 font-medium">
                      Plan Title *
                    </Label>
                    <Input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="e.g., Weight Loss Transformation"
                      className="bg-[#2a2a2a] border-[#404040] text-[#ffffff] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#ffffff]/80 font-medium">
                      Description *
                    </Label>
                    <Textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Describe what this plan includes, goals, and benefits..."
                      rows={4}
                      className="bg-[#2a2a2a] border-[#404040] text-[#ffffff] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#ffffff]/80 font-medium">
                        Price (₹) *
                      </Label>
                      <Input
                        type="number"
                        value={(salary + 100) * form.durationWeeks! -1}
                        readOnly
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className="bg-[#2a2a2a] border-[#404040] text-[#ffffff]/70 cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#ffffff]/80 font-medium">
                        Sessions/Week *
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
                        className="bg-[#2a2a2a] border-[#404040] text-[#ffffff] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#ffffff]/80 font-medium">
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
                      className="bg-[#2a2a2a] border-[#404040] text-[#ffffff] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20"
                    />
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-[#2a2a2a]/50 rounded-lg border border-[#404040]/30">
                    <input
                      id="isActive"
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) =>
                        setForm({ ...form, isActive: e.target.checked })
                      }
                      className="h-5 w-5 text-[#6366f1] bg-[#2a2a2a] border-[#404040] rounded focus:ring-[#6366f1] focus:ring-2"
                    />
                    <Label
                      htmlFor="isActive"
                      className="text-[#ffffff]/80 font-medium"
                    >
                      Make this plan available to clients
                    </Label>
                  </div>

                  {/* Preview Section */}
                  {form &&
                    form.price! > 0 &&
                    form.sessionsPerWeek! > 0 &&
                    form.durationWeeks! > 0 && (
                      <div className="bg-[#6366f1]/10 p-4 rounded-lg border border-[#6366f1]/20">
                        <h3 className="text-[#6366f1] font-medium mb-2">
                          Plan Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-[#ffffff]/60">
                              Total Sessions:
                            </span>
                            <span className="text-[#ffffff] font-medium ml-2">
                              {form.sessionsPerWeek! * form.durationWeeks!}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#ffffff]/60">
                              Per Session:
                            </span>
                            <span className="text-green-400 font-medium ml-2">
                              ₹
                              {Math.round(
                                form?.price! /
                                  (form.sessionsPerWeek! * form.durationWeeks!)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={() => {
                        setIsModalOpen(false);
                        setError("");
                        setForm({
                          title: "",
                          description: "",
                          price: 0,
                          sessionsPerWeek: 1,
                          durationWeeks: 1,
                          isActive: true,
                        });
                      }}
                      variant="outline"
                      className="flex-1 bg-transparent border-[#404040] text-[#ffffff]/80 hover:bg-[#2a2a2a] hover:border-[#6366f1]/50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:from-[#5855eb] hover:to-[#7c3aed] transition-all font-medium shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Create Plan
                        </>
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
