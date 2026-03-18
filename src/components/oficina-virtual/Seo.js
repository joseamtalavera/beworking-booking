
import React from 'react';
import Head from 'next/head';

/**
 * Reusable SEO component for setting meta tags and social sharing info.
 * Usage: <Seo title="..." description="..." image="..." url="..." canonical="..." />
 */
export default function Seo({
  title = 'Oficina Virtual BeWorking - Tu dirección profesional desde 15€/mes',
  description = 'Obtén tu oficina virtual con domicilio legal y fiscal, recepción de paquetería, acceso a espacios físicos, SuperApp y eventos de networking. ¡Impulsa tu negocio con BeWorking! Desde 15€/mes.',
  image = 'https://be-spaces.com/BeWorking_optimized.jpg',
  url = 'https://be-spaces.com/malaga/oficina-virtual',
  canonical = 'https://be-spaces.com/malaga/oficina-virtual',
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={canonical} />
    </Head>
  );
}
