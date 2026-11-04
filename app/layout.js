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
        {/* 頁面標題與 meta 保持在這裡 */}
      </head>
      <body>
        {/* 🚀 Google tag (gtag.js) 轉換追蹤代碼（已更新為新 ID 並移至 body 內） */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-698879369"
          strategy="afterInteractive"
        />
        <Script id="google-gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-698879369');
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}
