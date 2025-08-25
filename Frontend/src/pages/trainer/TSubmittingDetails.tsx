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
import { useNavigate } from "react-router-dom";


// Zod Schema for Validation
const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  proof: z.instanceof(File).nullable().optional(),
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
  4: ["engagementType"],
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

  const navigate = useNavigate();
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

      // Append profile photo
      if (data.profilePhoto) {
        if (data.profilePhoto.size > maxSize) {
          throw new Error("Profile photo must be less than 5MB.");
        }
        if (!["image/jpeg", "image/png"].includes(data.profilePhoto.type)) {
          throw new Error("Profile photo must be a JPEG or PNG image.");
        }
        formData.append("profilePhoto", data.profilePhoto);
      }

      // Append certification proofs under a single field name
      data.certifications.forEach((cert) => {
        if (cert.proof) {
          if (cert.proof.size > maxSize) {
            throw new Error(`Certification proof for "${cert.name}" must be less than 5MB.`);
          }
          if (!["application/pdf", "image/jpeg", "image/png"].includes(cert.proof.type)) {
            throw new Error(
              `Certification proof for "${cert.name}" must be a PDF, JPEG, or PNG.`
            );
          }
          formData.append("certificationProofs", cert.proof);
        }
      });

      // Append resume
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
      // Do NOT append weekly availability or timezone here

      // Log FormData for debugging (optional)
      console.log("formData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Send to the backend
      const response = await TrainerService.submitTrainerApplication(formData);
      setSubmissionStatus("success");
      navigate("/trainer/pendingCases");
      location.reload();
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
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isCompleted
                  ? "bg-green-500 text-white border-green-500"
                  : isCurrent
                  ? "bg-[#6366f1] text-white border-[#6366f1]"
                  : "bg-transparent text-[#9ca3af] border-[#374151]"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            {index < steps.length - 1 && (
              <div className="w-10 h-0.5 bg-[#374151] mx-2" />)
            }
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0e17] px-4 py-10">
      <Card className="w-full max-w-5xl bg-[#0d1117] border border-[#1f2937] text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white text-center">
            Trainer Application
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RenderStepIndicator />

          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait" initial={false}>
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <BasicInfo control={control} errors={errors} watch={watch} />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProfessionalInfo control={control} errors={errors} watch={watch} setValue={setValue} />
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SampleMaterials control={control} errors={errors} watch={watch} setValue={setValue} />
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Availability control={control} errors={errors} watch={watch} setValue={setValue} />
                  <Alert className="mt-4 bg-[#0b1220] border-[#1f2a44]">
                    <AlertDescription>
                      Availability patterns are set after approval on the Set Availability page.
                      Please choose your engagement type now; you can configure weekly availability later.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-6">
              {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={submissionStatus === "submitting"}>
                  {submissionStatus === "submitting" ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>

            {submissionStatus === "error" && (
              <p className="text-red-500 mt-4">{errorMessage}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerForm;
