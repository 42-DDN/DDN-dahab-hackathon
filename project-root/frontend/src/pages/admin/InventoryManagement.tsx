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
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from '../../config/axios';

const karats = ['14K', '18K', '21K', '24K'];

interface InventoryItem {
  id: string;
  itemType: string;
  karat: string;
  weight: number;
  price: number;
  description?: string;
  origin?: string;
  manufacturePrice?: number;
}

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>({
    itemType: '',
    karat: '',
    weight: 0,
    price: 0,
    description: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Fetch all items from backend
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/management/getallitems');
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

  const handleAddClick = () => {
    setSelectedItem(null);
    setFormData({
      itemType: '',
      karat: '',
      weight: 0,
      price: 0,
      description: '',
    });
    setOpenDialog(true);
  };

  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormData({
      itemType: item.itemType,
      karat: item.karat,
      weight: item.weight,
      price: item.price,
      description: item.description || '',
    });
    setOpenDialog(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await axios.delete(`/api/management/deleteitem/${id}`);
      
      // Refresh inventory after deletion
      await fetchInventory();
      
      setSnackbar({
        open: true,
        message: 'Item deleted successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete item',
        severity: 'error',
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleInputChange = (field: keyof Omit<InventoryItem, 'id'>) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    const itemData = {
      ...formData,
      weight: parseFloat(formData.weight as any),
      price: parseFloat(formData.price as any),
    };

    if (isNaN(itemData.weight) || isNaN(itemData.price)) {
      setSnackbar({
        open: true,
        message: 'Please enter valid numbers for Weight and Price.',
        severity: 'error',
      });
      return;
    }

    try {
      if (selectedItem) {
        // Update existing item
        const updateData = {
          type: itemData.itemType,
          karat: itemData.karat,
          weight: itemData.weight,
          buyPrice: itemData.price,
          description: itemData.description,
        };

        await axios.put(`/api/management/updateitem/${selectedItem.id}`, updateData);
        
        setSnackbar({
          open: true,
          message: 'Item updated successfully!',
          severity: 'success',
        });
      } else {
        // Create new item
        const itemAPI = {
          type: itemData.itemType,
          karat: itemData.karat,
          weight: itemData.weight,
          buyPrice: itemData.price,
          origin: "local",
          manufacturePrice: 200,
          description: itemData.description,
        };

        await axios.post('/api/management/newitem', itemAPI);
        
        setSnackbar({
          open: true,
          message: 'Item added successfully!',
          severity: 'success',
        });
      }

      // Refresh inventory after add/update
      await fetchInventory();
      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting item:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save item. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.itemType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.karat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedInventory = filteredInventory.slice(
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
        Inventory Management
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Search Inventory"
            value={searchQuery}
            onChange={handleSearchChange}
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
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{
              backgroundColor: 'primary.main',
              border: '2px solid transparent',
              '&:hover': {
                backgroundColor: 'primary.dark',
                borderColor: 'secondary.main',
              },
            }}
          >
            Add New Item
          </Button>
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
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.itemType}</TableCell>
                  <TableCell>{item.karat}</TableCell>
                  <TableCell>{item.weight.toFixed(2)}</TableCell>
                  <TableCell>{item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.description || '-'}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(item)}
                      sx={{
                        '&:hover': {
                          border: '2px solid',
                          borderColor: 'secondary.main',
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(item.id)}
                      sx={{
                        '&:hover': {
                          border: '2px solid',
                          borderColor: 'secondary.main',
                        },
                      }}
                    >
                      <DeleteIcon />
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
          count={filteredInventory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Item Type"
                value={formData.itemType}
                onChange={handleInputChange('itemType')}
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight (g)"
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
                label="Price (JD)"
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleInputChange('description')}
                multiline
                rows={4}
                placeholder="Enter any additional details about the item"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary"
            sx={{
              backgroundColor: 'primary.main',
              border: '2px solid transparent',
              '&:hover': {
                backgroundColor: 'primary.dark',
                borderColor: 'secondary.main',
              },
            }}
          >
            {selectedItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default InventoryManagement;