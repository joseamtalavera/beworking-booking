import { Box, Button, Stack, TextField, Typography } from '@mui/material';

const LoginPage = () => (
  <Box sx={{ maxWidth: 420, mx: 'auto', mt: 6, p: 4, borderRadius: 3, bgcolor: '#fff', boxShadow: '0 24px 80px -40px rgba(15,23,42,0.45)' }}>
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Welcome back
        </Typography>
        <Typography variant="body2" sx={{ color: '#475569' }}>
          Use your Beworking credentials to access saved bookings and billing details.
        </Typography>
      </Stack>
      <TextField label="Email" type="email" fullWidth required />
      <TextField label="Password" type="password" fullWidth required />
      <Button variant="contained" size="large">
        Sign in
      </Button>
      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
        Visitor checkout will not require an account—this screen is for returning customers.
      </Typography>
    </Stack>
  </Box>
);

export default LoginPage;
