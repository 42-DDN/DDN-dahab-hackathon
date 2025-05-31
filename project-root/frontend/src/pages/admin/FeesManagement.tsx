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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

interface ManufacturingFees {
  [key: string]: {
    manufacturingFee: number;
    wastageRate: number;
  };
}

interface TaxRates {
  vat: number;
  customs: number;
  otherTaxes: number;
}

const FeesManagement: React.FC = () => {
  const [manufacturingFees, setManufacturingFees] = useState<ManufacturingFees>({
    '14K': { manufacturingFee: 5, wastageRate: 2 },
    '18K': { manufacturingFee: 7, wastageRate: 2.5 },
    '21K': { manufacturingFee: 9, wastageRate: 3 },
    '24K': { manufacturingFee: 12, wastageRate: 3.5 },
  });

  const [taxRates, setTaxRates] = useState<TaxRates>({
    vat: 15,
    customs: 5,
    otherTaxes: 2,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  const handleManufacturingFeeChange = (karat: string, field: keyof ManufacturingFees[string]) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setManufacturingFees((prev) => ({
        ...prev,
        [karat]: {
          ...prev[karat],
          [field]: value,
        },
      }));
    }
  };

  const handleTaxRateChange = (field: keyof TaxRates) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setTaxRates((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = () => {
    // TODO: Implement API call to save fees
    setSnackbar({
      open: true,
      message: 'Fees and tax rates updated successfully',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Gold Manufacturing & Tax Management
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Manufacturing Fees by Karat
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Set the manufacturing fees, and wastage rates for different gold karats.
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Karat</TableCell>
                <TableCell>Manufacturing Fee (%)</TableCell>
                <TableCell>Wastage Rate (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(manufacturingFees).map(([karat, fees]) => (
                <TableRow key={karat}>
                  <TableCell>{karat}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={fees.manufacturingFee}
                      onChange={handleManufacturingFeeChange(karat, 'manufacturingFee')}
                      InputProps={{
                        endAdornment: '%',
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'secondary.main',
                          },
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={fees.wastageRate}
                      onChange={handleManufacturingFeeChange(karat, 'wastageRate')}
                      InputProps={{
                        endAdornment: '%',
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'secondary.main',
                          },
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tax Rates
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Set the tax rates that will be applied to gold manufacturing and sales.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="VAT Rate"
              type="number"
              value={taxRates.vat}
              onChange={handleTaxRateChange('vat')}
              InputProps={{
                endAdornment: '%',
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'secondary.main',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Customs Duty"
              type="number"
              value={taxRates.customs}
              onChange={handleTaxRateChange('customs')}
              InputProps={{
                endAdornment: '%',
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'secondary.main',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Other Taxes"
              type="number"
              value={taxRates.otherTaxes}
              onChange={handleTaxRateChange('otherTaxes')}
              InputProps={{
                endAdornment: '%',
              }}
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

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: 'primary.main',
              border: '2px solid transparent',
              '&:hover': {
                backgroundColor: 'primary.dark',
                borderColor: 'secondary.main',
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