import { useState, ChangeEvent, FormEvent, JSX } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Camera, Plus, Send, Play, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CommunityService } from "@/services/community.service";

// Interfaces
interface MediaPreview {
  url: string;
  type: "image" | "video";
  file: File;
}

interface CreatePostProps {
  onPostCreated?: () => void;
}

// Create Post Component
const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [caption, setCaption] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  const getFileType = (file: File): "image" | "video" => {
    return file.type.startsWith("image/") ? "image" : "video";
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);

    if (selectedFiles && selectedFiles.length > 0) {
      const previews: MediaPreview[] = Array.from(selectedFiles).map((file) => ({
        url: URL.createObjectURL(file),
        type: getFileType(file),
        file,
      }));
      setMediaPreviews(previews);
    } else {
      setMediaPreviews([]);
    }
  };

  const removePreview = (indexToRemove: number): void => {
    const newPreviews = mediaPreviews.filter((_, index) => index !== indexToRemove);
    setMediaPreviews(newPreviews);

    if (newPreviews.length === 0) {
      setFiles(null);
      const fileInput = document.getElementById("file-upload") as HTMLInputElement | null;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!files || files.length === 0) {
      alert("Please select at least one file to post.");
      return;
    }

    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("caption", caption);
      Array.from(files).forEach((file) => form.append("media", file));

      await CommunityService.createPost(form);

      // Reset form
      setCaption("");
      setFiles(null);
      setMediaPreviews([]);
      const fileInput = document.getElementById("file-upload") as HTMLInputElement | null;
      if (fileInput) {
        fileInput.value = "";
      }

      onPostCreated?.();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = (): void => {
    setCaption("");
    setFiles(null);
    setMediaPreviews([]);
    const fileInput = document.getElementById("file-upload") as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const openVideoModal = (url: string): void => {
    setSelectedVideoUrl(url);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = (): void => {
    setSelectedVideoUrl(null);
    setIsVideoModalOpen(false);
  };

  const renderMediaPreview = (preview: MediaPreview, index: number): JSX.Element => {
    const { url, type } = preview;

    return (
      <div key={index} className="relative group">
        {type === "image" ? (
          <img
            src={url}
            alt={`Preview ${index + 1}`}
            className="w-full h-32 object-cover rounded-lg"
          />
        ) : (
          <button
            type="button"
            onClick={() => openVideoModal(url)}
            className="relative w-full h-32 bg-black rounded-lg overflow-hidden"
          >
            <video
              src={url}
              className="w-full h-full object-cover"
              muted
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <Play className="h-8 w-8 text-white" />
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              Video
            </div>
          </button>
        )}
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => removePreview(index)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
              <p className="text-sm text-gray-500">
                Share your fitness journey with the community
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                What's on your mind?{/* eslint-disable-line */}
              </label>
              <Textarea
                placeholder="Share your workout progress, tips, or motivation..."
                className="min-h-[120px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={caption}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCaption(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">
                Add photos or videos
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-400">
                      PNG, JPG, MP4 up to 10MB each
                    </p>
                  </div>
                </label>
              </div>

              {mediaPreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {mediaPreviews.map((preview, index) => renderMediaPreview(preview, index))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={!files || files.length === 0 || isSubmitting}
                className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Share Post
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <VideoModal
        videoUrl={selectedVideoUrl || ""}
        isOpen={isVideoModalOpen}
        onClose={closeVideoModal}
      />
    </div>
  );
};

export default CreatePost;


import { useRef, useEffect } from "react";

interface VideoModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
      // Focus the modal for accessibility
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !videoUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      aria-label="Video modal"
    >
      <div className="relative max-w-4xl max-h-full bg-black rounded-lg overflow-hidden shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 text-white hover:bg-white/20 transition-colors"
          onClick={onClose}
          aria-label="Close video modal"
        >
          <X className="h-6 w-6" />
        </Button>
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          autoPlay
          className="max-w-full max-h-[90vh] object-contain"
          onError={(e) => {
            console.error("Video playback error:", e);
            alert("Failed to load video. Please try again.");
          }}
        />
      </div>
    </div>
  );
};
