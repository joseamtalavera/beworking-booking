'use client';

import { useEffect } from 'react';
import { Box, Button, Dialog, DialogContent, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useBookingFlow } from '../../store/useBookingFlow';

const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL || 'http://localhost:3020/main/login';

// Modal dialog wrapper for booking flow
const BookingFlowModal = ({ open, onClose, onContinue }) => {
  const resetFlow = useBookingFlow((state) => state.resetFlow);

  useEffect(() => {
    if (open) {
      resetFlow();
    }
  }, [open, resetFlow]);

  const handleClose = () => {
    onClose?.();
  };

  const handleContinue = () => {
    onContinue?.();
  };

  const handleLogin = () => {
    window.location.href = LOGIN_URL;
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          overflow: 'visible',
          p: 2,
          boxShadow: (theme) => theme.shadows[6]
        }
      }}
    >
      <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ¿Cómo quieres continuar?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Puedes seguir como invitado o iniciar sesión para usar tus datos guardados.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button onClick={handleClose} sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Cancelar
            </Button>
            <Button
              onClick={handleLogin}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                border: '1px solid',
                borderColor: 'grey.300',
                color: 'text.primary',
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.default', borderColor: 'grey.400' }
              }}
            >
              Iniciar sesión
            </Button>
            <Button
              variant="contained"
              onClick={handleContinue}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                backgroundColor: 'secondary.main',
                '&:hover': { backgroundColor: 'secondary.main' }
              }}
            >
              Seguir como invitado
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default BookingFlowModal;
