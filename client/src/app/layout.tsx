import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '墟界 - 魔力寶貝風格放置遊戲',
  description: '一款融合經典魔力寶貝元素的半放置型網頁遊戲',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen bg-gradient-to-br from-gold-50 to-amber-50">
        {children}
      </body>
    </html>
  );
}
