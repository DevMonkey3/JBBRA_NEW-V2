// components/homeComponents/content2.tsx
"use client";

// Removed useState — static data never needs to be in state
const STATS = [
  { title: "Receiving Companies",    content: "300+" },
  { title: "Job Seekers Registered", content: "10K+" },
  { title: "Users",                  content: "2K+"  },
  { title: "Job Openings",           content: "300+" },
] as const;

const Content2: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="p-6 md:p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((item) => (
            <div key={item.title} className="content-card hover-lift text-center transition-all duration-300">
              <div className="content-stat">{item.content}</div>
              <div className="content-label mt-2">{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Content2;
