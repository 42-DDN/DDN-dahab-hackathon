import React, { useState, useEffect } from 'react';
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
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import axios from '../../config/axios'; // Use the configured axios instance

interface InventoryItem {
  id: string;
  itemType: string;
  karat: string;
  weight: number;
  price: number;
  description?: string;
  origin?: string;
  manufacturePrice?: number;
  status?: string;
}

const Inventory: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Fetch inventory items from backend
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/management/getallitems',{withCredentials: true});
      console.log('Fetched inventory:', response.data);
      
      // Transform backend data to match frontend interface
      const transformedData = response.data.map((item: any) => ({
        id: item.id || item._id,
        itemType: item.type || item.itemType,
        karat: item.karat,
        weight: item.weight,
        price: item.buyPrice || item.price,
        description: item.description || '',
        origin: item.origin || '',
        manufacturePrice: item.manufacturePrice || 0,
        status: item.status || 'available',
      }));
      
      setInventory(transformedData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch inventory items',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch inventory on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredItems = inventory.filter((item: InventoryItem) =>
    Object.values(item).some((value: unknown) =>
      (typeof value === 'string' || typeof value === 'number') && 
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Inventory View
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              width: 300,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'secondary.main',
                },
              },
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Total Items: {inventory.length}
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item ID</TableCell>
                <TableCell>Item Type</TableCell>
                <TableCell>Karat</TableCell>
                <TableCell>Weight (g)</TableCell>
                <TableCell>Price (JD)</TableCell>
                <TableCell>Origin</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedItems.map((item: InventoryItem) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.itemType}</TableCell>
                  <TableCell>{item.karat}</TableCell>
                  <TableCell>{item.weight.toFixed(2)}</TableCell>
                  <TableCell>{item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.origin || 'N/A'}</TableCell>
                  <TableCell>{item.description || 'N/A'}</TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: item.status === 'available' ? 'success.light' : 'warning.light',
                        color: item.status === 'available' ? 'success.dark' : 'warning.dark',
                      }}
                    >
                      {item.status || 'available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery ? 'No items found matching your search.' : 'No inventory items found.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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

export default Inventory;