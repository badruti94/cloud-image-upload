import ImageUploader from '@/components/ImageUploader';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Upload Gambar
        </h1>
        <p className="text-sm text-muted-foreground">
          Upload ke Cloudinary, dapatkan link
        </p>
      </div>
      
      <ImageUploader />
    </div>
  );
};

export default Index;
