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
import { useInvoices, Invoice } from '../../contexts/InvoiceContext';

const InvoiceManagement: React.FC = () => {
  const { invoices } = useInvoices();
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
    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 20, 50);
    doc.text(`Type: ${invoice.type.toUpperCase()}`, 20, 60);

    // Add item details
    const itemDetails = [
      ['Item Type', invoice.itemType],
      ['Karat', invoice.karat || 'N/A'],
      ['Weight', `${invoice.weight}g`],
      ['Price per gram', `${invoice.price.toFixed(2)} JD`],
    ];

    if (invoice.type === 'sell') {
      itemDetails.push(
        ['Manufacturing Price', `${invoice.manufacturingPrice?.toFixed(2)} JD`],
        ['Tax', `${invoice.tax?.toFixed(2)} JD`]
      );
    }

    itemDetails.push(['Total Price', `${invoice.totalPrice.toFixed(2)} JD`]);

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

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.itemType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchQuery.toLowerCase())
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
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice ID</TableCell>
                <TableCell>Item Type</TableCell>
                <TableCell>Type</TableCell>
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
                    <TableCell>{invoice.itemType}</TableCell>
                    <TableCell>{invoice.type}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>{invoice.totalPrice.toFixed(2)} JD</TableCell>
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
                  Date: {new Date(selectedInvoice.date).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Item Details</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Item Type</TableCell>
                        <TableCell>{selectedInvoice.itemType}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Karat</TableCell>
                        <TableCell>{selectedInvoice.karat || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Weight</TableCell>
                        <TableCell>{selectedInvoice.weight}g</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Price per gram</TableCell>
                        <TableCell>{selectedInvoice.price.toFixed(2)} JD</TableCell>
                      </TableRow>
                      {selectedInvoice.type === 'sell' && (
                        <>
                          <TableRow>
                            <TableCell>Manufacturing Price</TableCell>
                            <TableCell>{selectedInvoice.manufacturingPrice?.toFixed(2)} JD</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Tax</TableCell>
                            <TableCell>{selectedInvoice.tax?.toFixed(2)} JD</TableCell>
                          </TableRow>
                        </>
                      )}
                      <TableRow>
                        <TableCell><strong>Total Price</strong></TableCell>
                        <TableCell><strong>{selectedInvoice.totalPrice.toFixed(2)} JD</strong></TableCell>
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