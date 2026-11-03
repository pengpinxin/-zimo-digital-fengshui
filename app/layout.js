import Script from 'next/script';

export const metadata = {
  title: '品心美學 ‧ 紫墨數字風水',
  description: '學術文學與數字風水美學空間',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <head>
        {/* 🚀 Google tag (gtag.js) 轉換追蹤代碼 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-702897496"
          strategy="afterInteractive"
        />
        <Script id="google-gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-702897496');
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
