
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Head from 'next/head';
import { Box, Typography, IconButton, ButtonBase } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography } = tokens;

const SPACES_TOTAL = 38;
const EVENTS_TOTAL = 65;

// Events tab is people-only; these numbers are catering/kitchen shots without attendees.
const EVENTS_DROPPED = new Set([26, 31, 50, 58]);

const spacesPhotos = Array.from({ length: SPACES_TOTAL }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return { full: `/gallery/full/${n}.webp`, thumb: `/gallery/thumb/${n}.webp` };
});

const eventsPhotos = Array.from({ length: EVENTS_TOTAL }, (_, i) => i + 1)
  .filter((n) => !EVENTS_DROPPED.has(n))
  .map((n) => {
    const s = String(n).padStart(3, '0');
    return { full: `/gallery/events/full/${s}.webp`, thumb: `/gallery/events/thumb/${s}.webp` };
  });

const videos = [
  { src: '/gallery/videos/ad-square-2026.mp4',   poster: '/gallery/videos/posters/ad-square-2026.jpg',   shape: 'square',   titleEs: 'BeWorking · 1:1', titleEn: 'BeWorking · 1:1' },
  { src: '/gallery/videos/ad-vertical-2026.mp4', poster: '/gallery/videos/posters/ad-vertical-2026.jpg', shape: 'vertical', titleEs: 'BeWorking · 4:5', titleEn: 'BeWorking · 4:5' },
];

const Tile = ({ src, alt, onClick, delay, aspect = '3 / 2' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      onClick={onClick}
      sx={{
        position: 'relative',
        cursor: 'zoom-in',
        overflow: 'hidden',
        borderRadius: `${radius.md}px`,
        bgcolor: colors.bgSoft,
        aspectRatio: aspect,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity ${motion.durationSlow} ${motion.ease} ${delay}s, transform ${motion.durationSlow} ${motion.ease} ${delay}s`,
        '& img': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: `transform 600ms ${motion.ease}`,
        },
        '&:hover img': { transform: 'scale(1.04)' },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          boxShadow: `inset 0 0 0 1px ${colors.line}`,
          pointerEvents: 'none',
        },
      }}
    >
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </Box>
  );
};

const VideoTile = ({ video, onClick, delay }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ButtonBase
      ref={ref}
      onClick={onClick}
      focusRipple
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: `${radius.md}px`,
        bgcolor: colors.bgSoft,
        aspectRatio: '16 / 9',
        display: 'block',
        textAlign: 'left',
        width: '100%',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity ${motion.durationSlow} ${motion.ease} ${delay}s, transform ${motion.durationSlow} ${motion.ease} ${delay}s`,
        '& img': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: `transform 600ms ${motion.ease}`,
        },
        '&:hover img': { transform: 'scale(1.04)' },
        '&:hover .play-badge': { transform: 'translate(-50%, -50%) scale(1.05)' },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          boxShadow: `inset 0 0 0 1px ${colors.line}`,
          pointerEvents: 'none',
        },
      }}
    >
      <img src={video.poster} alt={video.titleEs} loading="lazy" decoding="async" />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15,18,22,0) 55%, rgba(15,18,22,0.45) 100%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        className="play-badge"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.92)',
          color: colors.ink,
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          transition: `transform 240ms ${motion.ease}`,
          pointerEvents: 'none',
        }}
      >
        <PlayArrowRoundedIcon sx={{ fontSize: 36, ml: '4px' }} />
      </Box>
    </ButtonBase>
  );
};

