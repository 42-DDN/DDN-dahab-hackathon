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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';

interface Invoice {
  id: string;
  date: string;
  type: 'buy' | 'sell';
  itemType: string;
  karat?: string;
  weight: number;
  price: number;
  description: string;
  status: 'pending' | 'completed' | 'cancelled';
}

const karats = ['14K', '18K', '21K', '24K'];

const BuyOption: React.FC = () => {
  const [formData, setFormData] = useState({
    itemType: '',
    karat: '',
    weight: '',
    price: '',
    description: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const generateInvoice = (price: number): Invoice => {
    return {
      id: `INV-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'buy',
      itemType: formData.itemType,
      karat: formData.karat,
      weight: parseFloat(formData.weight),
      price,
      description: formData.description,
      status: 'pending',
    };
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.itemType || !formData.karat || !formData.weight || !formData.price) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error',
      });
      return;
    }

    const newInvoice = generateInvoice(parseFloat(formData.price));
    setInvoice(newInvoice);
    setInvoiceDialogOpen(true);

    setSnackbar({
      open: true,
      message: 'Purchase request submitted successfully',
      severity: 'success',
    });

    setFormData(prev => ({
      ...prev,
      itemType: '',
      weight: '',
      price: '',
      description: '',
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePrintInvoice = () => {
    window.print();
    setInvoiceDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Buy Option
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Item Type"
                value={formData.itemType}
                onChange={handleChange('itemType')}
                placeholder="e.g., Ring, Necklace, Bracelet"
                helperText="Enter the type of item you want to buy"
                required
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
                select
                fullWidth
                label="Karat"
                value={formData.karat}
                onChange={handleChange('karat')}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'secondary.main',
                    },
                  },
                }}
              >
                <MenuItem value="">Select Karat</MenuItem>
                {karats.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Weight (grams)"
                type="number"
                value={formData.weight}
                onChange={handleChange('weight')}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
                required
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
                label="Price per gram (JD)"
                type="number"
                value={formData.price}
                onChange={handleChange('price')}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'secondary.main',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
                multiline
                rows={4}
                placeholder="Enter any additional details about the item..."
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={!formData.karat || !formData.weight || !formData.price}
                sx={{
                  backgroundColor: 'primary.main',
                  border: '2px solid transparent',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    borderColor: 'secondary.main',
                  },
                }}
              >
                Submit Purchase Request
              </Button>
            </Grid>
          </Grid>
        </form>
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

      <Dialog
        open={invoiceDialogOpen}
        onClose={() => setInvoiceDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Purchase Invoice</DialogTitle>
        <DialogContent>
          {invoice && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Invoice #{invoice.id}
              </Typography>
              <Typography variant="body1" paragraph>
                Date: {invoice.date}
              </Typography>
              <Typography variant="body1" paragraph>
                Type: {invoice.type.toUpperCase()}
              </Typography>
              <Typography variant="body1" paragraph>
                Karat: {invoice.karat}
              </Typography>
              <Typography variant="body1" paragraph>
                Item: {invoice.itemType}
              </Typography>
              <Typography variant="body1" paragraph>
                Weight: {invoice.weight}g
              </Typography>
              <Typography variant="body1" paragraph>
                Price per gram: {invoice.price.toFixed(2)} JD
              </Typography>
              <Typography variant="body1" paragraph>
                Description: {invoice.description}
              </Typography>
              <Typography variant="body1" paragraph>
                Status: {invoice.status}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInvoiceDialogOpen(false)}>Close</Button>
          <Button
            onClick={handlePrintInvoice}
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
          >
            Print Invoice
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BuyOption; 