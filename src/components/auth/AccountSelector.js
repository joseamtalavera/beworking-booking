import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { styled, alpha } from '@mui/material/styles';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  maxWidth: 520,
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  borderRadius: 10,
  [theme.breakpoints.up('sm')]: {
    maxWidth: 520,
    padding: theme.spacing(4),
  },
}));

export default function AccountSelector({ accounts, selectionToken, role, onBack }) {
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
        }
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
        setError(data?.message || 'Failed to select account.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(1.5rem, 8vw, 1.75rem)', textAlign: 'center' }}
      >
        Selecciona una cuenta
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        Tu email está vinculado a varias cuentas. Elige a cuál quieres acceder.
      </Typography>

      {error && (
        <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>
      )}

      <Stack spacing={1.5}>
        {accounts.map((account) => (
          <MuiCard
            key={account.id}
            variant="outlined"
            sx={{
              borderRadius: 2,
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: (theme) => `0 0 0 1px ${theme.palette.primary.main}`,
              },
            }}
          >
            <CardActionArea
              onClick={() => handleSelect(account.id)}
              disabled={loading}
              sx={{ p: 2.5 }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <BusinessRoundedIcon sx={{ color: 'primary.main' }} />
                </Box>
                <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {account.companyName || 'Sin nombre'}
                  </Typography>
                  {account.billingTaxId && (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      CIF: {account.billingTaxId}
                    </Typography>
                  )}
                  {account.tenantType && (
                    <Typography variant="caption" color="text.secondary">
                      {account.tenantType}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </CardActionArea>
          </MuiCard>
        ))}
      </Stack>

      <Button
        variant="text"
        startIcon={<ArrowBackRoundedIcon />}
        onClick={onBack}
        disabled={loading}
        sx={{ alignSelf: 'center', textTransform: 'none', mt: 1 }}
      >
        Volver al login
      </Button>
    </Card>
  );
}
