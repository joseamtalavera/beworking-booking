import { useState } from 'react';
import Head from 'next/head';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails, Tabs, Tab,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '@/components/common/ScrollReveal';

const CATEGORY_KEYS = ['general', 'spaces', 'platform', 'billing'];

export default function FAQ() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const categoryKey = CATEGORY_KEYS[activeCategory];
  const items = t(`faq.categories.${categoryKey}.items`, { returnObjects: true });

  return (
    <>
      <Head>
        <title>FAQ — BeWorking</title>
        <meta name="description" content="Frequently asked questions about BeWorking — virtual office, spaces, platform, and billing." />
        <link rel="canonical" href="https://be-working.com/faq" />
      </Head>

      <Box
        sx={{
          bgcolor: '#ffffff',
          pt: { xs: '80px', md: '112px' },
          pb: { xs: '64px', md: '80px' },
          px: 3,
          textAlign: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <ScrollReveal direction="up">
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'primary.main', letterSpacing: '0.06em', textTransform: 'uppercase', mb: 2 }}>
            {t('faq.hero.label')}
          </Typography>
          <Typography variant="h2" component="h1" sx={{ color: 'text.primary', maxWidth: 600, mx: 'auto', fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, lineHeight: 1.15 }}>
            {t('faq.hero.heading')}
          </Typography>
          <Typography component="p" sx={{ color: 'text.secondary', maxWidth: 440, mx: 'auto', mt: 4, fontSize: { xs: '1rem', md: '1.125rem' }, lineHeight: 1.6, display: 'block' }}>
            {t('faq.hero.subheading')}
          </Typography>
        </ScrollReveal>
      </Box>

      <Box sx={{ bgcolor: '#fafafa', py: { xs: '80px', md: '112px' }, px: 3 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <ScrollReveal direction="up" delay={0.05}>
            <Tabs
              value={activeCategory}
              onChange={(_, v) => { setActiveCategory(v); setExpanded(false); }}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                mb: 5,
                '& .MuiTabs-indicator': { bgcolor: 'primary.main' },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 400,
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  '&.Mui-selected': { color: 'text.primary', fontWeight: 500 },
                },
              }}
            >
              {CATEGORY_KEYS.map((key) => (
                <Tab key={key} label={t(`faq.categories.${key}.label`)} />
              ))}
            </Tabs>
          </ScrollReveal>

          {Array.isArray(items) && items.map((item, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.06}>
              <Accordion
                expanded={expanded === i}
                onChange={(_, open) => setExpanded(open ? i : false)}
                disableGutters
                elevation={0}
                sx={{
                  mb: 1.5,
                  borderRadius: '10px !important',
                  border: '1px solid rgba(0,0,0,0.07)',
                  bgcolor: '#ffffff',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary', fontSize: 20 }} />}
                  sx={{ px: 2.5, py: 0.5, '& .MuiAccordionSummary-content': { my: 1.75 } }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', pr: 2 }}>
                    {item.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>
                    {item.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </ScrollReveal>
          ))}
        </Box>
      </Box>
    </>
  );
}
