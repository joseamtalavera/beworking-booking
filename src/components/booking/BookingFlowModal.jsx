import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChooseBookingMode from './ChooseBookingMode.jsx';
import { useBookingFlow } from '../../store/useBookingFlow.js';

// Modal dialog wrapper for booking flow
const BookingFlowModal = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const resetFlow = useBookingFlow((state) => state.resetFlow);
  const setActiveStep = useBookingFlow((state) => state.setActiveStep);

  const handleClose = useCallback(() => {
    resetFlow();
    navigate(-1);
  }, [navigate, resetFlow]);

  const handleContinue = useCallback(() => {
    setActiveStep(1);
    navigate(`/rooms/${roomId}/book`, { replace: true, state: { skipMode: true } });
  }, [navigate, roomId, setActiveStep]);

  useEffect(() => {
    resetFlow();
  }, [resetFlow]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open
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
        <ChooseBookingMode onContinue={handleContinue} />
      </DialogContent>
    </Dialog>
  );
};

export default BookingFlowModal;
