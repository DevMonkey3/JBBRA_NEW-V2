'use client';
import { Image } from '@heroui/image';
import type { Sector } from './Category.types';

type Props = {
  sector: Sector;
};

export default function SectorCard({ sector }: Props) {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={sector.imgSrc}
        alt={sector.alt || sector.title}
        width={320}
        height={120}
        className="w-full h-20 object-cover rounded-lg mb-2"
        loading="lazy"
      />
      <span className="w-full bg-[#019cd4] text-center text-white rounded font-bold px-2 py-1">
        {sector.title}
      </span>
    </div>
  );
}
