import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { Link as MuiLink } from '@mui/material';
import LegalShell, { Section, P, Field, LegalList } from '@/components/common/LegalShell';
import { tokens } from '@/theme/tokens';

const { colors } = tokens;
const linkSx = { color: colors.brand, '&:hover': { color: colors.brandDeep } };

export default function PoliticaPrivacidad() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const aepdLink = (
    <MuiLink href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" sx={linkSx}>
      www.aepd.es
    </MuiLink>
  );
  const emailLink = (
    <MuiLink href="mailto:info@be-working.com" sx={linkSx}>info@be-working.com</MuiLink>
  );

  return (
    <>
      <Head>
        <title>{`${t('privacy.title')} — BeWorking`}</title>
        <meta name="description" content={t('privacy.intro').slice(0, 160)} />
        <link rel="canonical" href="https://be-working.com/politica-de-privacidad" />
      </Head>
      <LegalShell
        title={t('privacy.title')}
        lastUpdated={t('privacy.lastUpdated')}
        intro={t('privacy.intro')}
        showEnDisclaimer={isEn}
        disclaimer={t('legal.disclaimerEn')}
      >
        <Section id="responsable" title={t('privacy.s1Title')}>
          <Field label={t('privacy.s1IdentityLabel')}>{t('privacy.s1IdentityValue')}</Field>
          <Field label={t('privacy.s1CifLabel')}>{t('privacy.s1CifValue')}</Field>
          <Field label={t('privacy.s1AddressLabel')}>{t('privacy.s1AddressValue')}</Field>
          <Field label={t('privacy.s1EmailLabel')}>{t('privacy.s1EmailValue')}</Field>
          <Field label={t('privacy.s1DpoLabel')}>{t('privacy.s1DpoValue')}</Field>
        </Section>

        <Section id="datos" title={t('privacy.s2Title')}>
          <P>{t('privacy.s2Intro')}</P>
          <LegalList>
            <li>{t('privacy.s2B1')}</li>
            <li>{t('privacy.s2B2')}</li>
            <li>{t('privacy.s2B3')}</li>
            <li>{t('privacy.s2B4')}</li>
            <li>{t('privacy.s2B5')}</li>
          </LegalList>
        </Section>

        <Section id="finalidad" title={t('privacy.s3Title')}>
          <P>{t('privacy.s3Intro')}</P>
          <LegalList>
            <li>{t('privacy.s3B1')}</li>
            <li>{t('privacy.s3B2')}</li>
            <li>{t('privacy.s3B3')}</li>
            <li>{t('privacy.s3B4')}</li>
            <li>{t('privacy.s3B5')}</li>
            <li>{t('privacy.s3B6')}</li>
          </LegalList>
        </Section>

        <Section id="base-juridica" title={t('privacy.s4Title')}>
          <LegalList>
            <li><strong>{t('privacy.s4B1Label')}</strong> {t('privacy.s4B1Body')}</li>
            <li><strong>{t('privacy.s4B2Label')}</strong> {t('privacy.s4B2Body')}</li>
            <li><strong>{t('privacy.s4B3Label')}</strong> {t('privacy.s4B3Body')}</li>
            <li><strong>{t('privacy.s4B4Label')}</strong> {t('privacy.s4B4Body')}</li>
          </LegalList>
        </Section>

        <Section id="conservacion" title={t('privacy.s5Title')}>
          <P>{t('privacy.s5Body')}</P>
        </Section>

        <Section id="destinatarios" title={t('privacy.s6Title')}>
          <P>{t('privacy.s6Intro')}</P>
          <LegalList>
            <li>{t('privacy.s6B1')}</li>
            <li>{t('privacy.s6B2')}</li>
            <li>{t('privacy.s6B3')}</li>
          </LegalList>
          <P>{t('privacy.s6Closing')}</P>
        </Section>

        <Section id="transferencias" title={t('privacy.s7Title')}>
          <P>{t('privacy.s7Body')}</P>
        </Section>

        <Section id="derechos" title={t('privacy.s8Title')}>
          <P>{t('privacy.s8Intro')}</P>
          <LegalList>
            <li>{t('privacy.s8B1')}</li>
            <li>{t('privacy.s8B2')}</li>
            <li>{t('privacy.s8B3')}</li>
            <li>{t('privacy.s8B4')}</li>
            <li>{t('privacy.s8B5')}</li>
            <li>{t('privacy.s8B6')}</li>
            <li>{t('privacy.s8B7')}</li>
            <li>{t('privacy.s8B8')}</li>
          </LegalList>
          <P>
            {t('privacy.s8Closing', { email: '__EMAIL__' })
              .split(/(__EMAIL__)/)
              .map((part, i) => (part === '__EMAIL__' ? <span key={i}>{emailLink}</span> : part))}
          </P>
        </Section>

        <Section id="reclamacion" title={t('privacy.s9Title')}>
          <P>
            {t('privacy.s9Body', { aepdLink: '__AEPD__' })
              .split(/(__AEPD__)/)
              .map((part, i) => (part === '__AEPD__' ? <span key={i}>{aepdLink}</span> : part))}
          </P>
        </Section>

        <Section id="seguridad" title={t('privacy.s10Title')}>
          <P>{t('privacy.s10Body')}</P>
        </Section>

        <Section id="cambios" title={t('privacy.s11Title')}>
          <P>{t('privacy.s11Body')}</P>
        </Section>
      </LegalShell>
    </>
  );
}
