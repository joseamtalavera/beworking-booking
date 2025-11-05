import { useEffect } from 'react';
import { Box, Button, Dialog, DialogContent, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useBookingFlow } from '../../store/useBookingFlow.js';

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
          p: 2
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
              Ready to book this space?
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Continue to the booking form to choose your dates, provide contact details, and confirm the reservation.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleContinue}>
              Continue
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default BookingFlowModal;
