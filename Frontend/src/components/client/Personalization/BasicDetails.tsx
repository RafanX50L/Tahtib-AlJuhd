 

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { basicDetailsSchema, type BasicDetailsForm } from "@/schemas/client/basicDetailsSchema"
import { Loader2 } from "lucide-react"
import styles from "./styles/BasicDetails.module.css"

export default function BasicDetails() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Add loading state
  const [formData, setFormData] = useState<Partial<BasicDetailsForm>>({})

  // Initialize form with saved data if available
  useEffect(() => {
    const savedData = localStorage.getItem("userBasicInfo")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as BasicDetailsForm
        setFormData(parsedData)
      } catch (error) {
        console.error("Error parsing saved data:", error)
      }
    }
    setIsLoading(false)
  }, [])

  // Replace the useForm initialization with this code to ensure formData is used properly
  const form = useForm<BasicDetailsForm>({
    resolver: zodResolver(basicDetailsSchema),
    defaultValues: {
      nick_name: "",
      age: undefined,
      gender: undefined,
      height: undefined,
      weight: undefined,
      targetWeight: undefined,
    },
  })

  // Replace the useEffect that updates form when formData changes with this improved version
  useEffect(() => {
    if (!isLoading && Object.keys(formData).length > 0) {
      // Use setTimeout to ensure this runs after initial render
      setTimeout(() => {
        for (const [key, value] of Object.entries(formData)) {
          if (value !== undefined && value !== null) {
            form.setValue(key as keyof BasicDetailsForm, value as any, {
              shouldValidate: false,
              shouldDirty: true,
              shouldTouch: false,
            })
          }
        }
      }, 0)
    }
  }, [formData, form, isLoading])

  const steps = [
    {
      field: "nick_name" as const,
      label: "Nick Name",
      placeholder: "Your name",
      type: "text",
      component: Input,
    },
    {
      field: "age" as const,
      label: "Age",
      placeholder: "Age",
      type: "number",
      component: Input,
    },
    {
      field: "gender" as const,
      label: "Gender",
      placeholder: "Select your gender",
      type: "select",
      component: Select,
      options: ["Male", "Female", "Non-binary", "Prefer not to say"] as const,
    },
    {
      field: "height" as const,
      label: "Height (cm)",
      placeholder: "Height in centimeters",
      type: "number",
      component: Input,
    },
    {
      field: "weight" as const,
      label: "Current Weight (kg)",
      placeholder: "Weight in kilograms",
      type: "number",
      component: Input,
    },
    {
      field: "targetWeight" as const,
      label: "Target Weight (optional)",
      placeholder: "Your goal weight in kg",
      type: "number",
      component: Input,
    },
  ]

  const updateFormData = () => {
    const currentField = steps[currentStep - 1].field
    const currentValue = form.getValues(currentField)
    const updatedData = {
      ...formData,
      [currentField]: currentValue,
    }
    setFormData(updatedData)

    // Save to localStorage on each step change
    localStorage.setItem("userBasicInfo", JSON.stringify(updatedData))
  }

  const handleNext = async () => {
    const currentField = steps[currentStep - 1].field
    const isValid = await form.trigger(currentField)

    if (isValid) {
      updateFormData()

      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      } else {
        const data = form.getValues()
        setIsSubmitting(true)
        try {
          localStorage.setItem("userBasicInfo", JSON.stringify(data))
          toast.success("Basic details saved successfully!")
          setTimeout(() => {
            navigate("/personalization?path=fitness-goals")
          }, 500)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
          toast.error(errorMessage)
        } finally {
          setIsSubmitting(false)
        }
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      updateFormData()
      setCurrentStep(currentStep - 1)
    }
  }

  const currentFieldConfig = steps[currentStep - 1]

  // Add this useEffect to reset the field value when changing steps
  useEffect(() => {
    // Clear any field-specific errors when changing steps
    form.clearErrors()

    // Ensure the current field has the correct value from formData
    const currentField = steps[currentStep - 1].field
    if (formData[currentField] !== undefined) {
      form.setValue(currentField, formData[currentField] as any)
    } else {
      // Reset the field if no saved value exists
      form.resetField(currentField)
    }
  }, [currentStep, form, formData])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-900 flex items-center justify-center p-4 ${styles.container}`}>
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="mb-10">
          <div className="flex justify-between mb-2 text-sm text-gray-400">
            <span>
              Step {currentStep} of {steps.length}
            </span>
            <span>{((currentStep / steps.length) * 100).toFixed(1)}%</span>
          </div>
          <div className="h-1.5 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-white">Tell us about yourself</h1>
          <p className="text-sm text-gray-400">We'll use this to personalize your perfect workout plan</p>
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
                  <FormLabel className="text-gray-400">{currentFieldConfig.label}</FormLabel>
                  <FormControl>
                    {currentFieldConfig.type === "select" ? (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value !== undefined && field.value !== null ? String(field.value) : undefined}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-indigo-500">
                          <SelectValue placeholder={currentFieldConfig.placeholder} />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 text-white border-gray-600">
                          {currentFieldConfig.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <currentFieldConfig.component
                        type={currentFieldConfig.type}
                        placeholder={currentFieldConfig.placeholder}
                        className="bg-gray-700 border-gray-600 text-white focus:ring-indigo-500"
                        disabled={isSubmitting}
                        value={field.value === undefined ? "" : String(field.value)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value =
                            currentFieldConfig.type === "number"
                              ? e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                              : e.target.value
                          field.onChange(value)
                        }}
                        onBlur={field.onBlur}
                      />
                    )}
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className={`${currentStep > 1 ? "ml-2" : ""} flex-1 bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 flex items-center justify-center`}
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
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2"
                    >
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
