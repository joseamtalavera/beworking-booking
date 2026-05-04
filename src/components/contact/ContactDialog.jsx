import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import ContactCard from './ContactCard';
import { tokens } from '@/theme/tokens';

const { radius } = tokens;

// Wraps ContactCard in a centered Dialog. Used by hero / how-it-works CTAs
// so the user fills the form inline without losing the page they were on.
export default function ContactDialog({ open, onClose, defaultSubject }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: `${radius.lg}px`,
          p: { xs: 2, sm: 3 },
          position: 'relative',
        },
      }}
    >
      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
        <IconButton onClick={onClose} aria-label="close" size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <ContactCard
        defaultSubject={defaultSubject}
        compact
        onSuccess={onClose}
      />
    </Dialog>
  );
}
