import * as React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import createEmotionCache from '@/createEmotionCache';
import theme from '@/theme';
import AppLayout from '@/components/layout/AppLayout';
import i18n from '../src/i18n/i18n';
import '@/styles/globals.css';

const clientSideEmotionCache = createEmotionCache();

const queryClient = new QueryClient();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  React.useEffect(() => {
    // Priority order:
    //  1. The user's previous explicit choice (localStorage) — never override.
    //  2. Auto-detect from browser locale: ES for any 'es-*' (Spain, LatAm),
    //     EN for everything else. Default i18n.js lng is 'es' so SSR renders
    //     Spanish; this only changes the language for non-Spanish browsers.
    const saved = localStorage.getItem('beworking_lang');
    if (saved) {
      if (saved !== i18n.language) i18n.changeLanguage(saved);
      return;
    }
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    const detected = browserLang.startsWith('es') ? 'es' : 'en';
    if (detected !== i18n.language) i18n.changeLanguage(detected);
  }, []);

  const getLayout = Component.getLayout || ((page) => <AppLayout>{page}</AppLayout>);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>BeWorking Booking</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          {getLayout(<Component {...pageProps} />)}
        </QueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
