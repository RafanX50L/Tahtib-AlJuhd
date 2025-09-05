import { useState } from "react";
import { mockServices } from "./CommunityApp";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Camera, Plus, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createPost } from "@/services/community.service";

// Create Post Component
const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
    
    if (selectedFiles) {
      const urls = Array.from(selectedFiles).map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    } else {
      setPreviewUrls([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) return;
    
    setIsSubmitting(true);
    const form = new FormData();
    form.append("caption", caption);
    Array.from(files).forEach((f) => form.append("media", f));
    
    await mockServices.createPost(form);
    setCaption("");
    setFiles(null);
    setPreviewUrls([]);
    setIsSubmitting(false);
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
              <p className="text-sm text-gray-500">Share your fitness journey with the community</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">What's on your mind?</label>
              <Textarea
                placeholder="Share your workout progress, tips, or motivation..."
                className="min-h-[120px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">Add photos or videos</label>
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
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-400">PNG, JPG, MP4 up to 10MB each</p>
                  </div>
                </label>
              </div>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative">
                      <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => {
                          const newUrls = previewUrls.filter((_, i) => i !== idx);
                          setPreviewUrls(newUrls);
                          if (newUrls.length === 0) setFiles(null);
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
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
              <Button type="button" variant="outline" onClick={() => {
                setCaption("");
                setFiles(null);
                setPreviewUrls([]);
              }}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePost;