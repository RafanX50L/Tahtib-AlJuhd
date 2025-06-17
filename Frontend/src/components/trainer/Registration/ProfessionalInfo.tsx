import { useCallback } from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X, Briefcase, FileText } from 'lucide-react';
import { TrainerFormData } from '@/pages/trainer/TSubmittingDetails'; // Adjust import path based on your project structure

interface ProfessionalInfoProps {
  control: Control<TrainerFormData>;
  watch: UseFormWatch<TrainerFormData>;
  setValue: UseFormSetValue<TrainerFormData>;
  errors: FieldErrors<TrainerFormData>;
}

const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({ control, watch, setValue, errors }) => {
  const addCertification = useCallback(() => {
    const currentCertifications = watch('certifications');
    setValue('certifications', [...currentCertifications, { name: '', issuer: '', proof: null }]);
  }, [watch, setValue]);

  const removeCertification = useCallback(
    (index: number) => {
      const currentCertifications = watch('certifications');
      setValue('certifications', currentCertifications.filter((_, i) => i !== index));
    },
    [watch, setValue],
  );
  

  // Updated toggle function to add or remove values
  const toggleArrayValue = useCallback(
    (fieldName: keyof Pick<TrainerFormData, 'specializations' | 'coachingType' | 'platformsUsed'>, value: string) => {
      const currentValues = watch(fieldName) as string[];
      if (currentValues.includes(value)) {
        // If value exists, remove it
        setValue(
          fieldName,
          currentValues.filter((item) => item !== value),
          { shouldValidate: true }
        );
      } else {
        // If value doesn't exist, add it
        setValue(fieldName, [...currentValues, value], { shouldValidate: true });
      }
    },
    [watch, setValue],
  );

  const removeFromArray = useCallback(
    (fieldName: keyof Pick<TrainerFormData, 'specializations' | 'coachingType' | 'platformsUsed'>, index: number) => {
      const currentValues = watch(fieldName) as string[];
      setValue(fieldName, currentValues.filter((_, i) => i !== index), { shouldValidate: true });
    },
    [watch, setValue],
  );

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="yearsOfExperience" className="text-[#b0b0b0] flex items-center gap-2">
          <Briefcase className="w-4 h-4" /> Years of Experience *
        </Label>
        <Controller
          name="yearsOfExperience"
          control={control}
          render={({ field }) => (
            <div>
              <Input
                {...field}
                id="yearsOfExperience"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g., 5"
                className="bg-[#1a1a1a] border-[#2c2c2c] text-[#f1f1f1] focus:border-[#6366f1] focus:ring-[#6366f1]/20"
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numeric input
                  if (/^\d*$/.test(value)) {
                    field.onChange(value);
                  }
                }}
              />
              {errors.yearsOfExperience && (
                <p className="text-[#ef4444] text-sm mt-1">{errors.yearsOfExperience.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <div>
        <Label className="text-[#b0b0b0] mb-4 block">Certifications *</Label>
        <div className="space-y-4">
          {watch('certifications').map((cert, index) => (
            <div key={`cert-${index}`} className="bg-[#1a1a1a] border border-[#2c2c2c] p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[#f1f1f1] font-medium">Certification {index + 1}</h4>
                {watch('certifications').length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCertification(index)}
                    className="text-[#ef4444] hover:text-[#ef4444] hover:bg-[#ef4444]/10"
                    aria-label={`Remove certification ${index + 1}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`certifications[${index}].name`} className="text-[#b0b0b0]">
                    Name *
                  </Label>
                  <Controller
                    name={`certifications[${index}].name` as `certifications.${number}.name`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          value={typeof field.value === 'string' ? field.value : ''}
                          id={`certifications[${index}].name`}
                          placeholder="e.g., Certified Personal Trainer"
                          className="bg-[#121212] border-[#2c2c2c] text-[#f1f1f1] focus:border-[#6366f1] focus:ring-[#6366f1]/20"
                        />
                        {errors.certifications?.[index]?.name && (
                          <p className="text-[#ef4444] text-sm mt-1">
                            {errors.certifications[index].name.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor={`certifications[${index}].issuer`} className="text-[#b0b0b0]">
                    Issuer *
                  </Label>
                  <Controller
                    name={`certifications[${index}].issuer` as `certifications.${number}.issuer`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          id={`certifications[${index}].issuer`}
                          placeholder="e.g., ACSM, NASM"
                          className="bg-[#121212] border-[#2c2c2c] text-[#f1f1f1] focus:border-[#6366f1] focus:ring-[#6366f1]/20"
                        />
                        {errors.certifications?.[index]?.issuer && (
                          <p className="text-[#ef4444] text-sm mt-1">
                            {errors.certifications[index].issuer.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor={`certifications[${index}].proof`} className="text-[#b0b0b0]">
                  Proof Document
                </Label>
                <Controller
                  name={`certifications[${index}].proof` as any}
                  control={control}
                  render={({ field }) => (
                    <div>
                      {field.value ? (
                        <div className="flex items-center justify-between bg-[#121212] border border-[#2c2c2c] p-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#6366f1]" />
                            <span className="text-[#f1f1f1] text-sm truncate max-w-[200px]">
                              {field.value instanceof File ? field.value.name : ''}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => field.onChange(null)}
                            className="text-[#ef4444] hover:bg-[#ef4444]/10"
                            aria-label={`Remove proof for certification ${index + 1}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Input
                          id={`certifications[${index}].proof`}
                          type="file"
                          onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                          accept="image/*,application/pdf"
                          className="bg-[#121212] border-[#2c2c2c] text-[#f1f1f1] focus:border-[#6366f1] focus:ring-[#6366f1]/20"
                        />
                      )}
                      {errors.certifications?.[index]?.proof && (
                        <p className="text-[#ef4444] text-sm mt-1">
                          {errors.certifications[index].proof.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addCertification}
            className="bg-[#1a1a1a] border-[#2c2c2c] text-[#6366f1] hover:bg-[#6366f1]/10 hover:text-[#6366f1] border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Certification
          </Button>
        </div>
        {errors.certifications && (
          <p className="text-[#ef4444] text-sm mt-1">{errors.certifications.message}</p>
        )}
      </div>

      <div>
        <Label className="text-[#b0b0b0] mb-2 block">Specializations *</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {['Yoga', 'Strength Training', 'Cardio', 'Pilates', 'CrossFit', 'Nutrition', 'Weight Loss', 'Rehabilitation'].map(
            (spec) => (
              <Button
                key={spec}
                type="button"
                variant={watch('specializations').includes(spec) ? 'default' : 'outline'}
                onClick={() => toggleArrayValue('specializations', spec)} // Updated to use toggleArrayValue
                className={`text-xs ${
                  watch('specializations').includes(spec)
                    ? 'bg-[#6366f1] text-white hover:bg-[#818cf8]'
                    : 'bg-[#1a1a1a] border-[#2c2c2c] text-[#b0b0b0] hover:bg-[#6366f1]/10 hover:text-[#6366f1] hover:border-[#6366f1]'
                }`}
              >
                {spec}
              </Button>
            ),
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {watch('specializations').map((spec, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-[#6366f1]/20 text-[#6366f1] px-3 py-1 rounded-full text-sm"
            >
              {spec}
              <button
                type="button"
                onClick={() => removeFromArray('specializations', index)}
                className="text-[#6366f1] hover:text-[#818cf8]"
                aria-label={`Remove specialization ${spec}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        {errors.specializations && (
          <p className="text-[#ef4444] text-sm mt-1">{errors.specializations.message}</p>
        )}
      </div>

      <div>
        <Label className="text-[#b0b0b0] mb-2 block">Coaching Type *</Label>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['One-on-One', 'Group', 'Hybrid'].map((type) => (
            <Button
              key={type}
              type="button"
              variant={watch('coachingType').includes(type) ? 'default' : 'outline'}
              onClick={() => toggleArrayValue('coachingType', type)} // Updated to use toggleArrayValue
              className={`${
                watch('coachingType').includes(type)
                  ? 'bg-[#6366f1] text-white hover:bg-[#818cf8]'
                  : 'bg-[#1a1a1a] border-[#2c2c2c] text-[#b0b0b0] hover:bg-[#6366f1]/10 hover:text-[#6366f1] hover:border-[#6366f1]'
              }`}
            >
              {type}
            </Button>
          ))}
        </div>
        {errors.coachingType && <p className="text-[#ef4444] text-sm mt-1">{errors.coachingType.message}</p>}
      </div>

      <div>
        <Label className="text-[#b0b0b0] mb-2 block">Platforms Used</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['Zoom', 'Google Meet', 'Skype', 'Microsoft Teams'].map((platform) => (
            <Button
              key={platform}
              type="button"
              variant={(watch('platformsUsed') ?? []).includes(platform) ? 'default' : 'outline'}
              onClick={() => toggleArrayValue('platformsUsed', platform)} // Updated to use toggleArrayValue
              className={`text-sm ${
                (watch('platformsUsed') ?? []).includes(platform)
                  ? 'bg-[#6366f1] text-white hover:bg-[#818cf8]'
                  : 'bg-[#1a1a1a] border-[#2c2c2c] text-[#b0b0b0] hover:bg-[#6366f1]/10 hover:text-[#6366f1] hover:border-[#6366f1]'
              }`}
            >
              {platform}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfo;