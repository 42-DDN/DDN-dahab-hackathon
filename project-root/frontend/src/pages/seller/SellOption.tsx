import React, { useState, useEffect } from 'react';
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

interface Invoice {
  id: string;
  date: string;
  type: 'sell';
  itemType: string;
  karat?: string;
  weight: number;
  price: number;
  manufacturingPrice: number;
  tax: number;
  totalPrice: number;
  description: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface GoldPrice {
  price: number;
  currency: string;
  timestamp: string;
}

const karats = ['14K', '18K', '21K', '24K'];

const SellOption: React.FC = () => {
  const [formData, setFormData] = useState({
    itemType: '',
    karat: '',
    weight: '',
    manufacturingPrice: '',
    taxRate: '',
    description: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);

  const [goldPrice, setGoldPrice] = useState<GoldPrice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      if (!formData.karat) {
        setGoldPrice(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`YOUR_GOLD_PRICE_API_ENDPOINT?karat=${formData.karat}`);
        if (!response.ok) {
          throw new Error('Failed to fetch gold price for selected karat');
        }
        const data = await response.json();
        setGoldPrice(data);
      } catch (err) {
        setError(`Failed to fetch current gold price for ${formData.karat}. Please try again later.`);
        console.error('Error fetching karat price:', err);
        setGoldPrice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGoldPrice();
  }, [formData.karat]);

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const calculateTotalPrice = (weight: number, price: number, manufacturingPrice: number, taxRate: number) => {
    const totalManufacturingPrice = weight * manufacturingPrice;
    const subtotal = (weight * price) + totalManufacturingPrice;
    const tax = subtotal * (taxRate / 100);
    return {
      manufacturingPrice: totalManufacturingPrice,
      tax,
      totalPrice: subtotal + tax
    };
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.itemType || !formData.karat || !formData.weight || !formData.manufacturingPrice || !formData.taxRate || !goldPrice) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields and ensure gold price is available',
        severity: 'error',
      });
      return;
    }

    const weight = parseFloat(formData.weight);
    const price = goldPrice.price;
    const manufacturingPrice = parseFloat(formData.manufacturingPrice);
    const taxRate = parseFloat(formData.taxRate);
    const { manufacturingPrice: totalManufacturingPrice, tax, totalPrice } = calculateTotalPrice(weight, price, manufacturingPrice, taxRate);

    const newInvoice: Invoice = {
      id: `INV${Date.now()}`,
      date: new Date().toISOString(),
      type: 'sell',
      itemType: formData.itemType,
      karat: formData.karat,
      weight,
      price,
      manufacturingPrice: totalManufacturingPrice,
      tax,
      totalPrice,
      description: formData.description,
      status: 'pending',
    };

    setInvoice(newInvoice);
    setOpenInvoiceDialog(true);
    setSnackbar({
      open: true,
      message: 'Sell request submitted successfully',
      severity: 'success',
    });

    setFormData(prev => ({
      ...prev,
      itemType: '',
      weight: '',
      description: '',
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
        Sell Items
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
                helperText="Enter the type of item you want to sell"
                required
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
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`Price per gram (${goldPrice?.currency || 'JD'})`}
                value={loading ? 'Loading...' : goldPrice ? goldPrice.price.toFixed(2) : 'Select Karat to load price'}
                disabled
                helperText={goldPrice ? `Last updated: ${new Date(goldPrice.timestamp).toLocaleString()}` : error ? '' : ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Manufacturing Price per gram (JD)"
                type="number"
                value={formData.manufacturingPrice}
                onChange={handleInputChange('manufacturingPrice')}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tax Rate (%)"
                type="number"
                value={formData.taxRate}
                onChange={handleInputChange('taxRate')}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
                required
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
                disabled={!formData.karat || !formData.weight || !formData.manufacturingPrice || !formData.taxRate || !goldPrice || loading}
              >
                Submit Sell Request
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
        <DialogTitle>Invoice Preview</DialogTitle>
        <DialogContent>
          {invoice && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
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
                    <TableCell>Price per gram</TableCell>
                    <TableCell align="right">{invoice.price.toFixed(2)} {goldPrice?.currency || 'JD'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Base Price</TableCell>
                    <TableCell align="right">{invoice.weight * invoice.price} JD</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Manufacturing Price ({formData.manufacturingPrice} JD/gram)</TableCell>
                    <TableCell align="right">{invoice.manufacturingPrice} JD</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Subtotal</TableCell>
                    <TableCell align="right">{invoice.weight * invoice.price + invoice.manufacturingPrice} JD</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tax ({formData.taxRate}%)</TableCell>
                    <TableCell align="right">{invoice.tax.toFixed(2)} JD</TableCell>
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
            startIcon={<PrintIcon />}
          >
            Print Invoice
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SellOption; 