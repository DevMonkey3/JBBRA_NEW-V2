'use client'
import { getCdnUrl } from "@/config/cdn";
import ServiceDetailLayout from "../../ServiceDetailLayout";
const breadcrumbData = [
  { key: "top",    title: <span style={{ color: "#019cd4" }}>Top</span> },
  { key: "service",title: "Service Introduction" },
  { key: "it",     title: "IT Development Experience" },
];

export default function ITDevelopmentPage() {
  return (
    <ServiceDetailLayout
      slug="it-development"
      breadcrumb={breadcrumbData}
      tag="IT Development"
      heroImage={getCdnUrl("/services/5.IT engineer.avif")}
      heroTitle="Offshore & Onshore IT Development with Skilled Engineers"
      heroBody="We provide experienced IT engineers from Bangladesh and other countries to support your software development, system integration, and digital transformation projects — at competitive costs without compromising quality."
      sections={[
        {
          title: "Our IT Development Services",
          body: "We offer flexible engagement models to match your project needs, whether you require on-site engineers in Japan or an offshore development team.",
          bullets: [
            "Web application development (React, Next.js, Node.js, etc.)",
            "Mobile application development (iOS, Android, React Native)",
            "Backend and API development (Java, Python, PHP, Go)",
            "Cloud infrastructure setup (AWS, GCP, Azure)",
            "UI/UX design and frontend engineering",
            "Legacy system modernization",
          ]
        },
        {
          title: "Why Choose Our IT Engineers?",
          body: "",
          bullets: [
            "English-proficient engineers with Japanese communication support",
            "Pre-screened for technical skills and work ethic",
            "Experienced in Japanese business culture and workflows",
            "Flexible contracts: project-based, monthly dispatch, or full-time hiring",
            "Post-placement technical support and issue resolution",
          ]
        },
        {
          title: "Engagement Models",
          body: "",
          bullets: [
            "On-site dispatch in Japan (engineer works at your office)",
            "Offshore development team (remote delivery from Bangladesh)",
            "Hybrid model (mix of on-site and remote)",
          ]
        }
      ]}
    />
  );
}