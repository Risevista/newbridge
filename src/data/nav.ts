export interface NavItem {
  href: string;
  text: string;
  submenu?: Array<{ href: string; text: string }>;
}

export const navItems: NavItem[] = [
  { href: '/', text: 'ホーム' },
  { href: '/#company', text: '会社概要' },
  { href: '/providers', text: 'ご契約者様へ' },
  { href: '/members', text: '社員紹介' },
  { href: '/solicitation', text: '勧誘方針' },
  { href: '/privacy', text: 'プライバシーポリシー' },
  { href: '/contact', text: 'お問い合わせ' },
];
