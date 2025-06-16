// TrainerForm.jsx
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, Video, Calendar, CheckCircle } from "lucide-react";
import BasicInfo from "@/components/trainer/Registration/BasicInfo";
import ProfessionalInfo from "@/components/trainer/Registration/ProfessionalInfo";
import SampleMaterials from "@/components/trainer/Registration/SampleMaterials";
import Availability from "@/components/trainer/Registration/Availability";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { platform } from "os";
import { TrainerService } from "@/services/implementation/trainerServices";
import moment from "moment-timezone";


// Zod Schema for Validation
const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  proof: z.instanceof(File).nullable().optional(),
});

const weeklySlotSchema = z.object({
  day: z.enum(
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    {
      errorMap: () => ({ message: "Day is required" }),
    }
  ),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
});

const trainerFormSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  timeZone: z
    .string()
    .min(1, "Time zone is required")
    .refine((val) => moment.tz.zone(val) !== null, {
      message: "Invalid time zone selected",
    }),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "others"]).optional(),
  profilePhoto: z.instanceof(File).nullable().optional(),
  yearsOfExperience: z
    .string()
    .regex(/^\d+$/, "Must be a number")
    .refine(
      (val) => parseInt(val) >= 0,
      "Years of experience cannot be negative"
    ),
  certifications: z
    .array(certificationSchema)
    .min(1, "At least one certification is required"),
  specializations: z
    .array(z.string())
    .min(1, "At least one specialization is required"),
  coachingType: z
    .array(z.string())
    .min(1, "At least one coaching type is required"),
  platformsUsed: z.array(z.string()).optional(),
  demoVideoLink: z
    .string()
    .url("Invalid URL")
    .min(1, "Demo video link is required"),
  portfolioLinks: z
    .array(z.string().url("Invalid URL").or(z.string().length(0)))
    .optional(),
  resume: z.instanceof(File).nullable().optional(),
  weeklySlots: z
    .array(weeklySlotSchema)
    .min(1, "At least one time slot is required"),
  engagementType: z.enum(["full-time", "part-time", "contract", "freelance"], {
    errorMap: () => ({ message: "Engagement type is required" }),
  }),
});

// TypeScript Interface
export type TrainerFormData = z.infer<typeof trainerFormSchema>;

// Fields to validate for each step
const stepFields: Record<number, (keyof TrainerFormData)[]> = {
  1: [
    "phoneNumber",
    "location",
    "timeZone",
    "dateOfBirth",
    "gender",
    "profilePhoto",
  ],
  2: [
    "yearsOfExperience",
    "certifications",
    "specializations",
    "coachingType",
    "platformsUsed",
  ],
  3: ["demoVideoLink", "portfolioLinks", "resume"],
  4: ["weeklySlots", "engagementType"],
};

const TrainerForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
    trigger,
  } = useForm<TrainerFormData>({
    resolver: zodResolver(trainerFormSchema),
    defaultValues: {
      phoneNumber: "",
      location: "",
      timeZone: "",
      dateOfBirth: "",
      gender: undefined,
      profilePhoto: null,
      yearsOfExperience: "",
      certifications: [{ name: "", issuer: "", proof: null }],
      specializations: [],
      coachingType: [],
      platformsUsed: [],
      demoVideoLink: "",
      portfolioLinks: [""],
      resume: null,
      weeklySlots: [{ day: undefined, startTime: "", endTime: "" }],
      engagementType: undefined,
    },
  });

  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [direction, setDirection] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const steps = [
    { id: 1, title: "Basic Info", icon: User },
    { id: 2, title: "Professional", icon: Briefcase },
    { id: 3, title: "Materials", icon: Video },
    { id: 4, title: "Availability", icon: Calendar },
  ];

  const nextStep = useCallback(async () => {
    const isValid = await trigger(stepFields[currentStep]);
    if (isValid && currentStep < 4) {
      setCompletedSteps([...completedSteps, currentStep]);
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  }, [trigger, currentStep, completedSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const onSubmit = async (data: TrainerFormData) => {
    setSubmissionStatus("submitting");
    setErrorMessage(null);

    try {
      // Validate required fields
      if (!data.phoneNumber || !data.location || !data.specializations.length) {
        throw new Error(
          "Required fields are missing: phoneNumber, location, and specializations are mandatory."
        );
      }

      const formData = new FormData();

      // File validation
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (data.profilePhoto) {
        if (data.profilePhoto.size > maxSize) {
          throw new Error("Profile photo must be less than 5MB.");
        }
        if (!["image/jpeg", "image/png"].includes(data.profilePhoto.type)) {
          throw new Error("Profile photo must be a JPEG or PNG image.");
        }
        formData.append("profilePhoto", data.profilePhoto);
      }
      data.certifications.forEach((cert, index) => {
        if (cert.proof) {
          if (cert.proof.size > maxSize) {
            throw new Error(
              `Certification proof ${index + 1} must be less than 5MB.`
            );
          }
          if (
            !["application/pdf", "image/jpeg", "image/png"].includes(
              cert.proof.type
            )
          ) {
            throw new Error(
              `Certification proof ${index + 1} must be a PDF, JPEG, or PNG.`
            );
          }
          formData.append(`certificationProof_${index}`, cert.proof);
        }
      });
      if (data.resume) {
        if (data.resume.size > maxSize) {
          throw new Error("Resume must be less than 5MB.");
        }
        formData.append("resume", data.resume);
      }

      // Append text fields
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("location", data.location);
      formData.append("timeZone", data.timeZone);
      if (data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth);
      if (data.gender) formData.append("gender", data.gender);
      formData.append("yearsOfExperience", String(data.yearsOfExperience));
      formData.append("specializations", JSON.stringify(data.specializations));
      formData.append("coachingType", JSON.stringify(data.coachingType));
      if (data.platformsUsed?.length)
        formData.append("platformsUsed", JSON.stringify(data.platformsUsed));
      formData.append("demoVideoLink", data.demoVideoLink);
      if (data.portfolioLinks?.length)
        formData.append("portfolioLinks", JSON.stringify(data.portfolioLinks));
      formData.append("engagementType", data.engagementType);
      formData.append("weeklySlots", JSON.stringify(data.weeklySlots));
      formData.append(
        "certifications",
        JSON.stringify(
          data.certifications.map((cert, index) => ({
            ...cert,
            proofFileName: cert.proof ? `certificationProof_${index}` : null,
          }))
        )
      );

      // Log FormData for debugging
      console.log("formData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Send to the backend
      const response = await TrainerService.submitTrainerApplication(formData);
      // if (!response.ok) {
      //   throw new Error(response.data.message || "Submission Failed");
      // }

      setSubmissionStatus("success");
      reset();
      setCurrentStep(1);
    } catch (error: any) {
      setSubmissionStatus("error");
      setErrorMessage(error.message || "An error occurred during submission");
    }
  };

  const RenderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;

        return (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                isCompleted
                  ? "bg-green-500 border-green-500 text-white"
                  : isCurrent
                    ? "bg-[#6366f1] border-[#6366f1] text-white"
                    : "border-[#2c2c2c] text-[#666]"
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <Icon className="w-6 h-6" />
              )}
            </div>
            <div className="ml-3">
              <div
                className={`text-sm font-medium ${
                  isCurrent
                    ? "text-[#6366f1]"
                    : isCompleted
                      ? "text-green-500"
                      : "text-[#666]"
                }`}
              >
                {step.title}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 ${isCompleted ? "bg-green-500" : "bg-[#2c2c2c]"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const variants = {
    enter: { x: direction * 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: direction * -300, opacity: 0 },
  };

  const stepComponents = {
    1: BasicInfo,
    2: ProfessionalInfo,
    3: SampleMaterials,
    4: Availability,
  } as const;

  const CurrentStepComponent =
    stepComponents[currentStep as keyof typeof stepComponents] || BasicInfo;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f1f1f1]">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto bg-[#121212] border-[#2c2c2c]">
          <CardHeader className="text-center border-b border-[#2c2c2c]">
            <CardTitle className="text-3xl font-bold text-[#6366f1] mb-2">
              Trainer Registration
            </CardTitle>
            <p className="text-[#b0b0b0] text-lg">
              Join our platform and start inspiring fitness journeys
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <RenderStepIndicator />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`step-${currentStep}`}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <CurrentStepComponent
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    errors={errors}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between pt-6 border-t border-[#2c2c2c]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="bg-[#1a1a1a] border-[#2c2c2c] text-[#b0b0b0] hover:bg-[#2c2c2c] hover:text-[#f1f1f1] disabled:opacity-50"
                >
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-[#6366f1] hover:bg-[#818cf8] text-white"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={submissionStatus === "submitting"}
                    className="bg-[#10b981] hover:bg-[#059669] text-white disabled:opacity-50"
                  >
                    {submissionStatus === "submitting" ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                )}
              </div>
            </form>

            {submissionStatus === "success" && (
              <Alert className="mt-4 bg-[#1a1a1a] border-[#6366f1]">
                <AlertDescription className="text-[#f1f1f1]">
                  Form submitted successfully! Thank you for your application.
                </AlertDescription>
              </Alert>
            )}
            {submissionStatus === "error" && (
              <Alert className="mt-4 bg-[#1a1a1a] border-[#ef4444]">
                <AlertDescription className="text-[#ef4444]">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainerForm;
