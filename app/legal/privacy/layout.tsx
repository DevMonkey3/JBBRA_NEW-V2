// app/privacy/layout.tsx
import React from "react";

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // mirrors my simple centered section layout
  return (
    <section className="px-4 py-10 md:py-14">
      <div className="mx-auto w-full max-w-3xl">{children}</div>
    </section>
  );
}
