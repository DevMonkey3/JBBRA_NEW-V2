import { siteConfig } from "@/config/site";
import Content1 from "@/components/homeComponents/content1";
import Content2 from "@/components/homeComponents/content2";
import Content4 from "@/components/homeComponents/content4";
import Content6 from "@/components/homeComponents/content6";
import Content7 from "@/components/homeComponents/content7";
import Content8 from "@/components/homeComponents/content8";
import Content10 from "@/components/homeComponents/content10";
import Content11 from "@/components/homeComponents/content11";
import NewsSection from "@/components/homeComponents/NewsSection";
import Script from 'next/script';

export default function Home() {
  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Japan Bangla Bridge Recruiting Agency (Jbbra)",
            "alternateName": "Japan Bangla Bridge Recruiting Agency (Jbbra)",
            "url": siteConfig.siteUrl,
            "logo": "https://bbc-images.sgp1.cdn.digitaloceanspaces.com/Jbbra%20realated%20photo/JBBRA%20Logo%20SVG%20(3).svg",
            "description": siteConfig.description,
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "JP",
              "addressLocality": "Tokyo"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "availableLanguage": ["Japanese", "Bengali", "English"]
            }
          })
        }}
      />
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
       <> <Content1 />
      <NewsSection />
      <Content2 />
      <Content4 />
      
      <Content6 />
      <Content7 />
      <Content8 />
      <Content10 />
      <Content11 />
      </>

    </section>
    </>
  );
}
