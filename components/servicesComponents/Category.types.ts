export type Sector = {
  alt: string;
  imgSrc: string;
  title: string;
  desc?: string;
};

export type CategoryKey = 'construction' | 'hsp' | 'titp';

export type CategoryItem = {
  key: CategoryKey;
  title: string;
  image: string;
  description: string;
  descriptionDiv: JSX.Element;
  jobSectorsTitle: string;
  jobSectorsSubtitle: string;
  jobSectorsOptions: Sector[];
};

export type CategoryProps = {
  /** Which category to render */
  categoryVal: CategoryKey;
  /** Optional className for outer wrapper */
  className?: string;
};
