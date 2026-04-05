import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '@/createEmotionCache';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T5BD4L36');`,
            }}
          />  
          <link rel="icon" href="/new_favicon.png" />
          <meta name="theme-color" content="#009624" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
          <meta name="description" content="Salas de reuniones, coworking y oficinas virtuales en Malaga. Reserva tu espacio ideal en BeWorking." />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="BeWorking — Espacios de trabajo en Malaga" />
          <meta property="og:description" content="Salas de reuniones, coworking y oficinas virtuales — encuentra el espacio ideal para tu negocio." />
          <meta property="og:image" content="https://be-working.com/og-image.jpg" />
          <meta property="og:url" content="https://be-working.com" />
          <meta property="og:site_name" content="BeWorking" />
          <link rel="alternate" hreflang="es" href="https://be-working.com" />
          <link rel="alternate" hreflang="en" href="https://be-working.com" />
        </Head>
        <body>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T5BD4L36"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
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
