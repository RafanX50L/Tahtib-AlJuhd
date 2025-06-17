 
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Loader2, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { FitnessGoalsForm, fitnessGoalsSchema } from "@/schemas/client/basicDetailsSchema"

export default function FitnessGoals() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<FitnessGoalsForm>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [animationDirection, setAnimationDirection] = useState<"forward" | "backward">("forward")

  // Initialize form with saved data if available
  useEffect(() => {
    try {
      const savedGoalData = localStorage.getItem("fitnessGoal")
      const savedFitnessLevel = localStorage.getItem("fitnessLevel")
      const savedActivityLevel = localStorage.getItem("activityLevel")

      const parsedData: Partial<FitnessGoalsForm> = {}

      if (savedGoalData) {
        const parsed = JSON.parse(savedGoalData)
        if (parsed && parsed.goal) {
          parsedData.fitnessGoal = parsed.goal
        }
      }

      if (savedFitnessLevel && fitnessGoalsSchema.shape.fitnessLevel.safeParse(savedFitnessLevel).success) {
        parsedData.fitnessLevel = savedFitnessLevel as any
      }

      if (savedActivityLevel && fitnessGoalsSchema.shape.activityLevel.safeParse(savedActivityLevel).success) {
        parsedData.activityLevel = savedActivityLevel as any
      }

      setFormData(parsedData)
    } catch (error) {
      console.error("Error loading saved data:", error)
    }
  }, [])

  const form = useForm<FitnessGoalsForm>({
    resolver: zodResolver(fitnessGoalsSchema),
    defaultValues: {
      fitnessGoal: undefined,
      fitnessLevel: undefined,
      activityLevel: undefined,
    },
    mode: "onChange",
  })

  // Update form when formData changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof FitnessGoalsForm, value as any, {
            shouldValidate: false,
            shouldDirty: true,
            shouldTouch: true,
          })
        }
      })
    }
  }, [formData, form])

  // Set selected option when step changes
  useEffect(() => {
    const currentField = steps[currentStep - 1].field
    const currentValue = form.getValues(currentField)
    setSelectedOption(currentValue || null)
  }, [currentStep, form])

  const steps = [
    {
      field: "fitnessGoal" as const,
      label: "Choose Your Fitness Goal",
      description: "This helps us create the perfect workout plan for you",
      type: "card",
      options: [
        { value: "muscle", icon: "💪", label: "Build Muscle", description: "Increase muscle mass and definition" },
        { value: "weight-loss", icon: "⚖️", label: "Lose Weight", description: "Burn fat and reduce body weight" },
        { value: "strength", icon: "🏋️", label: "Get Stronger", description: "Increase overall strength" },
        {
          value: "endurance",
          icon: "🏃",
          label: "Improve Endurance",
          description: "Better stamina and cardiovascular health",
        },
        { value: "tone", icon: "👙", label: "Tone Body", description: "Define muscles without bulking up" },
        {
          value: "flexibility",
          icon: "🧘",
          label: "Increase Flexibility",
          description: "Improve range of motion and mobility",
        },
      ],
    },
    {
      field: "fitnessLevel" as const,
      label: "Your Current Fitness Level",
      description: "Help us tailor the perfect workout intensity for you",
      type: "card",
      options: [
        { value: "beginner", icon: "🌱", label: "Beginner", description: "Just starting my fitness journey" },
        { value: "intermediate", icon: "⚡", label: "Intermediate", description: "Some regular workout experience" },
        { value: "advanced", icon: "🔥", label: "Advanced", description: "Consistently workout 4+ times/week" },
        { value: "athlete", icon: "🏆", label: "Athlete", description: "Competitive or professional training" },
      ],
    },
    {
      field: "activityLevel" as const,
      label: "Your Daily Activity Level",
      description: "This helps us calculate your calorie needs accurately",
      type: "card",
      options: [
        {
          value: "sedentary",
          icon: "💺",
          label: "Sedentary",
          description: "Mostly sitting (office job, little exercise)",
        },
        { value: "lightly", icon: "🚶", label: "Lightly Active", description: "Light exercise 1-3 days/week" },
        {
          value: "moderate",
          icon: "🏃",
          label: "Moderately Active",
          description: "Exercise 3-5 days/week + some movement",
        },
        { value: "very", icon: "⚡", label: "Very Active", description: "Physical job or hard exercise 6-7 days/week" },
      ],
    },
  ]

  // Save current field value to formData when moving between steps
  const updateFormData = () => {
    const currentField = steps[currentStep - 1].field
    const currentValue = form.getValues(currentField)
    setFormData((prev) => ({
      ...prev,
      [currentField]: currentValue,
    }))
  }

  const handleNext = async () => {
    const currentField = steps[currentStep - 1].field
    const isValid = await form.trigger(currentField)

    if (isValid) {
      updateFormData()

      if (currentStep < steps.length) {
        setAnimationDirection("forward")
        setCurrentStep(currentStep + 1)
      } else {
        const data = form.getValues()
        setIsSubmitting(true)
        try {
          localStorage.setItem(
            "fitnessGoal",
            JSON.stringify({ goal: data.fitnessGoal, timestamp: new Date().toISOString() }),
          )
          localStorage.setItem("fitnessLevel", data.fitnessLevel)
          localStorage.setItem("activityLevel", data.activityLevel)
          toast.success("Fitness goals and level saved successfully!")
          setTimeout(() => {
            navigate("/personalization?path=workout-preferences")
          }, 500)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
          toast.error(errorMessage)
        } finally {
          setIsSubmitting(false)
        }
      }
    } else {
      toast.error("Please select an option to continue")
    }
  }

  const handleBack = () => {
    updateFormData()
    setAnimationDirection("backward")

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate("/personalization?path=basic-details")
    }
  }

  const currentFieldConfig = steps[currentStep - 1]
  const currentValue = form.watch(currentFieldConfig.field)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm text-gray-400">
            <span>
              Step {currentStep + 1} of {steps.length + 1}
            </span>
            <span>{(((currentStep + 1) / (steps.length + 1)) * 100).toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / (steps.length + 1)) * 100}%` }}
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
              <p className="text-sm text-gray-400 mt-2">{currentFieldConfig.description}</p>
            </div>

            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleNext()
                }}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name={currentFieldConfig.field}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-400 sr-only">{currentFieldConfig.label}</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {currentFieldConfig.options.map((option) => (
                            <div
                              key={option.value}
                              className={cn(
                                "relative border-2 rounded-xl p-5 text-center cursor-pointer transition-all duration-300",
                                "hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20",
                                "group overflow-hidden",
                                field.value === option.value
                                  ? "border-indigo-500 bg-gray-700/70 shadow-lg shadow-indigo-500/10"
                                  : "border-gray-700 bg-gray-800/50",
                              )}
                              onClick={() => {
                                field.onChange(option.value)
                                setSelectedOption(option.value)
                              }}
                            >
                              {field.value === option.value && (
                                <div className="absolute top-2 right-2 text-indigo-400">
                                  <CheckCircle2 size={18} />
                                </div>
                              )}
                              <div className="text-3xl mb-3 transform transition-transform group-hover:scale-110">
                                {option.icon}
                              </div>
                              <div className="text-white font-semibold mb-1">{option.label}</div>
                              {option.description && <div className="text-xs text-gray-400">{option.description}</div>}
                              <div
                                className={cn(
                                  "absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 transition-opacity",
                                  field.value === option.value ? "opacity-100" : "group-hover:opacity-50",
                                )}
                              />
                            </div>
                          ))}
                        </div>
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
                      "flex items-center justify-center",
                    )}
                    disabled={isSubmitting || !currentValue}
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
  )
}
