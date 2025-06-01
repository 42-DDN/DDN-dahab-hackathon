import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from '@mui/material';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    companyName: 'Dahab JO',
    email: 'admin@dahabjo.com',
    phone: '+962 6 123 4567',
    address: 'Amman, Jordan',
    enableNotifications: true,
    enableEmailAlerts: true,
    maintenanceMode: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    });
  };

  const handleSave = () => {
    // TODO: Implement actual save functionality
    setSnackbar({
      open: true,
      message: 'Settings saved successfully',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Settings
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          General Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company Name"
              value={settings.companyName}
              onChange={handleChange('companyName')}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'secondary.main',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={settings.email}
              onChange={handleChange('email')}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'secondary.main',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone"
              value={settings.phone}
              onChange={handleChange('phone')}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'secondary.main',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Address"
              value={settings.address}
              onChange={handleChange('address')}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'secondary.main',
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          System Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableNotifications}
                  onChange={handleChange('enableNotifications')}
                />
              }
              label="Enable Notifications"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableEmailAlerts}
                  onChange={handleChange('enableEmailAlerts')}
                />
              }
              label="Enable Email Alerts"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.maintenanceMode}
                  onChange={handleChange('maintenanceMode')}
                />
              }
              label="Maintenance Mode"
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: 'primary.main',
            border: '2px solid',
            borderColor: 'secondary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
              borderColor: 'secondary.dark',
            },
          }}
        >
          Save Changes
        </Button>
      </Box>

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

export default Settings; 