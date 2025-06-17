import {
  Controller,
  Control,
  FieldErrors,
  UseFormWatch,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrainerFormData } from "@/pages/trainer/TSubmittingDetails"; // Adjust import path based on your project structure

interface BasicInfoProps {
  control: Control<TrainerFormData>;
  errors: FieldErrors<TrainerFormData>;
  watch: UseFormWatch<TrainerFormData>;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ control, errors, watch }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phoneNumber" className="text-[#b0b0b0]">
            Phone Number *
          </Label>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  id="phoneNumber"
                  placeholder="+1 (555) 123-4567"
                  className="bg-[#1a1a1a] border-[#2c2c2c] text-[#f1f1f1] focus:border-[#6366f1] focus:ring-[#6366f1]/20"
                />
                {errors.phoneNumber && (
                  <p className="text-[#ef4444] text-sm mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <Label htmlFor="location" className="text-[#b0b0b0]">
            Location *
          </Label>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  id="location"
                  placeholder="City, State/Country"
                  className="bg-[#1a1a1a] border-[#2c2c2c] text-[#f1f1f1] focus:border-[#6366f1] focus:ring-[#6366f1]/20"
                />
                {errors.location && (
                  <p className="text-[#ef4444] text-sm mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <Label htmlFor="timeZone" className="text-[#b0b0b0]">
            Time Zone *
          </Label>

          <Controller
            name="timeZone"
            control={control}
            render={({ field }) => (
              <TimezoneSelect
                value={field.value}
                onChange={(tz) => field.onChange(tz.value)}
              />
            )}
          />
         
        </div>

        <div>
          <Label htmlFor="dateOfBirth" className="text-[#b0b0b0]">
            Date of Birth
          </Label>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="dateOfBirth"
                type="date"
                className="bg-[#1a1a1a] border-[#2c2c2c] text-[#f1f1f1] focus:border-[#6366f1] focus:ring-[#6366f1]/20"
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="gender" className="text-[#b0b0b0]">
            Gender
          </Label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="bg-[#1a1a1a] border-[#2c2c2c] text-[#f1f1f1] focus:border-[#6366f1] focus:ring-[#6366f1]/20">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e1e] border-[#2c2c2c] text-[#f1f1f1]">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <ProfilePhotoUpload control={control} errors={errors} watch={watch} />
    </div>
  );
};

export default BasicInfo;


import TimezoneSelect from "react-timezone-select";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
import { useState } from "react";

const TimeZonePicker:React.FC<{onChange: any}> = ({ onChange }) => {
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  return (
    <div className="text-black">
      <TimezoneSelect
        value={selectedTimezone}
        onChange={(tz) => {
          setSelectedTimezone(tz.value);
          onChange(tz.value);
        }}
      />
    </div>
  );
};