/**
 * Upload a single image to Cloudinary
 */
export async function uploadImage(file: File, folder: string = 'tailor-app'): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload image');
  }

  const data = await response.json();
  return data.url;
}

/**
 * Upload multiple images to Cloudinary
 */
export async function uploadImages(files: File[], folder: string = 'tailor-app'): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImage(file, folder));
  return Promise.all(uploadPromises);
}
