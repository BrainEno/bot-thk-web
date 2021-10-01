import React from 'react';
//eslint-disable-next-line
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { GA_TRACKING_ID } from '../lib/gtag';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="zh">
        <Head>
          <meta charSet="UTF-8" />
          <meta content="width=device-width,initial-scale=1.0" />
          <meta name="theme-color" content="#eff3f8" />
          <meta name="apple-mobile-web-app-status-bar" content="#90cdf4" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/moshIcon.png"></link>
          <link rel="manifest" href="/manifest.json" />
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());
                          gtag('config', '${GA_TRACKING_ID}', {
                            page_path: window.location.pathname,
                          });
                        `
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
