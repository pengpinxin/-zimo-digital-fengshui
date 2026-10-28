export const metadata = {
  title: '品心美學 · 紫墨數字風水',
  description: '學術文學與數字風水美學空間',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
