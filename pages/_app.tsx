// import '@fontsource/noto-sans-sc/400.css';
// import '@fontsource/noto-sans-sc/500.css';
// import '@fontsource/noto-sans-sc/700.css';
import '../public/noto-sans-sc/index.css';
import '../styles/main.scss';
import '../node_modules/react-quill/dist/quill.snow.css';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import Header from '../components/Header';
import * as gtag from '../helpers/gtag';
import { useStore } from '../redux/store';

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
