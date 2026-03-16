// components/bgFont/BgFont.tsx
// Removed unused imports: title (from primitives), Breadcrumb, useState, useEffect
// None of these were referenced anywhere in the component body.

interface BgFontProps {
  textBg: string;
  title: string;
}

export default function BgFont({ textBg, title }: BgFontProps) {
  return (
    <div className="container mx-auto text-center relative">
      {/* Large background text */}
      <div className="
        text-[80px] xs:text-[100px] sm:text-[140px] md:text-[200px]
        font-bold text-[#f3f3f3]
        leading-none
      ">
        {textBg}
      </div>

      {/* Foreground title overlaid on top */}
      <div className="
        text-[24px] xs:text-[32px] sm:text-[40px] md:text-[60px]
        text-[#4E4E4E] font-bold
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        leading-tight px-2 w-full text-center
      ">
        {title}
      </div>
    </div>
  );
}
