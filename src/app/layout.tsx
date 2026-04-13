import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '兴盛艺 - AI驱动的智能命理分析平台',
    template: '%s | 兴盛艺',
  },
  description:
    '八字命理、紫微斗数、易经占卜 - AI驱动的中华传统命理分析，精准排盘+深度解读+命理选品',
  keywords: [
    '兴盛艺',
    '八字命理',
    '紫微斗数',
    '易经占卜',
    'AI算命',
    '命理分析',
    '五行分析',
    '大运流年',
    '命理选品',
  ],
  authors: [{ name: '兴盛艺', url: 'https://xingshengyi.com' }],
  generator: 'Coze Code',
  openGraph: {
    title: '兴盛艺 - AI驱动的智能命理分析平台',
    description:
      '基于传统易学理论，结合现代AI技术，为您提供专业、精准的命理分析服务。精准排盘 + AI深度解读 + 命理选品推荐。',
    url: 'https://xingshengyi.com',
    siteName: '兴盛艺',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="en">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
