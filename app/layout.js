export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>品心美學 ｜ 彭品心老師官方網站</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
