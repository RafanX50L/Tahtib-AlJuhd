import { useState, useCallback, useEffect } from "react";
import {
  Controller,
  Control,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import Cropper, { Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TrainerFormData } from "../sample";

interface ProfilePhotoUploadProps {
  control: Control<TrainerFormData>;
  errors: FieldErrors<TrainerFormData>;
  watch: UseFormWatch<TrainerFormData>;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  control,
  errors,
  watch,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempFile, setTempFile] = useState<File | null>(null);

  const profilePhoto = watch("profilePhoto");

  // Update imageSrc when profilePhoto changes (e.g., when navigating back)
  useEffect(() => {
    if (profilePhoto instanceof File) {
      const objectUrl = URL.createObjectURL(profilePhoto);
      setImageSrc(objectUrl);
      setTempFile(profilePhoto);
      // Cleanup URL when component unmounts or profilePhoto changes
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImageSrc(null);
      setTempFile(null);
    }
  }, [profilePhoto]);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<File> => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob!], tempFile!.name, {
          type: tempFile!.type,
        });
        resolve(file);
      }, tempFile!.type);
    });
  };

  const handleSaveCrop = useCallback(
    async (fieldOnChange: (value: File | null) => void) => {
      if (imageSrc && croppedAreaPixels) {
        try {
          const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
          fieldOnChange(croppedFile);
          setImageSrc(URL.createObjectURL(croppedFile));
          setIsCropModalOpen(false);
        } catch (error) {
          console.error("Error cropping image:", error);
        }
      }
    },
    [imageSrc, croppedAreaPixels, tempFile]
  );

  const handleFileChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      fieldOnChange: (value: File | null) => void
    ) => {
      const file = e.target.files?.[0];
      if (file) {
        setTempFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImageSrc(reader.result as string);
          setIsCropModalOpen(true);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleRemoveImage = useCallback(
    (fieldOnChange: (value: File | null) => void) => {
      setImageSrc(null);
      setTempFile(null);
      fieldOnChange(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    },
    []
  );

  return (
    <div>
      <Label
        htmlFor="profilePhoto"
        className="text-[#b0b0b0] flex items-center gap-2"
      >
        <Upload className="w-4 h-4" /> Profile Photo
      </Label>
      <Controller
        name="profilePhoto"
        control={control}
        render={({ field }) => (
          <div className="mt-2">
            {imageSrc ? (
              <div className="relative w-full max-w-xs mx-auto">
                <img
                  src={imageSrc}
                  alt="Uploaded profile"
                  className="w-full h-32 object-cover rounded-lg border border-[#2c2c2c]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-[#ef4444] hover:bg-[#ef4444]/10"
                  onClick={() => handleRemoveImage(field.onChange)}
                  aria-label="Remove profile photo"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full bg-[#1a1a1a] border-[#2c2c2c] text-[#6366f1] hover:bg-[#6366f1]/10"
                  onClick={() => setIsCropModalOpen(true)}
                >
                  Crop Image
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="profilePhoto"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#2c2c2c] border-dashed rounded-lg cursor-pointer bg-[#1a1a1a] hover:bg-[#252525]"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-[#666]" />
                    <p className="mb-2 text-sm text-[#666]">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-[#666]">
                      PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="profilePhoto"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, field.onChange)}
                    accept="image/*"
                  />
                </label>
              </div>
            )}
            {errors.profilePhoto && (
              <p className="text-[#ef4444] text-sm mt-1">
                {errors.profilePhoto.message}
              </p>
            )}

            <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
              <DialogContent className="bg-[#1a1a1a] text-[#f1f1f1] border-[#2c2c2c] max-w-lg">
                <DialogHeader>
                  <DialogTitle>Crop Profile Photo</DialogTitle>
                </DialogHeader>
                <div className="relative w-full h-64">
                  {imageSrc && (
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={4 / 3}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  )}
                </div>
                <div className="mt-4">
                  <Label className="text-[#b0b0b0]">Zoom</Label>
                  <Slider
                    value={[zoom]}
                    onValueChange={([value]) => setZoom(value)}
                    min={1}
                    max={3}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCropModalOpen(false)}
                    className="bg-[#1a1a1a] border-[#2c2c2c] text-[#b0b0b0] hover:bg-[#2c2c2c]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleSaveCrop(field.onChange)}
                    className="bg-[#6366f1] hover:bg-[#818cf8] text-white"
                  >
                    Save Crop
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      />
    </div>
  );
};

export default ProfilePhotoUpload;