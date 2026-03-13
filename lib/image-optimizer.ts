/**
 * Image Optimization Utilities
 * Handles responsive images, lazy loading, and performance optimization
 */

import { getCdnUrl } from "@/config/cdn";

export interface ImageSize {
  width: number;
  height: number;
}

export interface ResponsiveImage {
  src: string;
  width: number;
  height: number;
  media?: string;
}

/**
 * Generate responsive image variants for different screen sizes
 */
export function generateResponsiveImages(
  imagePath: string,
  baseWidth: number = 1200,
  baseHeight: number = 630
): ResponsiveImage[] {
  const sizes = [
    { width: 320, height: 168, media: '(max-width: 320px)' },
    { width: 375, height: 196, media: '(max-width: 375px)' },
    { width: 768, height: 402, media: '(max-width: 768px)' },
    { width: 1024, height: 536, media: '(max-width: 1024px)' },
    { width: 1200, height: 630, media: '(min-width: 1025px)' },
  ];

  return sizes.map(size => ({
    src: getCdnUrl(imagePath),
    width: size.width,
    height: size.height,
    media: size.media,
  }));
}

/**
 * Generate srcset string for responsive images
 */
export function generateSrcSet(imagePath: string): string {
  const sizes = [320, 375, 768, 1024, 1200, 1920];
  return sizes.map(width => `${getCdnUrl(imagePath)} ${width}w`).join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(): string {
  return '(max-width: 320px) 320px, (max-width: 375px) 375px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1200px';
}

/**
 * Get optimized image dimensions based on container size
 */
export function getOptimizedDimensions(
  containerWidth: number,
  containerHeight: number,
  aspectRatio: number = 16/9
): ImageSize {
  // Calculate optimal dimensions based on container
  const width = Math.min(containerWidth, 1200);
  const height = Math.round(width / aspectRatio);

  return {
    width: Math.max(width, 320),
    height: Math.max(height, 168),
  };
}

/**
 * Check if image should be lazy loaded
 */
export function shouldLazyLoad(isAboveTheFold: boolean = false): boolean {
  return !isAboveTheFold;
}

/**
 * Generate optimized image props for Next.js Image component
 */
export function getOptimizedImageProps(
  src: string,
  alt: string,
  width?: number,
  height?: number,
  priority: boolean = false
) {
  const cdnSrc = getCdnUrl(src);

  return {
    src: cdnSrc,
    alt,
    width: width || 1200,
    height: height || 630,
    priority,
    loading: (priority ? 'eager' : 'lazy') as 'eager' | 'lazy',
    className: 'optimized-image',
    style: {
      maxWidth: '100%',
      height: 'auto',
    },
  };
}

/**
 * Generate optimized image props for regular img tag
 */
export function getOptimizedImgProps(
  src: string,
  alt: string,
  width?: number,
  height?: number,
  priority: boolean = false
) {
  const cdnSrc = getCdnUrl(src);

  return {
    src: cdnSrc,
    alt,
    width: width || 1200,
    height: height || 630,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    className: 'optimized-image',
    style: {
      maxWidth: '100%',
      height: 'auto',
    },
  };
}

/**
 * Preload critical images for above-the-fold content
 */
export function preloadCriticalImages(imagePaths: string[]) {
  if (typeof window !== 'undefined') {
    imagePaths.forEach(path => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getCdnUrl(path);
      document.head.appendChild(link);
    });
  }
}