import React from 'react';
//eslint-disable-next-line
import Document, { Head, Html, Main, NextScript } from 'next/document';
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
