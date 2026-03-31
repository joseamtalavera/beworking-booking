import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '@/createEmotionCache';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          <link rel="icon" href="/new_favicon.png" />
          <meta name="theme-color" content="#009624" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
          <meta name="description" content="Salas de reuniones, coworking y oficinas virtuales en Malaga. Reserva tu espacio ideal en BeSpaces." />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="BeSpaces — Espacios de trabajo en Malaga" />
          <meta property="og:description" content="Salas de reuniones, coworking y oficinas virtuales — encuentra el espacio ideal para tu negocio." />
          <meta property="og:image" content="https://be-spaces.com/og-image.jpg" />
          <meta property="og:url" content="https://be-spaces.com" />
          <meta property="og:site_name" content="BeSpaces" />
          <link rel="alternate" hreflang="es" href="https://be-spaces.com" />
          <link rel="alternate" hreflang="en" href="https://be-spaces.com" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags],
  };
};
