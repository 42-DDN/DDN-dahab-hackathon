import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';

const FeesManagement: React.FC = () => {
  const [fees, setFees] = useState({
    gold: 100,
    silver: 80,
    platinum: 120,
    diamond: 150,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  const handleFeeChange = (metal: keyof typeof fees) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setFees((prev) => ({
        ...prev,
        [metal]: value,
      }));
    }
  };

  const handleSave = () => {
    // TODO: Implement API call to save fees
    setSnackbar({
      open: true,
      message: 'Fees updated successfully',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Fees Management
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Masn3ya Fees
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Set the masn3ya fees for different types of metals. These fees will be used to calculate the final price of items.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Gold Masn3ya"
              type="number"
              value={fees.gold}
              onChange={handleFeeChange('gold')}
              InputProps={{
                endAdornment: '%',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Silver Masn3ya"
              type="number"
              value={fees.silver}
              onChange={handleFeeChange('silver')}
              InputProps={{
                endAdornment: '%',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Platinum Masn3ya"
              type="number"
              value={fees.platinum}
              onChange={handleFeeChange('platinum')}
              InputProps={{
                endAdornment: '%',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Diamond Masn3ya"
              type="number"
              value={fees.diamond}
              onChange={handleFeeChange('diamond')}
              InputProps={{
                endAdornment: '%',
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeesManagement; 