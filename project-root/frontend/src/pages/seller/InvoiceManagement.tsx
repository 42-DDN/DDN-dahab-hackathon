import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface Invoice {
  id: string;
  itemId: string;
  itemName: string;
  itemType: string;
  itemWeight: number;
  karat: string;
  pricePerPiece: number;
  customerName: string;
  transactionDate: string;
  totalPrice: number;
  type: 'buy' | 'sell';
  manufacturingPrice?: number;
  tax?: number;
  status: 'Paid' | 'Pending' | 'Cancelled';
}

// Mock data for invoices
const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    itemId: 'ITEM-001',
    itemName: 'Bracelet of the Lion',
    itemType: 'Bracelet',
    itemWeight: 25.5,
    karat: '21K',
    pricePerPiece: 85.50,
    customerName: 'John Doe',
    transactionDate: '2024-03-15',
    totalPrice: 2180.25,
    type: 'sell',
    manufacturingPrice: 500,
    tax: 150.25,
    status: 'Paid',
  },
  {
    id: 'INV-002',
    itemId: 'ITEM-002',
    itemName: 'Gold Ring',
    itemType: 'Ring',
    itemWeight: 10.0,
    karat: '18K',
    pricePerPiece: 75.00,
    customerName: 'Jane Smith',
    transactionDate: '2024-03-14',
    totalPrice: 750.00,
    type: 'buy',
    status: 'Pending',
  },
];

const InvoiceManagement: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedInvoice(null);
  };

  const generatePDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    // Add invoice details
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoice.id}`, 20, 40);
    doc.text(`Date: ${invoice.transactionDate}`, 20, 50);
    doc.text(`Customer: ${invoice.customerName}`, 20, 60);
    doc.text(`Type: ${invoice.type.toUpperCase()}`, 20, 70);

    // Add item details
    const itemDetails = [
      ['Item ID', invoice.itemId],
      ['Item Name', invoice.itemName],
      ['Item Type', invoice.itemType],
      ['Weight', `${invoice.itemWeight}g`],
      ['Karat', invoice.karat],
      ['Price per Piece', `$${invoice.pricePerPiece.toFixed(2)}`],
    ];

    if (invoice.type === 'sell') {
      itemDetails.push(
        ['Manufacturing Price', `$${invoice.manufacturingPrice?.toFixed(2)}`],
        ['Tax', `$${invoice.tax?.toFixed(2)}`]
      );
    }

    itemDetails.push(['Total Price', `$${invoice.totalPrice.toFixed(2)}`]);

    // Add table
    (doc as any).autoTable({
      startY: 80,
      head: [['Description', 'Value']],
      body: itemDetails,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    return doc;
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    const doc = generatePDF(invoice);
    doc.save(`invoice-${invoice.id}.pdf`);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    const doc = generatePDF(invoice);
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  const filteredInvoices = mockInvoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Invoice Management
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Search Invoices"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: 300,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'secondary.main',
                },
              },
            }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'primary.main',
              border: '2px solid transparent',
              '&:hover': {
                backgroundColor: 'primary.dark',
                borderColor: 'secondary.main',
              },
            }}
          >
            Generate New Invoice
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice ID</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.itemName}</TableCell>
                    <TableCell>{invoice.type}</TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>{invoice.transactionDate}</TableCell>
                    <TableCell>${invoice.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewInvoice(invoice)}
                        sx={{
                          '&:hover': {
                            border: '2px solid',
                            borderColor: 'secondary.main',
                          },
                        }}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDownloadInvoice(invoice)}
                        sx={{
                          '&:hover': {
                            border: '2px solid',
                            borderColor: 'secondary.main',
                          },
                        }}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handlePrintInvoice(invoice)}
                        sx={{
                          '&:hover': {
                            border: '2px solid',
                            borderColor: 'secondary.main',
                          },
                        }}
                      >
                        <PrintIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredInvoices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* View Invoice Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Invoice Details</DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6">Invoice #{selectedInvoice.id}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {selectedInvoice.transactionDate}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Customer Information</Typography>
                <Typography>Name: {selectedInvoice.customerName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Transaction Type</Typography>
                <Typography>{selectedInvoice.type.toUpperCase()}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Item Details</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Item ID</TableCell>
                        <TableCell>{selectedInvoice.itemId}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Item Name</TableCell>
                        <TableCell>{selectedInvoice.itemName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Item Type</TableCell>
                        <TableCell>{selectedInvoice.itemType}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Weight</TableCell>
                        <TableCell>{selectedInvoice.itemWeight}g</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Karat</TableCell>
                        <TableCell>{selectedInvoice.karat}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Price per Piece</TableCell>
                        <TableCell>${selectedInvoice.pricePerPiece.toFixed(2)}</TableCell>
                      </TableRow>
                      {selectedInvoice.type === 'sell' && (
                        <>
                          <TableRow>
                            <TableCell>Manufacturing Price</TableCell>
                            <TableCell>${selectedInvoice.manufacturingPrice?.toFixed(2)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Tax</TableCell>
                            <TableCell>${selectedInvoice.tax?.toFixed(2)}</TableCell>
                          </TableRow>
                        </>
                      )}
                      <TableRow>
                        <TableCell><strong>Total Price</strong></TableCell>
                        <TableCell><strong>${selectedInvoice.totalPrice.toFixed(2)}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
          <Button
            onClick={() => selectedInvoice && handlePrintInvoice(selectedInvoice)}
            variant="contained"
            startIcon={<PrintIcon />}
            sx={{
              backgroundColor: 'primary.main',
              border: '2px solid transparent',
              '&:hover': {
                backgroundColor: 'primary.dark',
                borderColor: 'secondary.main',
              },
            }}
          >
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvoiceManagement; 