const Lightbox = ({ photos, index, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  if (index === null || !photos[index]) return null;

  return (
    <Box
      onClick={onClose}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        bgcolor: 'rgba(15, 18, 22, 0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: `fadeIn ${motion.durationFast} ${motion.ease}`,
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <IconButton
        aria-label="Close"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        sx={{
          position: 'absolute',
          top: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
          color: '#fff',
          bgcolor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
        }}
      >
        <CloseRoundedIcon />
      </IconButton>

      <IconButton
        aria-label="Previous"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        sx={{
          position: 'absolute',
          left: { xs: 8, md: 24 },
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#fff',
          bgcolor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
        }}
      >
        <ChevronLeftRoundedIcon fontSize="large" />
      </IconButton>

      <IconButton
        aria-label="Next"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        sx={{
          position: 'absolute',
          right: { xs: 8, md: 24 },
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#fff',
          bgcolor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
        }}
      >
        <ChevronRightRoundedIcon fontSize="large" />
      </IconButton>

      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          maxWidth: { xs: '92vw', md: '88vw' },
          maxHeight: { xs: '78vh', md: '86vh' },
          position: 'relative',
        }}
      >
        <Box
          component="img"
          src={photos[index].full}
          alt={`BeWorking ${index + 1}`}
          sx={{
            maxWidth: { xs: '92vw', md: '88vw' },
            maxHeight: { xs: '78vh', md: '86vh' },
            objectFit: 'contain',
            display: 'block',
            borderRadius: `${radius.md}px`,
          }}
        />
      </Box>

      <Typography
        sx={{
          position: 'absolute',
          bottom: { xs: 20, md: 32 },
          left: 0,
          right: 0,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.78)',
          fontSize: '0.85rem',
          fontWeight: 500,
          letterSpacing: '0.04em',
        }}
      >
        {index + 1} / {photos.length}
      </Typography>
    </Box>
  );
};

const VideoModal = ({ video, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!video) return null;

  const aspect = video.shape === 'square' ? '1 / 1' : video.shape === 'vertical' ? '4 / 5' : '16 / 9';
  const maxW = video.shape === 'vertical' ? { xs: '88vw', md: '480px' } : video.shape === 'square' ? { xs: '92vw', md: '640px' } : { xs: '94vw', md: '1100px' };

  return (
    <Box
      onClick={onClose}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        bgcolor: 'rgba(15, 18, 22, 0.94)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: `fadeIn ${motion.durationFast} ${motion.ease}`,
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <IconButton
        aria-label="Close"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        sx={{
          position: 'absolute',
          top: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
          color: '#fff',
          bgcolor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
        }}
      >
        <CloseRoundedIcon />
      </IconButton>

      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: maxW,
          maxHeight: '86vh',
          aspectRatio: aspect,
          borderRadius: `${radius.md}px`,
          overflow: 'hidden',
          bgcolor: '#000',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}
      >
        <Box
          component="video"
          src={video.src}
          poster={video.poster}
          controls
          autoPlay
          muted
          playsInline
          preload="auto"
          sx={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain', bgcolor: '#000' }}
        />
      </Box>
    </Box>
  );
};

const TabButton = ({ active, label, onClick }) => (
  <ButtonBase
    onClick={onClick}
    sx={{
      px: { xs: 2, md: 2.5 },
      py: 1,
      borderRadius: 999,
      fontFamily: typography.fontFamily,
      fontSize: '0.92rem',
      fontWeight: 600,
      letterSpacing: '0.01em',
      color: active ? '#fff' : colors.ink2,
      bgcolor: active ? colors.ink : 'transparent',
      border: `1px solid ${active ? colors.ink : colors.line}`,
      transition: `background-color 200ms ${motion.ease}, color 200ms ${motion.ease}, border-color 200ms ${motion.ease}`,
      '&:hover': {
        bgcolor: active ? colors.ink : colors.bgSoft,
        borderColor: active ? colors.ink : colors.ink2,
      },
    }}
  >
    {label}
  </ButtonBase>
);

