// Content1.tsx
"use client";

import { getCdnUrl } from "@/config/cdn";
import { getOptimizedImageProps } from "@/lib/image-optimizer";

const Content1: React.FC = () => {
  return (
    <div className="container-custom">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        <img
          {...getOptimizedImageProps(
            "/home/indImage.avif",
            "Wide Image 1",
            1200,
            600,
            true // Priority since it's above the fold
          )}
          className="w-full h-auto object-cover object-center responsive-image"
          style={{ minHeight: '300px', maxHeight: '500px' }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent rounded-b-2xl" />
      </div>
    </div>
  );
};

export default Content1;
