'use client'
import { getCdnUrl } from "@/config/cdn";
import ServiceDetailLayout from "../../ServiceDetailLayout";

const breadcrumbData = [
  { key: "top",     title: <span style={{ color: "#019cd4" }}>Top</span> },
  { key: "service", title: "Service Introduction" },
  { key: "student", title: "International Student Support" },
];

export default function StudentSupportPage() {
  return (
    <ServiceDetailLayout
      slug="student-support"
      breadcrumb={breadcrumbData}
      tag="Student Support"
      heroImage={getCdnUrl("/services/4.overseas study.avif")}
      heroTitle="Supporting International Students on Their Journey to Work in Japan"
      heroBody="We provide comprehensive support for international students who wish to study and build their careers in Japan — from enrollment guidance and part-time work placement to post-graduation employment with Japanese companies."
      sections={[
        {
          title: "Who This Service Is For",
          body: "This service is designed for international students from Bangladesh, Vietnam, and other countries who are studying or planning to study in Japan, as well as for Japanese companies that wish to hire talented graduates.",
        },
        {
          title: "Student Support Services",
          body: "",
          bullets: [
            "Japanese language school enrollment guidance",
            "Part-time job placement during studies",
            "Assistance with student visa applications",
            "Preparation for Japanese Language Proficiency Test (JLPT)",
            "Career counseling and job hunting support",
            "Introduction to companies accepting international graduates",
          ]
        },
        {
          title: "For Hiring Companies",
          body: "",
          bullets: [
            "Trial dispatch of students for performance evaluation",
            "Coordination of internship programs",
            "Post-graduation full-time recruitment support",
            "Compliance and work permit guidance",
          ]
        }
      ]}
    />
  );
}