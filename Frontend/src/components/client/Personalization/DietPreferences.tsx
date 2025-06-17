 

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
const dietPreferencesSchema = z.object({
  allergies: z.array(z.enum(["none", "nuts", "dairy", "shellfish", "gluten"])).refine(
    (val) => !(val.includes("none") && val.length > 1),
    { message: "Cannot select 'None' with other allergies" }
  ),
  dietaryPreferences: z.array(z.enum(["none", "vegetarian", "vegan", "gluten-free"])).refine(
    (val) => !(val.includes("none") && val.length > 1),
    { message: "Cannot select 'No Preference' with other dietary preferences" }
  ),
  mealsPerDay: z.enum(["3", "4", "5", "6"]).optional(),
})

type DietPreferencesForm = z.infer<typeof dietPreferencesSchema>

export default function DietPreferences() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<"forward" | "backward">("forward")
  const [formData, setFormData] = useState<Partial<DietPreferencesForm>>({})

  // Define steps for multi-slide form
  const steps = [
    {
      field: "allergies" as const,
      label: "Do You Have Any Allergies?",
      description: "Select any food allergies to customize your meal plan",
      type: "card",
      options: [
        { value: "none", label: "None" },
        { value: "nuts", label: "Nuts" },
        { value: "dairy", label: "Dairy" },
        { value: "shellfish", label: "Shellfish" },
        { value: "gluten", label: "Gluten" },
      ],
    },
    {
      field: "dietaryPreferences" as const,
      label: "What Are Your Dietary Preferences?",
      description: "Choose your dietary preferences for your meal plan",
      type: "card",
      options: [
        { value: "none", label: "No Preference" },
        { value: "vegetarian", label: "Vegetarian" },
        { value: "vegan", label: "Vegan" },
        { value: "gluten-free", label: "Gluten-Free" },
      ],
    },
    {
      field: "mealsPerDay" as const,
      label: "How Many Meals Per Day?",
      description: "Select your preferred number of daily meals",
      type: "card",
      options: [
        { value: "3", label: "3 Meals" },
        { value: "4", label: "3 Meals + 1 Snack" },
        { value: "5", label: "3 Meals + 2 Snacks" },
        { value: "6", label: "6 Meals" },
      ],
    },
  ]

  // Initialize form
  const form = useForm<DietPreferencesForm>({
    resolver: zodResolver(dietPreferencesSchema),
    defaultValues: {
      allergies: [],
      dietaryPreferences: [],
      mealsPerDay: undefined,
    },
    mode: "onChange",
  })

  // Load saved preferences
  useEffect(() => {
    try {
      const savedDietPrefs = localStorage.getItem("dietPreferences")
      if (savedDietPrefs) {
        const parsed = JSON.parse(savedDietPrefs)
        const parsedData: Partial<DietPreferencesForm> = {}
        if (parsed.allergies) parsedData.allergies = parsed.allergies
        if (parsed.dietaryPreferences) parsedData.dietaryPreferences = parsed.dietaryPreferences
        if (parsed.mealsPerDay) parsedData.mealsPerDay = parsed.mealsPerDay
        setFormData(parsedData)
      }
    } catch (error) {
      console.error("Error loading saved diet preferences:", error)
    }
  }, [])

  // Update form with saved data
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof DietPreferencesForm, value as any, {
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

  const handleSelectionToggle = (fieldName: "allergies" | "dietaryPreferences", value: string) => {
    const currentValues = form.getValues(fieldName) || []
    if (value === "none") {
      if (!currentValues.includes("none")) {
        form.setValue(fieldName, ["none"], { shouldValidate: true })
      } else {
        form.setValue(fieldName, [], { shouldValidate: true })
      }
    } else {
      if (currentValues.includes("none")) {
        form.setValue(fieldName, [value], { shouldValidate: true })
      } else {
        if (currentValues.includes(value)) {
          form.setValue(fieldName, currentValues.filter((item) => item !== value), { shouldValidate: true })
        } else {
          form.setValue(fieldName, [...currentValues, value], { shouldValidate: true })
        }
      }
    }
  }

  const handleMealsToggle = (value: string) => {
    form.setValue("mealsPerDay", value as any, { shouldValidate: true })
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
            "dietPreferences",
            JSON.stringify({
              allergies: data.allergies,
              dietaryPreferences: data.dietaryPreferences,
              mealsPerDay: data.mealsPerDay,
              timestamp: new Date().toISOString(),
            })
          )
          toast.success("Diet preferences saved successfully!")
          setTimeout(() => {
            navigate("/personalization?path=summary")
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
      navigate("/personalization?path=health-consideration")
    }
  }

  const currentFieldConfig = steps[currentStep - 1]
  const currentValue = form.watch(currentFieldConfig.field)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-700">
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm text-gray-400">
            <span>Step {currentStep + 5} of 8</span>
            <span>{(((currentStep + 5) / 8) * 100).toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
              style={{ width: `${((currentStep + 5) / 8) * 100}%` }}
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
                        <div className={cn(
                          "grid gap-4",
                          currentFieldConfig.field !== "mealsPerDay" && field.value?.includes("none") ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
                        )}>
                          {currentFieldConfig.options.map((option) => (
                            <div
                              key={option.value}
                              className={cn(
                                "relative border-2 rounded-xl p-5 text-center cursor-pointer transition-all duration-300",
                                "hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20",
                                "group overflow-hidden",
                                option.value === "none" && currentFieldConfig.field !== "mealsPerDay" ? "sm:col-span-2" : "",
                                currentFieldConfig.field === "mealsPerDay"
                                  ? field.value === option.value
                                    ? "border-indigo-500 bg-gray-700/70 shadow-lg shadow-indigo-500/10"
                                    : "border-gray-700 bg-gray-800/50"
                                  : field.value?.includes(option.value as any)
                                    ? "border-indigo-500 bg-gray-700/70 shadow-lg shadow-indigo-500/10"
                                    : "border-gray-700 bg-gray-800/50"
                              )}
                              onClick={() =>
                                currentFieldConfig.field === "mealsPerDay"
                                  ? handleMealsToggle(option.value)
                                  : handleSelectionToggle(currentFieldConfig.field as "allergies" | "dietaryPreferences", option.value)
                              }
                            >
                              {(currentFieldConfig.field === "mealsPerDay" ? field.value === option.value : field.value?.includes(option.value as any)) && (
                                <div className="absolute top-2 right-2 text-indigo-400">
                                  <CheckCircle2 size={18} />
                                </div>
                              )}
                              <div className="text-white font-semibold">{option.label}</div>
                              <div
                                className={cn(
                                  "absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 transition-opacity",
                                  currentFieldConfig.field === "mealsPerDay"
                                    ? field.value === option.value
                                      ? "opacity-100"
                                      : "group-hover:opacity-50"
                                    : field.value?.includes(option.value as any)
                                      ? "opacity-100"
                                      : "group-hover:opacity-50"
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
                      "flex items-center justify-center"
                    )}
                    disabled={isSubmitting || !currentValue || (Array.isArray(currentValue) && currentValue.length === 0)}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {currentStep === steps.length ? "Get My Plan" : "Next"}
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