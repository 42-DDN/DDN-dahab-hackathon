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
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Print as PrintIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

interface Invoice {
  id: string;
  date: string;
  type: 'buy' | 'sell';
  itemType: string;
  weight: number;
  price: number;
  description: string;
  status: 'pending' | 'completed' | 'cancelled';
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    date: '2024-03-20',
    type: 'buy',
    itemType: 'Gold Ring',
    weight: 10.5,
    price: 5000,
    description: '18K gold ring with diamond',
    status: 'completed',
  },
  {
    id: 'INV-002',
    date: '2024-03-19',
    type: 'sell',
    itemType: 'Silver Necklace',
    weight: 25.0,
    price: 750,
    description: '925 silver necklace',
    status: 'pending',
  },
];

const InvoiceManagement: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handlePrint = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPreviewOpen(true);
  };

  const handleDownload = (invoice: Invoice) => {
    // TODO: Implement PDF download functionality
    console.log('Downloading invoice:', invoice.id);
  };

  const filteredInvoices = mockInvoices.filter((invoice) =>
    Object.values(invoice).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const paginatedInvoices = filteredInvoices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Invoice Management
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Item Type</TableCell>
                <TableCell>Weight (g)</TableCell>
                <TableCell>Price ($)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.type.toUpperCase()}</TableCell>
                  <TableCell>{invoice.itemType}</TableCell>
                  <TableCell>{invoice.weight}</TableCell>
                  <TableCell>${invoice.price.toFixed(2)}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handlePrint(invoice)}
                      title="Print Invoice"
                    >
                      <PrintIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleDownload(invoice)}
                      title="Download Invoice"
                    >
                      <DownloadIcon />
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

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Invoice Preview</DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Invoice #{selectedInvoice.id}
              </Typography>
              <Typography variant="body1" paragraph>
                Date: {selectedInvoice.date}
              </Typography>
              <Typography variant="body1" paragraph>
                Type: {selectedInvoice.type.toUpperCase()}
              </Typography>
              <Typography variant="body1" paragraph>
                Item: {selectedInvoice.itemType}
              </Typography>
              <Typography variant="body1" paragraph>
                Weight: {selectedInvoice.weight}g
              </Typography>
              <Typography variant="body1" paragraph>
                Price: ${selectedInvoice.price.toFixed(2)}
              </Typography>
              <Typography variant="body1" paragraph>
                Description: {selectedInvoice.description}
              </Typography>
              <Typography variant="body1" paragraph>
                Status: {selectedInvoice.status}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={() => {
              window.print();
              setPreviewOpen(false);
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