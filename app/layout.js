export default function RootLayout({ children }) {
  const isProduction = process.env.VERCEL_ENV === 'production';

  return (
    <html lang="zh-Hant">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>品心美學 ｜ 彭品心老師官方網站</title>

        {/* <!-- Meta Pixel Code --> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var allowedHosts = ['www.pengpinxin.com', 'pengpinxin.com'];
                if (allowedHosts.indexOf(window.location.hostname) === -1) {
                  window.fbq = function() {};
                  return;
                }

                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '1079390228492766');
                fbq('init', '2001571467480785');
                fbq('track', 'PageView');
              })();
            `,
          }}
        />
        {isProduction && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=1079390228492766&ev=PageView&noscript=1"
              alt=""
            />
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=2001571467480785&ev=PageView&noscript=1"
              alt=""
            />
          </noscript>
        )}
        {/* <!-- End Meta Pixel Code --> */}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
