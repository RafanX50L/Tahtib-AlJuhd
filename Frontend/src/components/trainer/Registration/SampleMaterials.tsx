
import { useCallback } from 'react';
import { Controller, Control, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X, Video, Upload, FileText } from 'lucide-react';
import { TrainerFormData } from '@/pages/trainer/TSubmittingDetails'; // Adjust import path based on your project structure

interface SampleMaterialsProps {
  control: Control<TrainerFormData>;
  watch: UseFormWatch<TrainerFormData>;
  setValue: UseFormSetValue<TrainerFormData>;
  errors: FieldErrors<TrainerFormData>;
}

const SampleMaterials: React.FC<SampleMaterialsProps> = ({ control, watch, setValue, errors }) => {
  const addPortfolioLink = useCallback(() => {
    setValue('portfolioLinks', [...(watch('portfolioLinks') || []), '']);
  }, [watch, setValue]);

  const removePortfolioLink = useCallback(
    (index: number) => {
      setValue('portfolioLinks', [...(watch('portfolioLinks') || []), ''].filter((_, i) => i !== index));
    },
    [watch, setValue],
  );

  const resumeFile = watch('resume');

  const handleRemoveResume = useCallback(
    (fieldOnChange: (value: File | null) => void) => {
      setValue('resume', null);
      fieldOnChange(null);
    },
    [setValue],
  );

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="demoVideoLink" className="text-[#b0b0b0] flex items-center gap-2">
          <Video className="w-4 h-4" /> Demo Video Link *
        </Label>
        <Controller
          name="demoVideoLink"
          control={control}
          render={({ field }) => (
            <div>
              <Input
                {...field}
                id="demoVideoLink"
                placeholder="https://youtube.com/watch?v=..."
                className="bg-[#1a1a1a] border-[#2c2c2c] text-[#f1f1f1] focus:border-[#6366f1] focus:ring-[#6366f1]/20 transition-all"
              />
              {errors.demoVideoLink && (
                <p className="text-[#ef4444] text-sm mt-1">{errors.demoVideoLink.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <div>
        <Label className="text-[#b0b0b0] mb-4 block">Portfolio Links</Label>
        <div className="space-y-3">
          {(watch('portfolioLinks') || []).map((_, index) => (
            <div key={`portfolio-${index}`} className="flex gap-2">
              <Controller
                name={`portfolioLinks.${index}`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="https://yourportfolio.com"
                    className="bg-[#1a1a1a] border-[#2c2c2c] text-[#f1f1f1] focus:border-[#6366f1] focus:ring-[#6366f1]/20 flex-1"
                  />
                )}
              />
              {(watch('portfolioLinks') || []).length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => removePortfolioLink(index)}
                  className="bg-[#1a1a1a] border-[#2c2c2c] text-[#ef4444] hover:bg-[#ef4444]/10 hover:text-[#ef4444]"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addPortfolioLink}
            className="bg-[#1a1a1a] border-[#2c2c2c] text-[#6366f1] hover:bg-[#6366f1]/10 hover:text-[#6366f1] border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Portfolio Link
          </Button>
        </div>
        {errors.portfolioLinks && (
          <p className="text-[#ef4444] text-sm mt-1">{errors.portfolioLinks.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="resume" className="text-[#b0b0b0] flex items-center gap-2">
          <Upload className="w-4 h-4" /> Resume
        </Label>
        <Controller
          name="resume"
          control={control}
          render={({ field }) => (
            <div className="mt-2">
              {resumeFile ? (
                <div className="relative w-full max-w-md mx-auto bg-[#1a1a1a] border border-[#2c2c2c] rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-6 h-6 text-[#6366f1]" />
                    <span className="text-[#f1f1f1] text-sm truncate max-w-[200px]">{resumeFile.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-[#ef4444] hover:bg-[#ef4444]/10"
                    onClick={() => handleRemoveResume(field.onChange)}
                    aria-label="Remove resume"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="resume"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#2c2c2c] border-dashed rounded-lg cursor-pointer bg-[#1a1a1a] hover:bg-[#252525] transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-[#666]" />
                      <p className="mb-2 text-sm text-[#666]">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-[#666]">PDF files only (MAX. 5MB)</p>
                    </div>
                    <input
                      id="resume"
                      type="file"
                      className="hidden"
                      onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                      accept="application/pdf"
                    />
                  </label>
                </div>
              )}
              {errors.resume && <p className="text-[#ef4444] text-sm mt-1">{errors.resume.message}</p>}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default SampleMaterials;