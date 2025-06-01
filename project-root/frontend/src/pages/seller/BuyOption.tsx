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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
} from '@mui/material';
import { Print as PrintIcon } from '@mui/icons-material';
import { useInvoices } from '../../contexts/InvoiceContext';

interface Invoice {
  id: string;
  date: string;
  type: 'buy';
  itemType: string;
  karat?: string;
  weight: number;
  price: number;
  totalPrice: number;
  description: string;
  status: 'pending' | 'completed' | 'cancelled';
  origin?: string;
  manufacturingPrice?: number;
}

const karats = ['14K', '18K', '21K', '24K'];

const BuyOption: React.FC = () => {
  const { addInvoice } = useInvoices();
  const [formData, setFormData] = useState({
    itemType: '',
    karat: '',
    weight: '',
    price: '',
    description: '',
    origin: '',
    manufacturingPrice: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const calculateTotalPrice = (weight: number, price: number) => {
    return weight * price;
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

    const weight = parseFloat(formData.weight);
    const price = parseFloat(formData.price);
    const manufacturingPrice = parseFloat(formData.manufacturingPrice);
    const totalPrice = calculateTotalPrice(weight, price);

    const newInvoice: Invoice = {
      id: `INV${Date.now()}`,
      date: new Date().toISOString(),
      type: 'buy',
      itemType: formData.itemType,
      karat: formData.karat,
      weight,
      price,
      totalPrice,
      description: formData.description,
      origin: formData.origin,
      manufacturingPrice: isNaN(manufacturingPrice) ? undefined : manufacturingPrice,
      status: 'pending',
    };

    addInvoice(newInvoice);
    setInvoice(newInvoice);
    setOpenInvoiceDialog(true);
    setSnackbar({
      open: true,
      message: 'Buy request submitted successfully',
      severity: 'success',
    });

    setFormData(prev => ({
      ...prev,
      itemType: '',
      weight: '',
      price: '',
      description: '',
      origin: '',
      manufacturingPrice: '',
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseInvoiceDialog = () => {
    setOpenInvoiceDialog(false);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Buy Items
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Item Type"
                value={formData.itemType}
                onChange={handleInputChange('itemType')}
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
                onChange={handleInputChange('karat')}
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
                onChange={handleInputChange('weight')}
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
                onChange={handleInputChange('price')}
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
                label="Origin"
                value={formData.origin}
                onChange={handleInputChange('origin')}
                placeholder="e.g., Jordan, Italy"
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
                label="Manufacturing Price (JD)"
                type="number"
                value={formData.manufacturingPrice}
                onChange={handleInputChange('manufacturingPrice')}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleInputChange('description')}
                multiline
                rows={4}
                placeholder="Enter any additional details about the item"
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
                Submit Buy Request
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
        open={openInvoiceDialog}
        onClose={handleCloseInvoiceDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Buy Invoice</DialogTitle>
        <DialogContent>
          {invoice && (
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Item Type</TableCell>
                    <TableCell align="right">{invoice.itemType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Karat</TableCell>
                    <TableCell align="right">{invoice.karat}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Weight (grams)</TableCell>
                    <TableCell align="right">{invoice.weight}</TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>Origin</TableCell>
                    <TableCell align="right">{invoice.origin || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Price per gram</TableCell>
                    <TableCell align="right">{invoice.price.toFixed(2)} JD</TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>Manufacturing Price</TableCell>
                    <TableCell align="right">{invoice.manufacturingPrice?.toFixed(2) || 'N/A'} JD</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Total Price</strong></TableCell>
                    <TableCell align="right"><strong>{invoice.totalPrice.toFixed(2)} JD</strong></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvoiceDialog}>Close</Button>
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