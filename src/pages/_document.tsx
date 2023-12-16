import React from 'react'
//eslint-disable-next-line
import Document, { Head, Html, Main, NextScript } from 'next/document'
class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="shortcut icon" href="/favicon.ico" />
                    <link
                        rel="mask-icon"
                        href="/moshIcon.png"
                        color="#eff3f8"
                    />
                    <link rel="apple-touch-icon" href="/moshIcon.png" />
                    <link rel="manifest" href="/manifest.json" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
