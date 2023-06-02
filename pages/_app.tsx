import '../public/noto-sans-sc/index.css'
import '../styles/main.scss'
import '../node_modules/react-quill/dist/quill.snow.css'

import { useEffect } from 'react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { SWRConfig } from 'swr'

import Header from '../components/header/Header'
import { fetcher } from '../graphql/gqlClient'
import * as gtag from '../helpers/gtag'

function MyApp({
    Component,
    pageProps,
}: AppProps<{ initialReduxState: any }>) {
    const router = useRouter()

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            gtag.pageview(url)
        }
        router.events.on('routeChangeComplete', handleRouteChange)
        router.events.on('hashChangeComplete', handleRouteChange)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
            router.events.off('hashChangeComplete', handleRouteChange)
        }
    }, [router.events])

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
            />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
                }}
            />
            <SWRConfig value={{ fetcher }}>
                    {/* <Provider store={store}> */}
                        <Header />
                        <Component {...pageProps} />
                    {/* </Provider> */}
            </SWRConfig>
        </>
    )
}

export default MyApp
