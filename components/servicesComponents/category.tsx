// components/navbar.tsx
"use client";
import { Construction, SSW, TITP } from "@/components/servicesComponents/descriptionDiv";
import {useState,useEffect}from "react";
import {Image} from "@heroui/image";
import { getCdnUrl } from "@/config/cdn";
export function CategoryCom(props: any) {
  // your logic here
   const { categoryVal } = props;
    const [selectedCategory, setSelectedCategory] = useState<any[]>([]);
     const categoryOptions = [
        {
            title: "外国人材のための新しいチャンス、日本で働こう！",
            image: getCdnUrl('/home/introduce.avif'),
            description: "日本では少子高齢化による深刻な労働力不足が続いています。これを解決するために、2019年に導入されたのが 「特定技能（SSW：Specified Skilled Worker）」 の在留資格です。特定技能制度により、外国人が正式な労働者として日本の12の産業で働くことが可能になりました。",
            descriptionDiv: (
                <Construction />
            ),
            jobSectorsTitle: "Job Sectors under the SSW program",
            jobSectorsSubtitle: "特定技能における職種",
            jobSectorsOptions: [
                { alt: "Food Industry", imgSrc: getCdnUrl("/home/introduce.avif"), title: "外食業", desc: "Food Industry" },
                { alt: "Accommodation Industry", imgSrc: getCdnUrl("/home/introduce.avif"), title: "宿泊業", desc: "Accommodation Industry" },
                { alt: "Nursing Care", imgSrc: getCdnUrl("/home/introduce.avif"), title: "介護", desc: "Nursing Care" },
                { alt: "Building Cleaning", imgSrc: getCdnUrl("/home/introduce.avif"), title: "ビルクリーニング業", desc: "Building Cleaning" },
            ],
            category2:'construction'
        },
        {
            title: "高度専門職（Highly Skilled Professional）とは",
            image: getCdnUrl('/home/introduce.avif'),
            description: "日本の**高度専門職（Highly Skilled Professional, HSP）**は、優れた専門的知識や技術を持つ外国人材を受け入れるための特別な在留資格です。 高度な人材を受け入れることで、日本の経済成長、研究開発、国際競争力の強化を目的としています。 「特定技能（SSW：Specified Skilled Worker）」 の在留資格です。特定技能制度により、外国人が正式な労働者として日本の12の産業で働くことが可能になりました。 「特定技能（SSW：Specified Skilled Worker）」 の在留資格です。特定技能制度により、外国人が正式な労働者として日本の12の産業で働くことが可能になりました。",
            descriptionDiv: (
              <SSW />
            ),
            jobSectorsTitle: "Job Sectors under the Highly Skilled Professional",
            jobSectorsSubtitle: "代表的な高度人材職種（バングラデシュ人向け）",
            jobSectorsOptions: [
                { alt: "Food Industry", imgSrc: getCdnUrl("/home/introduce.avif"), title: "ITエンジニア", desc: "Food Industry" },
                { alt: "Accommodation Industry", imgSrc: getCdnUrl("/home/introduce.avif"), title: "機械エンジニア", desc: "Accommodation Industry" },
                { alt: "Nursing Care", imgSrc: getCdnUrl("/home/introduce.avif"), title: "電気・電子エンジニア", desc: "Nursing Care" },
                { alt: "Building Cleaning", imgSrc: getCdnUrl("/home/introduce.avif"), title: "CADオペレーター・設計士", desc: "Building Cleaning" },
                { alt: "Food Industry", imgSrc: getCdnUrl("/home/introduce.avif"), title: "研究開発職", desc: "Food Industry" },
                { alt: "Accommodation Industry", imgSrc: getCdnUrl("/home/introduce.avif"), title: "通訳・翻訳", desc: "Accommodation Industry" },
                { alt: "Nursing Care", imgSrc: getCdnUrl("/home/introduce.avif"), title: "貿易事務・海外営業", desc: "Nursing Care" },
                { alt: "Building Cleaning", imgSrc: getCdnUrl("/home/introduce.avif"), title: "経営・管理職", desc: "Building Cleaning" },
            ],
            category2:'SSW'
        },
        {
            title: "技能実習制度（TITP）バングラデシュ人材および送出し機関向け",
            image: getCdnUrl('/home/introduce.avif'),
            description: "技能実習制度（TITP）は、日本政府が管理するプログラムで、開発途上国に対して実践的な産業技術・技能・知識を移転することを目的としています。 これにより、実習生の母国（バングラデシュ）の人材育成と経済発展に貢献します。",
            descriptionDiv: (
              <TITP />
            ),
                bSectorsTitle: "Job Sectors under the Highly Skilled Professional",
            jobSectorsSubtitle: "代表的な高度人材職種（バングラデシュ人向け）",
            jobSectorsOptions: [
                { alt: "Food Industry", imgSrc: getCdnUrl("/home/introduce.avif"), title: "建設分野", desc: "Food Industry" },
                { alt: "Accommodation Industry", imgSrc: getCdnUrl("/home/introduce.avif"), title: "農業分野", desc: "Accommodation Industry" },
                { alt: "Nursing Care", imgSrc: getCdnUrl("/home/introduce.avif"), title: "水産業", desc: "Nursing Care" },
                { alt: "Building Cleaning", imgSrc: getCdnUrl("/home/introduce.avif"), title: "食品製造・加工", desc: "Building Cleaning" },
                { alt: "Food Industry", imgSrc: getCdnUrl("/home/introduce.avif"), title: "繊維・衣料", desc: "Food Industry" },
                { alt: "Accommodation Industry", imgSrc: getCdnUrl("/home/introduce.avif"), title: "機械・金属加工", desc: "Accommodation Industry" },
            ],
            category2:'TITP'
        },
    ];
    useEffect(() => {
        if (categoryVal) {
            setSelectedCategory(categoryOptions.filter((item) => item.category2 == categoryVal));
        }
    },[])
    return (
        <div>
            {selectedCategory.map((category:any, idx) => (
                <div key={idx} style={{ marginBottom: "2rem" }}>
                   <div className="p-8 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* 图片部分 */}
                            <div>
                                <Image src={category.image}
                                    alt={category.title}
                                    width={735}
                                    height={450}
                                    className="w-full rounded-lg object-cover" loading="lazy" />
                            </div>

                            {/* 文本部分 */}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">{category.title}</h1>
                                <p className="border-t border-blue-500 pt-2">
                                    {category.description}
                                </p>
                            </div>
                        </div>
                    </div>
                    {category.descriptionDiv}
                    <div className="bg-blue-50 p-8">
                        <h2 className="text-xl  text-gray-800 mb-4 text-center">{category.jobSectorsTitle}</h2>
                        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">{category.jobSectorsSubtitle}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {category.jobSectorsOptions.map((sector:any, idx:any) => (
                                <div key={idx} className="flex flex-col items-center">
                                    <Image src={sector.imgSrc}
                                        width={300}
                                        height={120}
                                        className="w-ful  object-cover rounded-lg mb-2" loading="lazy" />
                                    <span className="w-full bg-[#019cd4] text-center text-white roundedtext-center font-bold">
                                        {sector.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>


     
  );
}
