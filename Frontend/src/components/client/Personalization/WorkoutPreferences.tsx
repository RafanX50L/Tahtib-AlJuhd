"use client"

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
import { z } from "zod"

// Define schema for form validation
const workoutPreferencesSchema = z.object({
  equipment: z.array(z.enum(["bodyweight", "dumbbells", "bands", "kettlebells", "pullup", "yoga"])).min(1, "Select at least one equipment type"),
  duration: z.enum(["15-30", "30-45", "45-60", "60+"]).optional(),
  daysPerWeek: z.number().min(1, "Must be at least 1 day").max(7, "Cannot exceed 7 days").optional(),
})

type WorkoutPreferencesForm = z.infer<typeof workoutPreferencesSchema>

export default function WorkoutPreferences() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<"forward" | "backward">("forward")
  const [formData, setFormData] = useState<Partial<WorkoutPreferencesForm>>({})

  // Define steps for multi-slide form
  const steps = [
    {
      field: "equipment" as const,
      label: "What equipment do you have?",
      description: "Select all equipment you have access to",
      type: "card",
      options: [
        { value: "bodyweight", icon: "👤", label: "Bodyweight Only" },
        { value: "dumbbells", icon: "🏋️", label: "Dumbbells" },
        { value: "bands", icon: "🧵", label: "Resistance Bands" },
        { value: "kettlebells", icon: "⛓️", label: "Kettlebells" },
        { value: "pullup", icon: "🔼", label: "Pull-up Bar" },
        { value: "yoga", icon: "🧘", label: "Yoga Mat" },
      ],
    },
    {
      field: "duration" as const,
      label: "Preferred Workout Duration",
      description: "Choose how long you want your workouts to be",
      type: "select",
      options: [
        { value: "15-30", label: "15-30 minutes" },
        { value: "30-45", label: "30-45 minutes" },
        { value: "45-60", label: "45-60 minutes" },
        { value: "60+", label: "60+ minutes" },
      ],
    },
    {
      field: "daysPerWeek" as const,
      label: "Workout Days Per Week",
      description: "How many days can you commit to working out?",
      type: "input",
    },
  ]

  // Initialize form
  const form = useForm<WorkoutPreferencesForm>({
    resolver: zodResolver(workoutPreferencesSchema),
    defaultValues: {
      equipment: [],
      duration: undefined,
      daysPerWeek: undefined,
    },
    mode: "onChange",
  })

  // Load saved preferences
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem("workoutPreferences")
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs)
        const parsedData: Partial<WorkoutPreferencesForm> = {}
        if (parsed.equipment) parsedData.equipment = parsed.equipment
        if (parsed.duration) parsedData.duration = parsed.duration
        if (parsed.daysPerWeek) parsedData.daysPerWeek = parseInt(parsed.daysPerWeek)
        setFormData(parsedData)
      }
    } catch (error) {
      console.error("Error loading saved preferences:", error)
    }
  }, [])

  // Update form with saved data
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof WorkoutPreferencesForm, value as any, {
            shouldValidate: false,
            shouldDirty: true,
            shouldTouch: true,
          })
        }
      })
    }
  }, [formData, form])

  // Save current field value to formData
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
            "workoutPreferences",
            JSON.stringify({
              equipment: data.equipment,
              duration: data.duration,
              daysPerWeek: data.daysPerWeek,
              timestamp: new Date().toISOString(),
            })
          )
          toast.success("Workout preferences saved successfully!")
          setTimeout(() => {
            navigate("/personalization?path=health-consideration")
          }, 500)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
          toast.error(errorMessage)
        } finally {
          setIsSubmitting(false)
        }
      }
    } else {
      toast.error("Please complete the current step to continue")
    }
  }

  const handleBack = () => {
    updateFormData()
    setAnimationDirection("backward")
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate("/personalization?path=fitness-goals")
    }
  }

  const currentFieldConfig = steps[currentStep - 1]
  const currentValue = form.watch(currentFieldConfig.field)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm text-gray-400">
            <span>Step {currentStep + 3} of 6</span>
            <span>{(((currentStep + 3) / 6) * 100).toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
              style={{ width: `${((currentStep + 3) / 6) * 100}%` }}
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
                        {currentFieldConfig.type === "card" ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currentFieldConfig.options.map((option) => (
                              <div
                                key={option.value}
                                className={cn(
                                  "relative border-2 rounded-xl p-5 text-center cursor-pointer transition-all duration-300",
                                  "hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20",
                                  "group overflow-hidden",
                                  field.value?.includes(option.value as any)
                                    ? "border-indigo-500 bg-gray-700/70 shadow-lg shadow-indigo-500/10"
                                    : "border-gray-700 bg-gray-800/50"
                                )}
                                onClick={() => {
                                  const currentEquipment = field.value || []
                                  if (currentEquipment.includes(option.value as any)) {
                                    field.onChange(currentEquipment.filter((item) => item !== option.value))
                                  } else {
                                    field.onChange([...currentEquipment, option.value])
                                  }
                                }}
                              >
                                {field.value?.includes(option.value as any) && (
                                  <div className="absolute top-2 right-2 text-indigo-400">
                                    <CheckCircle2 size={18} />
                                  </div>
                                )}
                                <div className="text-3xl mb-3 transform transition-transform group-hover:scale-110">
                                  {option.icon}
                                </div>
                                <div className="text-white font-semibold mb-1">{option.label}</div>
                                <div
                                  className={cn(
                                    "absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 transition-opacity",
                                    field.value?.includes(option.value as any) ? "opacity-100" : "group-hover:opacity-50"
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                        ) : currentFieldConfig.type === "select" ? (
                          <select
                            {...field}
                            className={cn(
                              "w-full p-4 border-2 border-gray-700 rounded-xl bg-gray-800 text-white",
                              "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800",
                              "transition-all duration-300"
                            )}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value || undefined)}
                          >
                            <option value="" disabled>
                              Select duration
                            </option>
                            {currentFieldConfig.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="number"
                            {...field}
                            className={cn(
                              "w-full p-4 border-2 border-gray-700 rounded-xl bg-gray-800 text-white",
                              "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800",
                              "transition-all duration-300"
                            )}
                            placeholder="e.g., 3"
                            min={1}
                            max={7}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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