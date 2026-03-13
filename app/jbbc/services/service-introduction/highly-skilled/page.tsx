'use client'
import Breadcrumbs from "@/components/breadcrumb/page";
import { getCdnUrl } from "@/config/cdn";
import ServiceDetailLayout from "../../ServiceDetailLayout";
const breadcrumbData = [
  { key: "top",     title: <span style={{ color: "#019cd4" }}>Top</span> },
  { key: "service", title: "Service Introduction" },
  { key: "hs",      title: "Highly Skilled Talent Introduction" },
];

export default function HighlySkilledPage() {
  return (
    <ServiceDetailLayout
      slug="highly-skilled"
      breadcrumb={breadcrumbData}
      tag="Highly Skilled"
      heroImage={getCdnUrl("/services/2.international hiring.avif")}
      heroTitle="Connecting Global Expertise with Japanese Business"
      heroBody="We introduce highly skilled foreign professionals with advanced expertise in engineering, IT, management, and other specialized fields. These individuals bring global perspectives and deep knowledge that help Japanese companies grow and innovate."
      sections={[
        {
          title: "What is Highly Skilled Talent Introduction?",
          body: "Japan's 'Highly Skilled Professional' visa (HSP) is a points-based system for foreign nationals with outstanding academic backgrounds, work experience, and salaries. It grants preferential immigration treatment and faster pathways to permanent residency.",
        },
        {
          title: "Types of Highly Skilled Professionals",
          body: "",
          bullets: [
            "Advanced academic research activities",
            "Advanced specialized / technical activities (engineers, IT specialists)",
            "Advanced business management activities (executives, managers)",
          ]
        },
        {
          title: "Our Support Services",
          body: "",
          bullets: [
            "Headhunting and talent sourcing from overseas",
            "Resume screening and interview coordination",
            "Visa application and relocation support",
            "Onboarding and cultural integration programs",
            "Long-term retention and career development support",
          ]
        }
      ]}
    />
  );
}