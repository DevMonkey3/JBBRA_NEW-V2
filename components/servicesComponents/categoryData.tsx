import { Construction, SSW, TITP } from '@/components/servicesComponents/descriptionDiv';
import type { CategoryItem, CategoryKey } from './Category.types';
import { getCdnUrl } from '@/config/cdn';

export const CATEGORY_MAP: Record<CategoryKey, CategoryItem> = {
  construction: {
    key: 'construction',
    title: '外国人材のための新しいチャンス、日本で働こう！',
    image: getCdnUrl('/home/introduce.avif'),
    description:
      '日本では少子高齢化による深刻な労働力不足が続いています。これを解決するために、2019年に導入されたのが「特定技能（SSW：Specified Skilled Worker）」の在留資格です。特定技能制度により、外国人が正式な労働者として日本の12の産業で働くことが可能になりました。',
    descriptionDiv: <Construction />,
    jobSectorsTitle: 'Job Sectors under the SSW program',
    jobSectorsSubtitle: '特定技能における職種',
    jobSectorsOptions: [
      { alt: 'Food Industry', imgSrc: getCdnUrl('/home/introduce.avif'), title: '外食業', desc: 'Food Industry' },
      { alt: 'Accommodation Industry', imgSrc: getCdnUrl('/home/introduce.avif'), title: '宿泊業', desc: 'Accommodation Industry' },
      { alt: 'Nursing Care', imgSrc: getCdnUrl('/home/introduce.avif'), title: '介護', desc: 'Nursing Care' },
      { alt: 'Building Cleaning', imgSrc: getCdnUrl('/home/introduce.avif'), title: 'ビルクリーニング業', desc: 'Building Cleaning' },
    ],
  },

  hsp: {
    key: 'hsp',
    title: '高度専門職（Highly Skilled Professional）とは',
    image: getCdnUrl('/home/introduce.avif'),
    description:
      '日本の高度専門職（Highly Skilled Professional, HSP）は、優れた専門的知識や技術を持つ外国人材を受け入れるための特別な在留資格です。高度な人材を受け入れることで、日本の経済成長、研究開発、国際競争力の強化を目的としています。',
    descriptionDiv: <SSW />,
    jobSectorsTitle: 'Job Sectors under the Highly Skilled Professional',
    jobSectorsSubtitle: '代表的な高度人材職種（バングラデシュ人向け）',
    jobSectorsOptions: [
      { alt: 'IT Engineer', imgSrc: getCdnUrl('/home/introduce.avif'), title: 'ITエンジニア', desc: 'IT Engineer' },
      { alt: 'Mechanical Engineer', imgSrc: getCdnUrl('/home/introduce.avif'), title: '機械エンジニア', desc: 'Mechanical Engineer' },
      { alt: 'Electrical/Electronic Engineer', imgSrc: getCdnUrl('/home/introduce.avif'), title: '電気・電子エンジニア', desc: 'Electrical/Electronic Engineer' },
      { alt: 'CAD/Designer', imgSrc: getCdnUrl('/home/introduce.avif'), title: 'CADオペレーター・設計士', desc: 'CAD / Designer' },
      { alt: 'R&D', imgSrc: getCdnUrl('/home/introduce.avif'), title: '研究開発職', desc: 'R&D' },
      { alt: 'Interpreter/Translator', imgSrc: getCdnUrl('/home/introduce.avif'), title: '通訳・翻訳', desc: 'Interpreter / Translator' },
      { alt: 'Trade/Admin/Sales', imgSrc: getCdnUrl('/home/introduce.avif'), title: '貿易事務・海外営業', desc: 'Trade / Admin / Sales' },
      { alt: 'Management', imgSrc: getCdnUrl('/home/introduce.avif'), title: '経営・管理職', desc: 'Management' },
    ],
  },

  titp: {
    key: 'titp',
    title: '技能実習制度（TITP）バングラデシュ人材および送出し機関向け',
    image: getCdnUrl('/home/introduce.avif'),
    description:
      '技能実習制度（TITP）は、日本政府が管理するプログラムで、開発途上国に対して実践的な産業技術・技能・知識を移転することを目的としています。これにより、実習生の母国（バングラデシュ）の人材育成と経済発展に貢献します。',
    descriptionDiv: <TITP />,
    jobSectorsTitle: 'Job Sectors under the TITP',
    jobSectorsSubtitle: '代表的な職種（技能実習）',
    jobSectorsOptions: [
      { alt: 'Construction', imgSrc: getCdnUrl('/home/introduce.avif'), title: '建設分野', desc: 'Construction' },
      { alt: 'Agriculture', imgSrc: getCdnUrl('/home/introduce.avif'), title: '農業分野', desc: 'Agriculture' },
      { alt: 'Fishery', imgSrc: getCdnUrl('/home/introduce.avif'), title: '水産業', desc: 'Fishery' },
      { alt: 'Food Processing', imgSrc: getCdnUrl('/home/introduce.avif'), title: '食品製造・加工', desc: 'Food Processing' },
      { alt: 'Textile/Garment', imgSrc: getCdnUrl('/home/introduce.avif'), title: '繊維・衣料', desc: 'Textile / Garment' },
      { alt: 'Machinery/Metalwork', imgSrc: getCdnUrl('/home/introduce.avif'), title: '機械・金属加工', desc: 'Machinery / Metalwork' },
    ],
  },
};
