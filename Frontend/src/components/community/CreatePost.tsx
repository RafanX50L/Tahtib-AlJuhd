import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Plus, Send } from "lucide-react";
import { createPost } from "@/services/community.service";

const CreatePost: React.FC = () => {
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    setFiles(selected);
    if (selected) {
      setPreviewUrls(Array.from(selected).map((f) => URL.createObjectURL(f)));
    } else {
      setPreviewUrls([]);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) return;
    setIsSubmitting(true);
    const form = new FormData();
    form.append("caption", caption);
    Array.from(files).forEach((f) => form.append("media", f));
    await createPost(form);
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
              <p className="text-sm text-gray-500">Share your fitness journey</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">What's on your mind?</label>
              <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="min-h-[120px] resize-none border-gray-200" placeholder="Share your progress, tips, or motivation..." />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">Add photos or videos</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                <input id="file-upload" className="hidden" type="file" multiple accept="image/*,video/*" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="cursor-pointer block text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-400">PNG, JPG, MP4 up to 50MB</p>
                </label>
              </div>
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {previewUrls.map((url, idx) => (
                    <img key={idx} src={url} className="w-full h-32 object-cover rounded-lg" />
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={!files || isSubmitting} className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                {isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Send className="h-4 w-4" />}
                {isSubmitting ? 'Posting...' : 'Share Post'}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setCaption(""); setFiles(null); setPreviewUrls([]); }}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePost;


