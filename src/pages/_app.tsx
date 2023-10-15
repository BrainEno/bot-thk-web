import '../../public/noto-sans-sc/index.css'
import '../styles/main.scss'
import '../../node_modules/react-quill/dist/quill.snow.css'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { GoogleAnalytics } from 'nextjs-google-analytics'

import GraphqlProvider from '../components/graphql/GraphqlProvider'
import Header from '../components/header/Header'
import RefreshTokenHandler from '../components/RefreshTokenHandler'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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
    pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
    const [interval, setInterval] = useState(300000)

    return (
        <>
            <SessionProvider session={session} refetchInterval={interval}>
                <GraphqlProvider>
                    <QueryClientProvider client={queryClient}>
                        <ReactQueryDevtools initialIsOpen={true} />
                        <Header />
                        <GoogleAnalytics trackPageViews strategy="lazyOnload" />
                        <Component {...pageProps} />
                        <RefreshTokenHandler setInterval={setInterval} />
                    </QueryClientProvider>
                </GraphqlProvider>
            </SessionProvider>
        </>
    )
}

export default MyApp
