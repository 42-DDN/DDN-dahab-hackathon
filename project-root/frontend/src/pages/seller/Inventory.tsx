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
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

// Interface for inventory items
interface InventoryItem {
  id: string;
  name: string;
  type: string;
  karat?: string;
  weight: number;
  price: number;
  status: 'Available' | 'Reserved' | 'Sold';
  location: string;
}

// Initial mock data for inventory items
const initialItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Gold Ring',
    type: 'Ring',
    karat: '21K',
    weight: 10.5,
    price: 500,
    status: 'Available',
    location: 'Main Store',
  },
  {
    id: '2',
    name: 'Gold Necklace',
    type: 'Necklace',
    karat: '18K',
    weight: 25.0,
    price: 300,
    status: 'Available',
    location: 'Main Store',
  },
  {
    id: '3',
    name: 'Gold Earrings',
    type: 'Earrings',
    karat: '24K',
    weight: 5.0,
    price: 1000,
    status: 'Reserved',
    location: 'Display Case',
  },
];

const karats = ['14K', '18K', '21K', '24K']; // Available karats
const itemStatuses = ['Available', 'Reserved', 'Sold']; // Available statuses

const Inventory: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [mockItems, setMockItems] = useState<InventoryItem[]>(initialItems); // Use state for items
  const [formData, setFormData] = useState<Partial<InventoryItem>>({}); // State for form data
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

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

  const handleOpenDialog = (item?: InventoryItem) => {
    if (item) {
      setSelectedItem(item);
      setFormData(item); // Load item data into form
    } else {
      setSelectedItem(null);
      setFormData({ // Reset form for new item
        name: '',
        type: '',
        karat: '',
        weight: 0,
        price: 0,
        status: 'Available',
        location: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setFormData({}); // Clear form data
  };

  const handleInputChange = (field: keyof InventoryItem) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const generateItemId = (items: InventoryItem[]): string => {
    const lastItem = items[items.length - 1];
    if (!lastItem) return '1';
    const lastId = parseInt(lastItem.id);
    return (lastId + 1).toString();
  };

  const handleSubmit = () => {
    // Validate form data
    if (!formData.name || !formData.type || !formData.karat || !formData.weight || !formData.price || !formData.status || !formData.location) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error',
      });
      return;
    }

    if (selectedItem) {
      // Update existing item
      setMockItems(prevItems =>
        prevItems.map(item =>
          item.id === selectedItem.id ? { ...item, ...formData as InventoryItem } : item
        )
      );
      setSnackbar({ open: true, message: 'Item updated successfully', severity: 'success' });
    } else {
      // Add new item
      const newItem: InventoryItem = {
        id: generateItemId(mockItems),
        name: formData.name!,
        type: formData.type!,
        karat: formData.karat!,
        weight: formData.weight!,
        price: formData.price!,
        status: formData.status!,
        location: formData.location!,
      };
      setMockItems(prevItems => [...prevItems, newItem]);
      setSnackbar({ open: true, message: 'Item added successfully', severity: 'success' });
    }

    handleCloseDialog();
  };

  const handleDelete = (itemToDelete: InventoryItem) => {
    setMockItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
    setSnackbar({ open: true, message: 'Item deleted successfully', severity: 'success' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredItems = mockItems.filter((item: InventoryItem) =>
    Object.values(item).some((value: unknown) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Inventory Management
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add New Item
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Karat</TableCell>
                <TableCell>Weight (g)</TableCell>
                <TableCell>Price ($)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.karat}</TableCell>
                    <TableCell>{item.weight}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(item)}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(item)}
                        title="Delete"
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
          count={filteredItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Add/Edit Item Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedItem ? 'Edit Item' : 'Add New Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name || ''}
                onChange={handleInputChange('name')}
                margin="normal"
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
                label="Type"
                value={formData.type || ''}
                onChange={handleInputChange('type')}
                margin="normal"
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
                value={formData.karat || ''}
                onChange={handleInputChange('karat')}
                margin="normal"
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
                value={formData.weight || ''}
                onChange={handleInputChange('weight')}
                margin="normal"
                required
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price ($)"
                type="number"
                value={formData.price || ''}
                onChange={handleInputChange('price')}
                margin="normal"
                required
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
             <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status || 'Available'}
                onChange={handleInputChange('status')}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'secondary.main',
                    },
                  },
                }}
              >
                 {itemStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location || ''}
                onChange={handleInputChange('location')}
                margin="normal"
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
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

export default Inventory; 