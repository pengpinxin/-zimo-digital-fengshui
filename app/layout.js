import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <head>
        {/* 全站共用 Google 標籤 (負責收集流量與基礎數據) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-4017889527"
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-4017889527');
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
