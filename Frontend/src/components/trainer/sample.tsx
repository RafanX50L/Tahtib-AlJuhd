
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import BasicInfo from './BasicInfo';
import ProfessionalInfo from './ProfessionalInfo';
import SampleMaterials from './SampleMaterials';
import Availability from './Availability';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Zod Schema for Validation
const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  proof: z.instanceof(File).nullable().optional(),
});

const weeklySlotSchema = z.object({
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], {
    errorMap: () => ({ message: 'Day is required' }),
  }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),+
});

const trainerFormSchema = z.object({
  phoneNumber: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  timeZone: z.string().min(1, 'Time zone is required'),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'others']).optional(),
  profilePhoto: z.instanceof(File).nullable().optional(),
  yearsOfExperience: z
    .string()
    .regex(/^\d+$/, 'Must be a number')
    .refine((val) => parseInt(val) >= 0, 'Years of experience cannot be negative'),
  certifications: z.array(certificationSchema).min(1, 'At least one certification is required'),
  specializations: z.array(z.string()).min(1, 'At least one specialization is required'),
  coachingType: z.array(z.string()).min(1, 'At least one coaching type is required'),
  platformsUsed: z.array(z.string()).optional(),
  demoVideoLink: z.string().url('Invalid URL').min(1, 'Demo video link is required'),
  portfolioLinks: z.array(z.string().url('Invalid URL').or(z.string().length(0))).optional(),
  resume: z.instanceof(File).nullable().optional(),
  weeklySlots: z.array(weeklySlotSchema).min(1, 'At least one time slot is required'),
  engagementType: z.enum(['full-time', 'part-time', 'contract', 'freelance'], {
    errorMap: () => ({ message: 'Invalid engagement type' }),
  }),
});

export type TrainerFormData = z.infer<typeof trainerFormSchema>;

// Fields to validate for each step
const stepFields: Record<number, (keyof TrainerFormData)[]> = {
  1: ['phoneNumber', 'location', 'timeZone', 'dateOfBirth', 'gender', 'profilePhoto'],
  2: ['yearsOfExperience', 'certifications', 'specializations', 'coachingType', 'platformsUsed'],
  3: ['demoVideoLink', 'portfolioLinks', 'resume'],
  4: ['weeklySlots', 'engagementType'],
};

const TrainerForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      phoneNumber: '',
      location: '',
      timeZone: '',
      dateOfBirth: '',
      gender: undefined,
      profilePhoto: null,
      yearsOfExperience: '',
      certifications: [{ name: '', issuer: '', proof: null }],
      specializations: [],
      coachingType: [],
      platformsUsed: [],
      demoVideoLink: '',
      portfolioLinks: [''],
      resume: null,
      weeklySlots: [{ day: undefined, startTime: '', endTime: '' }],
      engagementType: undefined,
    },
  });

  const stepComponents = {
    1: BasicInfo,
    2: ProfessionalInfo,
    3: SampleMaterials,
    4: Availability,
  };

  const CurrentStepComponent = stepComponents[currentStep];

  const validateStep = async () => {
    const fields = stepFields[currentStep];
    return await trigger(fields);
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: TrainerFormData) => {
    setSubmissionStatus('submitting');
    setErrorMessage(null);

    try {
      const formData = new FormData();
      // Append text fields
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('location', data.location);
      formData.append('timeZone', data.timeZone);
      if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
      if (data.gender) formData.append('gender', data.gender);
      formData.append('yearsOfExperience', data.yearsOfExperience);
      formData.append('specializations', JSON.stringify(data.specializations));
      formData.append('coachingType', JSON.stringify(data.coachingType));
      if (data.platformsUsed?.length) formData.append('platformsUsed', JSON.stringify(data.platformsUsed));
      formData.append('demoVideoLink', data.demoVideoLink);
      if (data.portfolioLinks?.length) formData.append('portfolioLinks', JSON.stringify(data.portfolioLinks));
      formData.append('engagementType', data.engagementType);
      formData.append('weeklySlots', JSON.stringify(data.weeklySlots));
      formData.append('certifications', JSON.stringify(data.certifications.map(({ proof, ...rest }) => rest)));

      // Append files
      if (data.profilePhoto) {
        formData.append('profilePhoto', data.profilePhoto);
      }
      data.certifications.forEach((cert, index) => { 
        if (cert.proof) {
          formData.append(`certificationProof_${index}`, cert.proof);
        }
      });
      if (data.resume) {
        formData.append('resume', data.resume);
      }

      // Send to backend
      const response = await fetch('/api/trainer/submit', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      setSubmissionStatus('success');
      reset(); // Reset form on success
      setCurrentStep(1); // Return to first step
    } catch (error) {
      setSubmissionStatus('error');
      setErrorMessage(error.message || 'An error occurred during submission');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#1a1a1a] rounded-lg">
      <h1 className="text-2xl font-bold text-[#f1f1f1] mb-6">Trainer Application Form</h1>
      <div className="mb-4">
        <div className="flex justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-1/4 h-2 rounded ${
                step <= currentStep ? 'bg-[#6366f1]' : 'bg-[#2c2c2c]'
              }`}
            />
          ))}
        </div>
        <p className="text-[#b0b0b0] text-sm mt-2">Step {currentStep} of 4</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <CurrentStepComponent control={control} watch={watch} setValue={setValue} errors={errors} />
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              className="bg-[#1a1a1a] border-[#2c2c2c] text-[#b0b0b0]"
            >
              Previous
            </Button>
          )}
          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="ml-auto bg-[#6366f1] hover:bg-[#818cf8] text-white"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={submissionStatus === 'submitting'}
              className="ml-auto bg-[#6366f1] hover:bg-[#818cf8] text-white"
            >
              {submissionStatus === 'submitting' ? 'Submitting...' : 'Submit'}
            </Button>
          )}
        </div>
      </form>

      {submissionStatus === 'success' && (
        <Alert className="mt-4 bg-[#1a1a1a] border-[#6366f1]">
          <AlertDescription className="text-[#f1f1f1]">
            Form submitted successfully! Thank you for your application.
          </AlertDescription>
        </Alert>
      )}
      {submissionStatus === 'error' && (
        <Alert className="mt-4 bg-[#1a1a1a] border-[#ef4444]">
          <AlertDescription className="text-[#ef4444]">{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TrainerForm;