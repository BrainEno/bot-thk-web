import '@fontsource/noto-sans-sc/400.css';
import '@fontsource/noto-sans-sc/500.css';
import '@fontsource/noto-sans-sc/700.css';
import '../styles/main.scss';
import Header from '../components/Header';
import '../node_modules/react-quill/dist/quill.snow.css';
import { Provider } from 'react-redux';
import { useStore } from '../redux/store';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import * as gtag from '../lib/gtag';

function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Provider store={store}>
        <Header />
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
