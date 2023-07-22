import '../../public/noto-sans-sc/index.css'
import '../styles/main.scss'
import '../../node_modules/react-quill/dist/quill.snow.css'

import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { Provider } from 'urql'

import Header from '../components/header/Header'
import { urqlClient } from '../graphql/urqlClient'
import * as gtag from '../helpers/gtag'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps<{ initialReduxState: any }>) {
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
            <Provider value={urqlClient}>
                <QueryClientProvider client={queryClient}>
                    <Header />
                        <Component {...pageProps} />
                </QueryClientProvider>
            </Provider>
        </>
    )
}

export default MyApp
