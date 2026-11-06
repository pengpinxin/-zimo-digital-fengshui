import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-698879369"
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-698879369');
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
