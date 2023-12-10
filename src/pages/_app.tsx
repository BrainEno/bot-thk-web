import '../../public/noto-sans-sc/index.css'
import '../styles/main.scss'
import '../../node_modules/react-quill/dist/quill.snow.css'

import { useState } from 'react'
import {
    DehydratedState,
    HydrationBoundary,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { GoogleAnalytics } from 'nextjs-google-analytics'

import ThemeProvider from '../components/context/ThemeContext'
import GraphqlProvider from '../components/graphql/GraphqlProvider'
import Header from '../components/header/Header'
import RefreshTokenHandler from '../components/RefreshTokenHandler'
import Head from 'next/head'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            structuralSharing: false,
        },
    },
})

function MyApp({
    Component,
    pageProps: { session, dehydratedState, ...pageProps },
}: AppProps<{ session: Session; dehydratedState: DehydratedState }>) {
    const [interval, setInterval] = useState(300000)

    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width,user-scalable=no,initial-scale=1.0,maximum-scale=1,minimum-scale=1,target-densitydpi=device-dpi"
                />
                <meta
                    name="description"
                    content="A cruel literature blog publishing platform"
                />
                <meta name="theme-color" content="#eff3f8" />
                <meta
                    name="apple-mobile-web-app-status-bar"
                    content="#90cdf4"
                />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:url" content="https://bot-thk.vercel.app" />
                <meta property="og:type" content="website" />
                <meta
                    property="og:title"
                    content="A cruel literature blog publishing platform"
                />
                <meta
                    property="og:description"
                    content="A cruel literature blog publishing platform"
                />
                <meta property="og:site_name" content="BOT THK" />
                <meta property="og:url" content="https://bot-thk.vercel.app" />
                <meta property="og:image" content="/logo.svg" />
            </Head>
            <SessionProvider session={session} refetchInterval={interval}>
                <GraphqlProvider>
                    <QueryClientProvider client={queryClient}>
                        <HydrationBoundary state={dehydratedState}>
                            <ThemeProvider>
                                <ReactQueryDevtools initialIsOpen={false} />
                                <Header />
                                <GoogleAnalytics
                                    trackPageViews
                                    strategy="lazyOnload"
                                />
                                <Component {...pageProps} />
                                <Analytics />
                                <RefreshTokenHandler
                                    setInterval={setInterval}
                                />
                            </ThemeProvider>
                        </HydrationBoundary>
                    </QueryClientProvider>
                </GraphqlProvider>
            </SessionProvider>
        </>
    )
}

export default MyApp
