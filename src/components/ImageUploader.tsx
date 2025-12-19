import { useState, useCallback } from 'react';
import { Upload, Copy, Check, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME'; // Ganti dengan cloud name kamu
const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET'; // Ganti dengan upload preset kamu

const ImageUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true);
    setImageUrl(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setImageUrl(data.secure_url);
      toast({
        title: 'Upload berhasil!',
        description: 'Link gambar siap disalin.',
      });
    } catch (error) {
      toast({
        title: 'Upload gagal',
        description: 'Pastikan konfigurasi Cloudinary sudah benar.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'File tidak valid',
        description: 'Hanya file gambar yang diperbolehkan.',
        variant: 'destructive',
      });
      return;
    }
    uploadToCloudinary(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const copyToClipboard = async () => {
    if (!imageUrl) return;
    await navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    toast({
      title: 'Tersalin!',
      description: 'Link sudah disalin ke clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Upload Area */}
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          flex flex-col items-center justify-center
          w-full h-48 border-2 border-dashed rounded-lg
          cursor-pointer transition-all duration-200
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin" />
            <span className="text-sm">Mengupload...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Upload className="w-10 h-10" />
            <div className="text-center">
              <p className="text-sm font-medium">Drag & drop gambar</p>
              <p className="text-xs mt-1">atau klik untuk memilih</p>
            </div>
          </div>
        )}
      </label>

      {/* Result */}
      {imageUrl && (
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Link Gambar
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md truncate"
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
