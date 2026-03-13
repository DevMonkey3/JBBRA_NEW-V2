'use client'
import { getCdnUrl } from "@/config/cdn";
import ServiceDetailLayout from "../../ServiceDetailLayout";
const breadcrumbData = [
  { key: "top",      title: <span style={{ color: "#019cd4" }}>Top</span> },
  { key: "service",  title: "Service Introduction" },
  { key: "overseas", title: "Overseas Expansion Support" },
];

export default function OverseasExpansionPage() {
  return (
    <ServiceDetailLayout
      slug="overseas-expansion"
      breadcrumb={breadcrumbData}
      tag="Overseas Expansion"
      heroImage={getCdnUrl("/services/6.overseas consulting.avif")}
      heroTitle="Expanding Your Business into Bangladesh and Beyond"
      heroBody="We support Japanese companies looking to expand into Bangladesh and South Asia — providing market entry consulting, local partner introductions, legal compliance guidance, and on-the-ground operational support."
      sections={[
        {
          title: "Why Bangladesh?",
          body: "Bangladesh is one of Asia's fastest-growing economies, with a young, skilled workforce, competitive labor costs, and a rapidly developing infrastructure. It presents strong opportunities in manufacturing, garments, IT services, and logistics.",
        },
        {
          title: "Our Overseas Expansion Services",
          body: "",
          bullets: [
            "Market research and feasibility assessment",
            "Local partner and supplier introductions",
            "Company registration and legal setup support",
            "Recruitment of local management and staff",
            "Coordination with government and regulatory bodies",
            "Business travel and logistics support",
          ]
        },
        {
          title: "Ongoing Operational Support",
          body: "",
          bullets: [
            "Interpreter and translation services (Japanese ↔ Bengali / English)",
            "Cross-cultural business communication training",
            "HR management support for local teams",
            "Regular reporting and liaison between Japan and Bangladesh offices",
          ]
        }
      ]}
    />
  );
}