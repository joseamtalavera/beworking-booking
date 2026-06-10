import Seo from '@/seo/Seo';
import { useTranslation } from 'react-i18next';
import EvolvedFaqTeaser from '@/components/home/EvolvedFaqTeaser';

export default function FAQ() {
  const { t } = useTranslation();
  return (
    <>
      <Seo
        title={t('home.evolved.meta.faqTitle', 'FAQ — BeWorking')}
        description={t(
          'home.evolved.meta.faqDescription',
          'Frequently asked questions about BeWorking — virtual office, spaces, platform, and billing.',
        )}
        canonical="https://be-working.com/faq"
      />
      <EvolvedFaqTeaser />
    </>
  );
}
