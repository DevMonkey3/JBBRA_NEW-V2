/**
 * CDN Configuration for Digital Ocean Spaces
 * All images are hosted on Digital Ocean Spaces CDN
 */

export const CDN_BASE_URL = 'https://bbc-images.sgp1.cdn.digitaloceanspaces.com';

/**
 * Helper function to get CDN URL for an image
 * @param path - Image path (e.g., '/home/blogPosts.avif' or 'home/blogPosts.avif')
 * @returns Full CDN URL with properly encoded spaces and special characters
 *
 * @example
 * getCdnUrl('/home/Slider (6).avif')
 * // Returns: 'https://bbc-images.sgp1.cdn.digitaloceanspaces.com/home/Slider%20(6).avif'
 */
export function getCdnUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Split path into segments and encode each segment individually
  // This handles spaces and special characters like parentheses properly
  const segments = cleanPath.split('/');
  const encodedSegments = segments.map(segment => encodeURIComponent(segment));
  const encodedPath = encodedSegments.join('/');

  return `${CDN_BASE_URL}/${encodedPath}`;
}

/**
 * Helper function to get image URL (CDN or fallback to server)
 * @param path - Image path
 * @param useCdn - Whether to use CDN (default: true)
 * @returns Image URL
 */
export function getImageUrl(path: string, useCdn: boolean = true): string {
  if (useCdn) {
    return getCdnUrl(path);
  }
  return path; // Return original path (loads from server)
}