export default function GaleriaPage() {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === 'es';
  const [section, setSection] = useState('spaces');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace('#', '');
    if (hash === 'events' || hash === 'videos' || hash === 'spaces') {
      setSection(hash);
    }
  }, []);

  const currentPhotos = section === 'events' ? eventsPhotos : spacesPhotos;

  const open = useCallback((i) => setLightboxIndex(i), []);
  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() => setLightboxIndex((i) => {
    if (i === null) return null;
    return i === 0 ? currentPhotos.length - 1 : i - 1;
  }), [currentPhotos.length]);
  const next = useCallback(() => setLightboxIndex((i) => {
    if (i === null) return null;
    return i === currentPhotos.length - 1 ? 0 : i + 1;
  }), [currentPhotos.length]);

  const tabs = useMemo(() => ([
    { key: 'spaces', label: isEs ? 'Espacios' : 'Spaces' },
    { key: 'events', label: isEs ? 'Eventos' : 'Events' },
    { key: 'videos', label: isEs ? 'Vídeos' : 'Videos' },
  ]), [isEs]);

  return (
    <>
      <Head>
        <title>{`${t('gallery.title', 'Galería')} — BeWorking`}</title>
        <meta
          name="description"
          content={isEs
            ? 'Espacios, eventos y vídeos de BeWorking en Málaga.'
            : 'BeWorking spaces, events and videos in Málaga.'}
        />
        <link rel="canonical" href="https://be-working.com/galeria" />
      </Head>

      <Box sx={{ bgcolor: colors.bg, minHeight: '70vh' }}>
        <Box
          sx={{
            maxWidth: 1280,
            mx: 'auto',
            px: { xs: 2.5, md: 4 },
            pt: { xs: 6, md: 10 },
            pb: { xs: 2, md: 3 },
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              ...typography.eyebrow,
              color: colors.brand,
              textTransform: 'uppercase',
              mb: 1.5,
            }}
          >
            {t('gallery.eyebrow', 'BeWorking · Málaga')}
          </Typography>
          <Box
            component="h1"
            sx={{
              ...typography.h1,
              color: colors.ink,
              fontFamily: typography.fontFamily,
              fontFeatureSettings: typography.fontFeatureSettings,
              m: 0,
              mb: 2,
              fontSize: { xs: '2.1rem', sm: '2.8rem', md: '3.2rem' },
              lineHeight: 1.05,
            }}
          >
            {t('gallery.title', 'Galería')}
          </Box>
          <Typography
            sx={{
              ...typography.body,
              color: colors.ink2,
              maxWidth: 580,
              mx: 'auto',
              fontSize: { xs: '0.98rem', md: '1.05rem' },
            }}
          >
            {t('gallery.subtitle',
              isEs
                ? 'Un recorrido por nuestros espacios, eventos y vídeos en pleno centro de Málaga.'
                : 'A walkthrough of our spaces, events and videos in the heart of Málaga.',
            )}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            pb: { xs: 4, md: 5 },
            px: 2,
            flexWrap: 'wrap',
          }}
        >
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              label={tab.label}
              active={section === tab.key}
              onClick={() => { setSection(tab.key); setLightboxIndex(null); }}
            />
          ))}
        </Box>

        {section !== 'videos' && (
          <Box
            sx={{
              maxWidth: 1280,
              mx: 'auto',
              px: { xs: 2, md: 4 },
              pb: { xs: 8, md: 12 },
              display: 'grid',
              gap: { xs: 1.25, md: 1.75 },
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                xl: 'repeat(4, 1fr)',
              },
            }}
          >
            {currentPhotos.map((p, i) => (
              <Tile
                key={`${section}-${p.thumb}`}
                src={p.thumb}
                alt={`BeWorking ${i + 1}`}
                onClick={() => open(i)}
                delay={Math.min(0.04 * (i % 12), 0.4)}
              />
            ))}
          </Box>
        )}

        {section === 'videos' && (
          <Box
            sx={{
              maxWidth: 1280,
              mx: 'auto',
              px: { xs: 2, md: 4 },
              pb: { xs: 8, md: 12 },
              display: 'grid',
              gap: { xs: 1.5, md: 2 },
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
            }}
          >
            {videos.map((v, i) => (
              <VideoTile
                key={v.src}
                video={v}
                onClick={() => setActiveVideo(v)}
                delay={Math.min(0.04 * i, 0.3)}
              />
            ))}
          </Box>
        )}
      </Box>

      <Lightbox
        photos={currentPhotos}
        index={lightboxIndex}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
}
