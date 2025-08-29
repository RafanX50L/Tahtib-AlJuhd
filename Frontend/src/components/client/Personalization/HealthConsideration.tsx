import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

const healthConsiderationsSchema = z.object({
  healthIssues: z
    .array(z.enum(["back", "knee", "shoulder", "wrist", "none"]))
    .refine((val) => !(val.includes("none") && val.length > 1), {
      message: "Cannot select 'None' with other issues",
    })
    .optional(),
  medicalCondition: z.string().optional(),
});

type HealthConsiderationsForm = z.infer<typeof healthConsiderationsSchema>;
type healthIssues = "back" | "knee" | "shoulder" | "wrist" | "none";

export default function HealthConsiderations() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<
    "forward" | "backward"
  >("forward");
  const [formData, setFormData] = useState<Partial<HealthConsiderationsForm>>(
    {}
  );

  const steps = [
    {
      field: "healthIssues" as const,
      label: "Do you have any of these?",
      description: "Select any health issues to ensure safe exercises",
      type: "card",
      options: [
        { value: "back", label: "Back Problems" },
        { value: "knee", label: "Knee Issues" },
        { value: "shoulder", label: "Shoulder Pain" },
        { value: "wrist", label: "Wrist/Hand Issues" },
        { value: "none", label: "None" },
      ],
    },
    {
      field: "medicalCondition" as const,
      label: "Medical Conditions",
      description: "Share any medical conditions (optional)",
      type: "textarea",
    },
  ];

  const form = useForm<HealthConsiderationsForm>({
    resolver: zodResolver(healthConsiderationsSchema),
    defaultValues: {
      healthIssues: [],
      medicalCondition: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    try {
      const savedHealth = localStorage.getItem("healthInfo");
      if (savedHealth) {
        const parsed = JSON.parse(savedHealth);
        const parsedData: Partial<HealthConsiderationsForm> = {};
        if (parsed.healthIssues) parsedData.healthIssues = parsed.healthIssues;
        if (parsed.medicalCondition)
          parsedData.medicalCondition = parsed.medicalCondition;
        setFormData(parsedData);
      }
    } catch (error) {
      console.error("Error loading saved health info:", error);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof HealthConsiderationsForm, value, {
            shouldValidate: false,
            shouldDirty: true,
            shouldTouch: true,
          });
        }
      });
    }
  }, [formData, form]);

  const updateFormData = () => {
    const currentField = steps[currentStep - 1].field;
    const currentValue = form.getValues(currentField);
    setFormData((prev) => ({
      ...prev,
      [currentField]: currentValue,
    }));
  };

  // Define the enum type for healthIssues
  type HealthIssue = "none" | "back" | "knee" | "shoulder" | "wrist" ;

  // Update the handleInjuryToggle function
  const handleInjuryToggle = (value: HealthIssue) => {
    const currentHealthIssues = form.getValues("healthIssues") || [];
    if (value === "none") {
      if (!currentHealthIssues.includes("none")) {
        form.setValue("healthIssues", ["none"], { shouldValidate: true });
      } else {
        form.setValue("healthIssues", [], { shouldValidate: true });
      }
    } else {
      if (currentHealthIssues.includes("none")) {
        form.setValue("healthIssues", [value], { shouldValidate: true });
      } else {
        if (currentHealthIssues.includes(value)) {
          form.setValue(
            "healthIssues",
            currentHealthIssues.filter((item) => item !== value),
            {
              shouldValidate: true,
            }
          );
        } else {
          form.setValue("healthIssues", [...currentHealthIssues, value], {
            shouldValidate: true,
          });
        }
      }
    }
  };

  const handleNext = async () => {
    const currentField = steps[currentStep - 1].field;
    const isValid =
      currentField === "medicalCondition" || (await form.trigger(currentField));

    if (isValid) {
      updateFormData();
      if (currentStep < steps.length) {
        setAnimationDirection("forward");
        setCurrentStep(currentStep + 1);
      } else {
        const data = form.getValues();
        setIsSubmitting(true);
        try {
          localStorage.setItem(
            "healthInfo",
            JSON.stringify({
              healthIssues: data.healthIssues,
              medicalCondition: data.medicalCondition,
              timestamp: new Date().toISOString(),
            })
          );
          toast.success("Health considerations saved successfully!");
          setTimeout(() => {
            navigate("/personalization?path=diet-preferences");
          }, 500);
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.";
          toast.error(errorMessage);
        } finally {
          setIsSubmitting(false);
        }
      }
    } else {
      toast.error("Please complete the current step to continue");
    }
  };

  const handleBack = () => {
    updateFormData();
    setAnimationDirection("backward");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/personalization?path=workout-preferences");
    }
  };

  const currentFieldConfig = steps[currentStep - 1];
  const currentValue = form.watch(currentFieldConfig.field);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm text-gray-400">
            <span>Step {currentStep + 4} of 6</span>
            <span>{(((currentStep + 4) / 6) * 100).toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
              style={{ width: `${((currentStep + 4) / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{
              x: animationDirection === "forward" ? 50 : -50,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: animationDirection === "forward" ? -50 : 50,
              opacity: 0,
            }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                {currentFieldConfig.label}
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                {currentFieldConfig.description}
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name={currentFieldConfig.field}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-400 sr-only">
                        {currentFieldConfig.label}
                      </FormLabel>
                      <FormControl>
                        {currentFieldConfig.type === "card" ? (
                          <div
                            className={cn(
                              "grid gap-4",
                              currentFieldConfig.field === "healthIssues" &&
                                currentValue &&
                                currentValue.includes("none")
                                ? "grid-cols-1"
                                : "grid-cols-1 sm:grid-cols-2"
                            )}
                          >
                            {currentFieldConfig.options &&
                              currentFieldConfig.options.map((option) => (
                                <div
                                  key={option.value}
                                  className={cn(
                                    "relative border-2 rounded-xl p-5 text-center cursor-pointer transition-all duration-300",
                                    "hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20",
                                    "group overflow-hidden",
                                    option.value === "none"
                                      ? "sm:col-span-2"
                                      : "",
                                    field.value?.includes(option.value as healthIssues )
                                      ? "border-indigo-500 bg-gray-700/70 shadow-lg shadow-indigo-500/10"
                                      : "border-gray-700 bg-gray-800/50"
                                  )}
                                  onClick={() =>
                                    handleInjuryToggle(option.value as HealthIssue)
                                  }
                                >
                                  {field.value?.includes(
                                    option.value as healthIssues
                                  ) && (
                                    <div className="absolute top-2 right-2 text-indigo-400">
                                      <CheckCircle2 size={18} />
                                    </div>
                                  )}
                                  <div className="text-white font-semibold">
                                    {option.label}
                                  </div>
                                  <div
                                    className={cn(
                                      "absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 transition-opacity",
                                      field.value?.includes(option.value as healthIssues)
                                        ? "opacity-100"
                                        : "group-hover:opacity-50"
                                    )}
                                  />
                                </div>
                              ))}
                          </div>
                        ) : (
                          <textarea
                            {...field}
                            className={cn(
                              "w-full p-4 border-2 border-gray-700 rounded-xl bg-gray-800 text-white",
                              "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800",
                              "transition-all duration-300 min-h-[120px] resize-y"
                            )}
                            placeholder="e.g., asthma, heart condition, recent surgery"
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(e.target.value || undefined)
                            }
                          />
                        )}
                      </FormControl>
                      <FormMessage className="text-red-500 mt-2 text-center" />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-700/50 border-gray-600 hover:bg-gray-600 text-white hover:text-indigo-200 transition-all"
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className={cn(
                      "flex-1 ml-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500",
                      "text-white font-medium shadow-md hover:shadow-lg transition-all duration-300",
                      "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800",
                      "flex items-center justify-center"
                    )}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {currentStep === steps.length ? "Finish" : "Next"}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
