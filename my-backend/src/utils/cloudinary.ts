import cloudinary from 'cloudinary';

const { v2: cloudinaryV2 } = cloudinary;

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadOptions {
  folder?: string;
  publicId?: string;
  tags?: string[];
  transformation?: Record<string, unknown>[];
}

export async function uploadImageFromBuffer(
  buffer: Buffer,
  options: UploadOptions = {}
): Promise<{ url: string; publicId: string; width: number; height: number; format: string; bytes: number }> {
  const { folder = 'restaurant', publicId, tags = [], transformation } = options;

  return new Promise((resolve, reject) => {
    const stream = cloudinaryV2.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        tags,
        transformation,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed'));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinaryV2.uploader.destroy(publicId);
}
