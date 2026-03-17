'use client'
import { getCdnUrl } from "@/config/cdn";
import ServiceDetailLayout from "../../ServiceDetailLayout";
const breadcrumbData = [
  { key: "top",     title: <span style={{ color: "#019cd4" }}>Top</span> },
  { key: "service", title: "Service Introduction" },
  { key: "titp",    title: "Technical Intern Training Program Support" },
];

export default function TITPPage() {
  return (
    <ServiceDetailLayout
      slug="titp"
      breadcrumb={breadcrumbData}
      tag="TITP"
      heroImage={getCdnUrl("/services/3.TITP.avif")}
      heroTitle="Building Global Skills Through On-the-Job Training in Japan"
      heroBody="The Technical Intern Training Program (TITP) allows young workers from developing countries to acquire practical skills and knowledge through on-site training at Japanese companies. We provide full support from recruitment through to completion."
      sections={[
        {
          title: "What is the Technical Intern Training Program?",
          body: "TITP is a government-managed program that allows foreign nationals to train in Japan for up to 5 years. It was designed to transfer technical skills to developing nations while helping Japanese companies address labor shortages.",
        },
        {
          title: "Program Structure",
          body: "",
          bullets: [
            "Year 1: Entry-level training under supervision (Technical Intern Training 1)",
            "Years 2–3: Independent practice in the same field (Technical Intern Training 2)",
            "Years 4–5: Advanced skills training (Technical Intern Training 3, if eligible)",
          ]
        },
        {
          title: "Our Support Services",
          body: "",
          bullets: [
            "Recruitment from Bangladesh, Vietnam, and other countries",
            "Pre-arrival Japanese language training (JLPT N4 level target)",
            "Liaison with supervising organizations (監理団体)",
            "Accommodation arrangement and daily life support",
            "Compliance guidance and documentation assistance",
            "Follow-up and issue resolution during the training period",
          ]
        }
      ]}
    />
  );
}