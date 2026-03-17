'use client'
import { useRouter } from "next/navigation";
import ServiceDetailLayout from "../../ServiceDetailLayout";
import { getCdnUrl } from "@/config/cdn";

const breadcrumbData = [
  { key: "top",     title: <span style={{ color: "#019cd4" }}>Top</span> },
  { key: "service", title: "Service Introduction" },
  { key: "ssw",     title: "Specified Skills Talent Introduction" },
];

export default function SSWPage() {
  const router = useRouter();
  return (
    <ServiceDetailLayout
      slug="ssw"
      breadcrumb={breadcrumbData}
      tag="Specified Skills (SSW)"
      heroImage={getCdnUrl("/services/1. SSW.avif")}
      heroTitle="New Opportunities for Foreign Talent — Work in Japan!"
      heroBody="Japan is facing a severe labor shortage due to an aging population. To address this, the 'Specified Skilled Worker (SSW)' visa was introduced in 2019. It allows foreign nationals with specialized skills to work officially in 12 industries across Japan."
      sections={[
        {
          title: "What is a Specified Skilled Worker (SSW)?",
          body: "A Specified Skilled Worker (SSW) is a residence status that allows foreign nationals with a certain level of professional skills and Japanese language ability to work in industries experiencing labor shortages in Japan.",
          subsections: [
            {
              title: "Two Categories:",
              items: [
                { heading: "SSW Type 1", points: ["Work permitted in 12 designated industries", "Maximum stay of 5 years (renewable)", "Family accompaniment not permitted"] },
                { heading: "SSW Type 2", points: ["Higher skill level required", "No limit on length of stay (permanent employment possible)", "Family accompaniment permitted"] },
              ]
            }
          ]
        },
        {
          title: "Industries Covered",
          body: "Construction, Shipbuilding, Automotive Repair, Industrial Machinery, Electronics, Aerospace, Hospitality, Food & Beverage, Fisheries, Agriculture, Nursing Care, Building Cleaning.",
        },
        {
          title: "Our Support Services",
          body: "",
          bullets: [
            "Recruitment and matching with qualified SSW candidates",
            "Pre-arrival Japanese language and skills training",
            "Support with residence status applications",
            "Housing arrangement and daily life support",
            "Ongoing follow-up after employment",
          ]
        }
      ]}
    />
  );
}