import '../../public/noto-sans-sc/index.css'
import '../styles/main.scss'
import '../../node_modules/react-quill/dist/quill.snow.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProps } from 'next/app'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import { Provider } from 'urql'

import Header from '../components/header/Header'
import { urqlClient } from '../graphql/urqlClient'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
        },
    },
})

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Provider value={urqlClient}>
                <QueryClientProvider client={queryClient}>
                    <Header />
                    <GoogleAnalytics trackPageViews strategy="lazyOnload" />
                    <Component {...pageProps} />
                </QueryClientProvider>
            </Provider>
        </>
    )
}

export default MyApp
