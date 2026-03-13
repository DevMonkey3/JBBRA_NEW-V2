import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize Digital Ocean Spaces client (S3-compatible)
const spacesClient = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT || 'https://sgp1.digitaloceanspaces.com',
  region: process.env.SPACES_REGION || 'sgp1',
  credentials: {
    accessKeyId: process.env.SPACES_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.SPACES_SECRET_KEY || '',
  },
  forcePathStyle: false, // Required for DO Spaces
});

/**
 * Upload a file to Digital Ocean Spaces
 * @param file - Buffer containing file data
 * @param filename - Original filename
 * @param mimeType - MIME type of the file (e.g., 'image/png')
 * @returns CDN URL of the uploaded file
 */
export async function uploadToSpaces(
  file: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  // Create unique filename with timestamp to prevent collisions
  const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const key = `uploads/${uniqueFilename}`;

  try {
    console.log(`[Spaces] Uploading ${key} to bucket...`);

    // First try with ACL for per-file public access
    await spacesClient.send(
      new PutObjectCommand({
        Bucket: process.env.SPACES_BUCKET || 'bbc-images',
        Key: key,
        Body: file,
        ACL: 'public-read', // Make file publicly accessible
        ContentType: mimeType,
        CacheControl: 'public, max-age=31536000, immutable', // Cache for 1 year
      })
    );

    // Return CDN URL for faster delivery
    const cdnEndpoint = process.env.SPACES_CDN_ENDPOINT || 'https://bbc-images.sgp1.cdn.digitaloceanspaces.com';
    const finalUrl = `${cdnEndpoint}/${key}`;

    console.log(`[Spaces] Upload successful: ${finalUrl}`);
    return finalUrl;
  } catch (error) {
    console.error('[Spaces] Upload error:', error);
    throw new Error('Failed to upload image to cloud storage');
  }
}

/**
 * Delete a file from Digital Ocean Spaces
 * @param fileUrl - Full CDN URL of the file to delete
 */
export async function deleteFromSpaces(fileUrl: string): Promise<void> {
  try {
    // Extract the key from the URL
    // URL format: https://bbc-images.sgp1.cdn.digitaloceanspaces.com/uploads/12345-filename.jpg
    const urlParts = fileUrl.split('.com/');
    if (urlParts.length < 2) {
      throw new Error('Invalid file URL format');
    }

    const key = urlParts[1]; // Get everything after .com/

    await spacesClient.send(
      new DeleteObjectCommand({
        Bucket: process.env.SPACES_BUCKET || 'bbc-images',
        Key: key,
      })
    );

    console.log(`Deleted file from Spaces: ${key}`);
  } catch (error) {
    console.error('Error deleting from Spaces:', error);
    throw new Error('Failed to delete image from cloud storage');
  }
}

export { spacesClient };
