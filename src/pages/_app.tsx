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
