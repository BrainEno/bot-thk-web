import '../../public/noto-sans-sc/index.css'
import '../styles/main.scss'
import '../../node_modules/react-quill/dist/quill.snow.css'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import { Provider } from 'urql'

import Header from '../components/header/Header'
import RefreshTokenHandler from '../components/RefreshTokenHandler'
import { urqlClient } from '../graphql/urqlClient'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
        },
    },
})

function MyApp({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
    const [interval, setInterval] = useState(0)

    return (
        <>
            <SessionProvider session={session} refetchInterval={interval}>
                <Provider value={urqlClient}>
                    <QueryClientProvider client={queryClient}>
                        <Header />
                        <GoogleAnalytics trackPageViews strategy="lazyOnload" />
                        <Component {...pageProps} />
                        <RefreshTokenHandler setInterval={setInterval} />
                    </QueryClientProvider>
                </Provider>
            </SessionProvider>
        </>
    )
}

export default MyApp
