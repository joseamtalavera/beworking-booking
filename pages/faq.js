import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import EvolvedFaqTeaser from '@/components/home/EvolvedFaqTeaser';

export default function FAQ() {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('home.evolved.meta.faqTitle', 'FAQ — BeWorking')}</title>
        <meta
          name="description"
          content={t(
            'home.evolved.meta.faqDescription',
            'Frequently asked questions about BeWorking — virtual office, spaces, platform, and billing.',
          )}
        />
        <link rel="canonical" href="https://be-working.com/faq" />
      </Head>
      <EvolvedFaqTeaser />
    </>
  );
}
