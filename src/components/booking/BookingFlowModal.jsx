'use client';

import { useEffect } from 'react';
import { Box, Button, Dialog, DialogContent, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useBookingFlow } from '../../store/useBookingFlow';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';

const { colors, radius, shadow, motion, typography } = tokens;
const LOGIN_URL = '/login';

const BookingFlowModal = ({ open, onClose, onContinue }) => {
  const { t } = useTranslation();
  const resetFlow = useBookingFlow((state) => state.resetFlow);

  useEffect(() => {
    if (open) resetFlow();
  }, [open, resetFlow]);

  const handleClose = () => onClose?.();
  const handleContinue = () => onContinue?.();
  const handleLogin = () => { window.location.href = LOGIN_URL; };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: `${radius.lg}px`,
          overflow: 'visible',
          p: { xs: 1, sm: 2 },
          boxShadow: shadow.frame,
          border: `1px solid ${colors.line}`,
        },
      }}
    >
      <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
        <IconButton onClick={handleClose} size="small" sx={{ color: colors.ink3 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <DialogContent sx={{ pt: 3, pb: 3 }}>
        <Stack spacing={3.5}>
          <Stack spacing={1.25}>
            <Typography
              sx={{
                ...typography.eyebrow,
                color: colors.brand,
                textTransform: 'uppercase',
              }}
            >
              {t('modal.eyebrow', 'Booking')}
            </Typography>
            <Box
              component="h2"
              sx={{
                ...typography.h3,
                color: colors.ink,
                fontFamily: typography.fontFamily,
                fontFeatureSettings: typography.fontFeatureSettings,
                m: 0,
              }}
            >
              {t('modal.title')}
            </Box>
            <Typography sx={{ ...typography.body, color: colors.ink2 }}>
              {t('modal.subtitle')}
            </Typography>
          </Stack>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            justifyContent="flex-end"
            sx={{ pt: 0.5 }}
          >
            <Button
              onClick={handleClose}
              sx={{
                color: colors.ink2,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: `${radius.pill}px`,
                px: 2.5,
                py: 1,
                '&:hover': { bgcolor: colors.bgSoft },
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleLogin}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                border: `1px solid ${colors.line}`,
                color: colors.ink,
                bgcolor: colors.bg,
                borderRadius: `${radius.pill}px`,
                px: 2.5,
                py: 1,
                '&:hover': { bgcolor: colors.bgSoft, borderColor: colors.ink3 },
              }}
            >
              {t('modal.signIn')}
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={handleContinue}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: colors.brand,
                color: colors.bg,
                borderRadius: `${radius.pill}px`,
                px: 3,
                py: 1,
                transition: `background-color ${motion.duration} ${motion.ease}`,
                '&:hover': { bgcolor: colors.brandDeep, boxShadow: 'none' },
              }}
            >
              {t('modal.continueAsGuest')}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default BookingFlowModal;
