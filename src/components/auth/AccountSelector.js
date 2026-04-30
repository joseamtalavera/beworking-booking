import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/theme/tokens';

const { colors, radius, motion, typography } = tokens;

export default function AccountSelector({ accounts, selectionToken, role, onBack }) {
  const { i18n } = useTranslation();
  const isEs = i18n.language === 'es';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = async (contactProfileId) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'}/auth/select-account`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ selectionToken, contactProfileId }),
        },
      );
      const data = await response.json().catch(() => null);

      if (response.ok) {
        const adminDashboardUrl = process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || 'http://localhost:5173/admin';
        const userDashboardUrl = process.env.NEXT_PUBLIC_USER_DASHBOARD_URL || 'http://localhost:5173/user';
        const baseDestination = (data?.role || role) === 'ADMIN' ? adminDashboardUrl : userDashboardUrl;
        const destination = data?.token
          ? `${baseDestination}${baseDestination.includes('?') ? '&' : '?'}token=${encodeURIComponent(data.token)}`
          : baseDestination;

        if (typeof window !== 'undefined') {
          window.location.href = destination;
        }
      } else {
        setError(data?.message || (isEs ? 'No se pudo seleccionar la cuenta.' : 'Failed to select account.'));
      }
    } catch (err) {
      setError(err.message || (isEs ? 'Ha ocurrido un error.' : 'An error occurred.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 480,
        mx: 'auto',
        bgcolor: colors.bg,
        borderRadius: `${radius.lg}px`,
        border: `1px solid ${colors.line}`,
        p: { xs: 3.5, sm: 4.5 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 0.5 }}>
        <Typography
          sx={{
            ...typography.eyebrow,
            color: colors.brand,
            textTransform: 'uppercase',
            mb: 1,
          }}
        >
          BeWorking
        </Typography>
        <Box
          component="h1"
          sx={{
            ...typography.h2,
            color: colors.ink,
            fontFamily: typography.fontFamily,
            fontFeatureSettings: typography.fontFeatureSettings,
            m: 0,
            fontSize: { xs: '1.5rem', sm: '1.75rem' },
          }}
        >
          {isEs ? 'Selecciona una cuenta' : 'Choose an account'}
        </Box>
        <Typography sx={{ ...typography.body, color: colors.ink2, mt: 1.5 }}>
          {isEs
            ? 'Tu email está vinculado a varias cuentas. Elige a cuál quieres acceder.'
            : 'Your email is linked to multiple accounts. Pick the one you want to access.'}
        </Typography>
      </Box>

      {error && (
        <Typography sx={{ ...typography.body, color: '#b3261e', textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      <Stack spacing={1.25}>
        {accounts.map((account) => (
          <Box
            key={account.id}
            sx={{
              borderRadius: `${radius.md}px`,
              border: `1px solid ${colors.line}`,
              bgcolor: colors.bg,
              transition: `border-color ${motion.duration} ${motion.ease}, background-color ${motion.duration} ${motion.ease}`,
              '&:hover': {
                borderColor: colors.brand,
                bgcolor: colors.brandSoft,
              },
            }}
          >
            <CardActionArea
              onClick={() => handleSelect(account.id)}
              disabled={loading}
              sx={{ p: 2.25, borderRadius: `${radius.md}px` }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    bgcolor: colors.brandSoft,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <BusinessRoundedIcon sx={{ color: colors.brand, fontSize: 22 }} />
                </Box>
                <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: colors.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {account.companyName || (isEs ? 'Sin nombre' : 'Unnamed')}
                  </Typography>
                  {account.billingTaxId && (
                    <Typography sx={{ fontSize: '0.85rem', color: colors.ink2 }}>
                      CIF: {account.billingTaxId}
                    </Typography>
                  )}
                  {account.tenantType && (
                    <Typography sx={{ fontSize: '0.75rem', color: colors.ink3 }}>
                      {account.tenantType}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </CardActionArea>
          </Box>
        ))}
      </Stack>

      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={onBack}
        disabled={loading}
        sx={{
          alignSelf: 'center',
          textTransform: 'none',
          mt: 0.5,
          color: colors.ink2,
          fontSize: '0.9rem',
          fontWeight: 600,
          borderRadius: `${radius.pill}px`,
          px: 2.5,
          py: 0.85,
          '&:hover': { bgcolor: colors.bgSoft, color: colors.ink },
        }}
      >
        {isEs ? 'Volver al login' : 'Back to sign in'}
      </Button>
    </Box>
  );
}
