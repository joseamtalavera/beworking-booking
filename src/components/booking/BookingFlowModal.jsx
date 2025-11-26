import { useEffect } from 'react';
import { Box, Button, Dialog, DialogContent, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useBookingFlow } from '../../store/useBookingFlow.js';

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL || 'http://localhost:3020/main/login';
const BRAND_GREEN = '#2bb673';
const BRAND_GREEN_HOVER = '#23a160';

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
          boxShadow: '0 20px 50px rgba(15,23,42,0.12)'
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
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Puedes seguir como invitado o iniciar sesión para usar tus datos guardados.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button onClick={handleClose} sx={{ color: '#475569', fontWeight: 600 }}>
              Cancelar
            </Button>
            <Button
              onClick={handleLogin}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                bgcolor: '#fff',
                '&:hover': { bgcolor: '#f8fafc', borderColor: '#94a3b8' }
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
                backgroundColor: BRAND_GREEN,
                '&:hover': { backgroundColor: BRAND_GREEN_HOVER }
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
