// components/servicesComponents/category.tsx
'use client';

import { Image } from '@heroui/image';
import type { CategoryProps } from './Category.types';
import { CATEGORY_MAP } from './categoryData';
import SectorCard from './SectorCard';

/**
 * Replaces the old category.tsx which:
 *   - Defined a massive categoryOptions array (including JSX elements) inside
 *     the component body, recreating it on every render
 *   - Had a useEffect with an empty deps array that captured a stale closure
 *     of categoryOptions (classic closure bug — filter would never update)
 *   - Used props: any instead of typed props
 *
 * Now simply looks up the category from the module-level CATEGORY_MAP constant
 * that was already built in categoryData.tsx — zero computation per render.
 */
export function CategoryCom({ categoryVal, className }: CategoryProps) {
  const category = CATEGORY_MAP[categoryVal];

  // Unknown category key — render nothing rather than crash
  if (!category) return null;

  return (
    <div className={className}>
      {/* Hero: image + description */}
      <div className="p-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <Image
              src={category.image}
              alt={category.title}
              width={735}
              height={450}
              className="w-full rounded-lg object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{category.title}</h1>
            <p className="border-t border-blue-500 pt-2">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Type-specific description block */}
      {category.descriptionDiv}

      {/* Job sectors grid */}
      <div className="bg-blue-50 p-8">
        <h2 className="text-xl text-gray-800 mb-4 text-center">{category.jobSectorsTitle}</h2>
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">{category.jobSectorsSubtitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {category.jobSectorsOptions.map((sector) => (
            <SectorCard key={sector.title} sector={sector} />
          ))}
        </div>
      </div>
    </div>
  );
}
