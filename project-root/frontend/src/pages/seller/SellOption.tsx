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
  IconButton,
} from '@mui/material';
import { Print as PrintIcon, AddCircleOutline as AddIcon, RemoveCircleOutline as RemoveIcon } from '@mui/icons-material';
import { useInvoices, Invoice } from '../../contexts/InvoiceContext';
import { useFees } from '../../contexts/FeesContext';
import { useInventory, InventoryItem } from '../../contexts/InventoryContext';

interface SellInvoiceItem extends Omit<InventoryItem, 'location'> {
  manufacturingPricePerGram?: number;
  taxApplied?: number;
}

interface SellInvoice extends Omit<Invoice, 'itemType' | 'karat' | 'weight' | 'price' | 'manufacturingPrice' | 'tax' | 'description' | 'totalPrice'> {
  items: SellInvoiceItem[];
  subtotal: number;
  totalTax: number;
  grandTotal: number;
  description?: string;
}

const SellOption: React.FC = () => {
  const { addInvoice } = useInvoices();
  const { taxRates } = useFees();
  const { getInventoryItemById } = useInventory();

  const [itemId, setItemId] = useState('');
  const [foundItem, setFoundItem] = useState<InventoryItem | undefined>(undefined);
  const [selectedItems, setSelectedItems] = useState<SellInvoiceItem[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  const [invoice, setInvoice] = useState<SellInvoice | null>(null);
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);

  const handleItemIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemId(event.target.value);
    setFoundItem(undefined);
  };

  const handleSearchItem = () => {
    const item = getInventoryItemById(itemId);
    if (item) {
      setFoundItem(item);
      setSnackbar({
        open: true,
        message: 'Item found!',
        severity: 'success',
      });
    } else {
      setFoundItem(undefined);
      setSnackbar({
        open: true,
        message: 'Item not found.',
        severity: 'error',
      });
    }
  };

  const handleAddItemToSale = () => {
    if (foundItem) {
      const manufacturingPriceInput = prompt(`Enter manufacturing price per gram for ${foundItem.itemType} (${foundItem.karat}) (JD):`);
      const manufacturingPrice = manufacturingPriceInput ? parseFloat(manufacturingPriceInput) : undefined; // Allow undefined

      if (manufacturingPrice !== undefined && isNaN(manufacturingPrice)) {
        setSnackbar({
          open: true,
          message: 'Invalid manufacturing price entered.',
          severity: 'error',
        });
        return;
      }

      const taxRate = taxRates.vat + taxRates.customs + taxRates.otherTaxes;
      const itemSubtotal = (foundItem.weight * foundItem.price) + (manufacturingPrice !== undefined ? foundItem.weight * manufacturingPrice : 0);
      const itemTax = itemSubtotal * (taxRate / 100);

      const sellInvoiceItem: SellInvoiceItem = {
        ...foundItem,
        manufacturingPricePerGram: manufacturingPrice,
        taxApplied: itemTax,
      };

      setSelectedItems(prev => [...prev, sellInvoiceItem]);
      setItemId('');
      setFoundItem(undefined);
      setSnackbar({
        open: true,
        message: `${foundItem.itemType} added to sale!`,
        severity: 'success',
      });
    }
  };

  const handleRemoveItemFromSale = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
    setSnackbar({
      open: true,
      message: 'Item removed from sale.',
      severity: 'info',
    });
  };

  const handleSubmitSale = (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedItems.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please add items to the sale first.',
        severity: 'error',
      });
      return;
    }

    const subtotal = selectedItems.reduce((sum, item) => sum + ((item.weight * item.price) + (item.manufacturingPricePerGram !== undefined ? item.weight * item.manufacturingPricePerGram : 0)), 0);
    const totalTax = selectedItems.reduce((sum, item) => sum + (item.taxApplied || 0), 0);
    const grandTotal = subtotal + totalTax;

    const newInvoice: SellInvoice = {
      id: `INV-SELL-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'sell',
      items: selectedItems,
      subtotal,
      totalTax,
      grandTotal,
      status: 'pending',
      description: 'Sale transaction',
    };

      const baseInvoice: Invoice = {
       id: newInvoice.id,
       date: newInvoice.date,
       type: 'sell',
       itemType: newInvoice.items.map(item => item.itemType).join(', '),
       karat: newInvoice.items.map(item => item.karat).join(', '),
       weight: newInvoice.items.reduce((sum, item) => sum + item.weight, 0),
       price: newInvoice.items.reduce((sum, item) => sum + (item.weight * item.price), 0),
       manufacturingPrice: newInvoice.items.reduce((sum, item) => sum + (item.manufacturingPricePerGram !== undefined ? item.weight * item.manufacturingPricePerGram : 0), 0),
       tax: newInvoice.totalTax,
       totalPrice: newInvoice.grandTotal,
       description: newInvoice.description || '',
       status: newInvoice.status,
    };

    addInvoice(baseInvoice);
    setInvoice(newInvoice);
    setOpenInvoiceDialog(true);

    setSnackbar({
      open: true,
      message: 'Sell invoice generated successfully!',
      severity: 'success',
    });

    setItemId('');
    setFoundItem(undefined);
    setSelectedItems([]);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseInvoiceDialog = () => {
    setOpenInvoiceDialog(false);
    setInvoice(null);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Sell Items
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmitSale}> {/* Use the new submit handler */}
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Enter Item ID"
                value={itemId}
                onChange={handleItemIdChange}
                placeholder="e.g., ITEM-001"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'secondary.main',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                onClick={handleSearchItem}
                disabled={!itemId}
                fullWidth
                sx={{
                  backgroundColor: 'primary.main',
                  border: '2px solid transparent',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    borderColor: 'secondary.main',
                  },
                }}
              >
                Search Item
              </Button>
            </Grid>
             <Grid item xs={12} md={3}> {/* New Grid item for Add button */}
              <Button
                variant="contained"
                onClick={handleAddItemToSale}
                disabled={!foundItem}
                fullWidth
                 startIcon={<AddIcon />}
                sx={{
                  backgroundColor: 'success.main',
                  border: '2px solid transparent',
                  '&:hover': {
                    backgroundColor: 'success.dark',
                    borderColor: 'secondary.main',
                  },
                }}
              >
                Add to Sale
              </Button>
            </Grid>

            {foundItem && (
              <Grid item xs={12}> {/* Display details of the currently found item */}
                 <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Found Item Details:
                </Typography>
                 <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item ID</TableCell>
                        <TableCell>Item Type</TableCell>
                        <TableCell>Karat</TableCell>
                        <TableCell>Weight (g)</TableCell>
                        <TableCell>Price (JD)</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{foundItem.id}</TableCell>
                        <TableCell>{foundItem.itemType}</TableCell>
                        <TableCell>{foundItem.karat}</TableCell>
                        <TableCell>{foundItem.weight.toFixed(2)}</TableCell>
                        <TableCell>{foundItem.price.toFixed(2)}</TableCell>
                        <TableCell>{foundItem.description || 'N/A'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}

            {selectedItems.length > 0 && (
              <Grid item xs={12}> {/* Display table of selected items */}
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Items for Sale:
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item ID</TableCell>
                        <TableCell>Item Type</TableCell>
                        <TableCell>Karat</TableCell>
                        <TableCell>Weight (g)</TableCell>
                        <TableCell>Price (JD)</TableCell>
                        <TableCell>Mfg. Price (JD/g)</TableCell>
                        <TableCell>Item Subtotal (JD)</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.itemType}</TableCell>
                          <TableCell>{item.karat}</TableCell>
                          <TableCell>{item.weight.toFixed(2)}</TableCell>
                          <TableCell>{item.price.toFixed(2)}</TableCell>
                          <TableCell>{item.manufacturingPricePerGram?.toFixed(2) || 'N/A'}</TableCell>
                          <TableCell>{((item.weight * item.price) + (item.manufacturingPricePerGram !== undefined ? item.weight * item.manufacturingPricePerGram : 0)).toFixed(2)}</TableCell>
                           <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveItemFromSale(item.id)}
                              color="error"
                            >
                              <RemoveIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}

            <Grid item xs={12}> {/* Submit button for the entire sale */}
               <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={selectedItems.length === 0}
                sx={{
                  backgroundColor: 'primary.main',
                  border: '2px solid transparent',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    borderColor: 'secondary.main',
                  },
                }}
              >
                Generate Sell Invoice
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
        <DialogTitle>Sell Invoice</DialogTitle>
        <DialogContent>
          {invoice && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice ID</TableCell>
                    <TableCell align="right">{invoice.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">{new Date(invoice.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                  {/* Display selected items */}
                  <TableRow>
                    <TableCell colSpan={8}><Typography variant="h6" sx={{ mt: 2 }}>Items Included:</Typography></TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>Item ID</TableCell>
                    <TableCell>Item Type</TableCell>
                    <TableCell>Karat</TableCell>
                    <TableCell>Weight (g)</TableCell>
                    <TableCell>Price (JD/g)</TableCell>
                    <TableCell>Mfg. Price (JD/g)</TableCell>
                    <TableCell>Item Subtotal (JD)</TableCell>
                    <TableCell>Item Tax (JD)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoice.items.map(item => (
                     <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.itemType}</TableCell>
                      <TableCell>{item.karat}</TableCell>
                      <TableCell>{item.weight.toFixed(2)}</TableCell>
                      <TableCell>{item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.manufacturingPricePerGram?.toFixed(2) || 'N/A'}</TableCell>
                      <TableCell>{((item.weight * item.price) + (item.manufacturingPricePerGram !== undefined ? item.weight * item.manufacturingPricePerGram : 0)).toFixed(2)}</TableCell>
                      <TableCell>{item.taxApplied?.toFixed(2) || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                   {/* Display totals */}
                  <TableRow
                    sx={{ borderTop: '2px solid #ccc' }}
                  >
                    <TableCell colSpan={8} align="right"><strong>Subtotal:</strong></TableCell>
                    <TableCell align="right"><strong>{invoice.subtotal.toFixed(2)} JD</strong></TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell colSpan={8} align="right"><strong>Total Tax ({taxRates.vat + taxRates.customs + taxRates.otherTaxes}%):</strong></TableCell>
                    <TableCell align="right"><strong>{invoice.totalTax.toFixed(2)} JD</strong></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={8} align="right"><strong>Grand Total:</strong></TableCell>
                    <TableCell align="right"><strong>{invoice.grandTotal.toFixed(2)} JD</strong></TableCell>
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

export default SellOption; 