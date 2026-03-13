// data/nav.js

/**
 * Global navigation items for both desktop and mobile menus.
 * Each item has: label (JP text), href (Next.js route), optional children for dropdowns.
 */

const navItems = [
  {
    label: 'ホーム',
    href: '/',
  },
  {
    label: '会社情報',
    href: '/(site)/about',
    children: [
      { label: '会社概要', href: '/(site)/about' },
      { label: '採用情報', href: '/(site)/careers' },
    ],
  },
  {
    label: 'サービス',
    href: '/(site)/services',
  },
  {
    label: '導入事例',
    href: '/(site)/cases',
  },
  {
    label: 'ニュース',
    href: '/(site)/news',
  },
  {
    label: 'ブログ',
    href: '/(site)/resources/blog',
  },
  {
    label: 'FAQ',
    href: '/(site)/faq',
  },
  {
    label: 'お問い合わせ',
    href: '/(site)/contact',
  },
  {
    label: '資料ダウンロード',
    href: '/(site)/resources/downloads',
  },
  {
    label: 'プライバシーポリシー',
    href: '/(legal)/privacy',
  },
  {
    label: '利用規約',
    href: '/(legal)/terms',
  },
];

export default navItems;
