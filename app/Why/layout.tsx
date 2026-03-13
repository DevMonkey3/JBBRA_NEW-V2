// app/why/layout.tsx
export default function WhyLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full">
      {/* container with generous max width + responsive padding */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
