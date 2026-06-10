import Head from 'next/head';
import { siteMeta } from '@/seo/siteMeta';

/**
 * Generic SEO head component — single place that emits title, description,
 * canonical, Open Graph and Twitter Card tags. Props are pre-resolved strings
 * (resolve i18n / data in the page, pass the final string here).
 *
 * Usage:
 *   <Seo
 *     title="Salas de reunión en Málaga | BeWorking"
 *     description="…"
 *     canonical="https://be-working.com/malaga/salas-de-reunion"
 *   />
 *
 * Defaults (share image, site name, twitter card) come from siteMeta so the
 * brand stays consistent without repeating constants on every page.
 */
export default function Seo({
  title = siteMeta.defaultTitle,
  description = siteMeta.defaultDescription,
  canonical = siteMeta.siteUrl,
  image = siteMeta.defaultShareImage,
  noindex = false,
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} key="description" />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,follow" key="robots" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:site_name" content={siteMeta.siteName} key="og:site_name" />
      <meta property="og:title" content={title} key="og:title" />
      <meta property="og:description" content={description} key="og:description" />
      <meta property="og:image" content={image} key="og:image" />
      <meta property="og:url" content={canonical} key="og:url" />

      {/* Twitter */}
      <meta name="twitter:card" content={siteMeta.twitterCard} key="twitter:card" />
      <meta name="twitter:title" content={title} key="twitter:title" />
      <meta name="twitter:description" content={description} key="twitter:description" />
      <meta name="twitter:image" content={image} key="twitter:image" />
    </Head>
  );
}
