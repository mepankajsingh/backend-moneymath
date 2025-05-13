// Cloudinary configuration and utility functions
const CLOUDINARY_CLOUD_NAME = 'moneymath';
const CLOUDINARY_UPLOAD_PRESET = 'blog_uploads_unsigned';
const CLOUDINARY_API_KEY = '648969145489562';

/**
 * Uploads an image to Cloudinary using unsigned upload
 * @param file The file to upload
 * @returns Promise with the upload result
 */
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('api_key', CLOUDINARY_API_KEY);
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload image');
  }
  
  const data = await response.json();
  return data.secure_url;
};
