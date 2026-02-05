import * as React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import createEmotionCache from '@/createEmotionCache';
import theme from '@/theme';
import AppLayout from '@/components/layout/AppLayout';
import '@/styles/globals.css';

const clientSideEmotionCache = createEmotionCache();

const queryClient = new QueryClient();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>BeWorking Booking</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </QueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
