'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useTranslation } from 'react-i18next';
import { cancelBloqueo, fetchBloqueos } from '../../api/bookings.js';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography } = tokens;

const isFreeBooking = (bloqueo) => {
  const tarifa = bloqueo.tarifa;
  const nota = (bloqueo.nota || '').toLowerCase();
  return (tarifa == null || tarifa === 0) && !nota.includes('stripe');
};

const formatDateTime = (isoString) => {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' });
};

const MyBookings = () => {
  const { t } = useTranslation();
  const [bloqueos, setBloqueos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const today = new Date().toISOString().slice(0, 10);
      const toDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const data = await fetchBloqueos({ from: today, to: toDate });
      setBloqueos(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err?.message || '';
      if (!msg.includes('401') && !msg.includes('403') && !msg.includes('Unauthorized') && !msg.includes('Forbidden')) {
        setError(t('myBookings.loadError'));
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    setCancelError('');
    try {
      await cancelBloqueo(cancelTarget.id);
      setCancelTarget(null);
      load();
    } catch {
      setCancelError(t('myBookings.cancelError'));
    } finally {
      setCancelling(false);
    }
  };

  const upcomingFree = bloqueos.filter(isFreeBooking);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={24} sx={{ color: colors.brand }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mb: 2, borderRadius: `${radius.md}px` }}>{error}</Alert>;
  }

  if (upcomingFree.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 5 }}>
      <Box
        component="h2"
        sx={{
          ...typography.h3,
          color: colors.ink,
          fontFamily: typography.fontFamily,
          fontFeatureSettings: typography.fontFeatureSettings,
          m: 0,
          mb: 2.5,
          fontSize: { xs: '1.05rem', md: '1.15rem' },
        }}
      >
        {t('myBookings.title')}
      </Box>

      <TableContainer
        sx={{
          border: `1px solid ${colors.line}`,
          borderRadius: `${radius.lg}px`,
          overflow: 'hidden',
          bgcolor: colors.bg,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 600, color: colors.ink, bgcolor: colors.bgSoft, borderColor: colors.line, fontSize: '0.8rem' } }}>
              <TableCell>{t('myBookings.space')}</TableCell>
              <TableCell>{t('myBookings.start')}</TableCell>
              <TableCell>{t('myBookings.end')}</TableCell>
              <TableCell>{t('myBookings.status')}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {upcomingFree.map((b) => (
              <TableRow
                key={b.id}
                sx={{
                  '& td': { borderColor: colors.line },
                  '&:hover': { bgcolor: colors.bgSoft },
                  transition: `background-color ${motion.duration} ${motion.ease}`,
                }}
              >
                <TableCell>
                  <Stack>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: colors.ink }}>
                      {b.producto?.nombre || b.producto?.name || '—'}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: colors.ink3 }}>
                      {b.centro?.nombre || b.centro?.name || ''}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '0.85rem', color: colors.ink2 }}>
                    {formatDateTime(b.fechaIni)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '0.85rem', color: colors.ink2 }}>
                    {formatDateTime(b.fechaFin)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={t('myBookings.free')}
                    size="small"
                    sx={{
                      bgcolor: colors.brandSoft,
                      color: colors.brandDeep,
                      border: `1px solid ${colors.brand}`,
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      borderRadius: `${radius.pill}px`,
                      height: 22,
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    startIcon={<CancelOutlinedIcon sx={{ fontSize: 16 }} />}
                    onClick={() => setCancelTarget(b)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 500,
                      color: '#b3261e',
                      fontSize: '0.85rem',
                      '&:hover': { bgcolor: 'rgba(179, 38, 30, 0.06)' },
                    }}
                  >
                    {t('myBookings.cancel')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={Boolean(cancelTarget)}
        onClose={() => !cancelling && setCancelTarget(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: `${radius.lg}px`,
            border: `1px solid ${colors.line}`,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.05rem', color: colors.ink, pt: 3 }}>
          {t('myBookings.confirmTitle')}
        </DialogTitle>
        <DialogContent>
          {cancelError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: `${radius.md}px` }}>{cancelError}</Alert>
          )}
          <DialogContentText sx={{ color: colors.ink2, fontSize: '0.9rem' }}>
            {t('myBookings.confirmBody', {
              space: cancelTarget?.producto?.nombre || cancelTarget?.producto?.name || '',
              date: formatDateTime(cancelTarget?.fechaIni),
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setCancelTarget(null)}
            disabled={cancelling}
            sx={{
              borderRadius: `${radius.pill}px`,
              px: 2.5,
              py: 0.85,
              textTransform: 'none',
              fontWeight: 600,
              color: colors.ink2,
              '&:hover': { bgcolor: colors.bgSoft, color: colors.ink },
            }}
          >
            {t('common.back')}
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={handleConfirmCancel}
            disabled={cancelling}
            sx={{
              bgcolor: '#b3261e',
              color: colors.bg,
              borderRadius: `${radius.pill}px`,
              px: 3,
              py: 0.85,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#8c1d18', boxShadow: 'none' },
            }}
          >
            {cancelling ? <CircularProgress size={16} sx={{ color: colors.bg }} /> : t('myBookings.confirmCancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookings;
