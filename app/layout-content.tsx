'use client'
import { usePathname } from 'next/navigation';
import { OptimizedNavbar } from "@/components/navbar/optimized-navbar";
import Footer from "@/components/footer/footer";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative flex min-h-screen flex-col">
      <OptimizedNavbar />
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
