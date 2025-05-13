import { useState, useRef } from 'react';
import { ImageIcon } from 'lucide-react';
import { uploadImageToCloudinary } from '../lib/cloudinary';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  buttonClassName?: string;
  iconSize?: number;
}

const ImageUploader = ({ 
  onImageUploaded, 
  buttonClassName = "p-1 rounded hover:bg-gray-100",
  iconSize = 18 
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      const imageUrl = await uploadImageToCloudinary(file);
      onImageUploaded(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleImageUpload}
        className={buttonClassName}
        title="Upload Image"
        disabled={isUploading}
      >
        <ImageIcon size={iconSize} />
        {isUploading && <span className="ml-1 text-xs">Uploading...</span>}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </>
  );
};

export default ImageUploader;
