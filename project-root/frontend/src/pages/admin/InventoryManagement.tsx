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
  InputAdornment,
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
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface InventoryItem {
  id: string;
  name: string;
  type: string;
  karat?: string;
  weight: number;
  price: number;
  status: 'available' | 'sold' | 'pending';
  location: string;
}

const initialItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Gold Ring',
    type: 'Ring',
    weight: 10.5,
    price: 5000,
    status: 'available',
    location: 'Vault A',
  },
  {
    id: '2',
    name: 'Silver Necklace',
    type: 'Necklace',
    weight: 25.0,
    price: 750,
    status: 'available',
    location: 'Vault B',
  },
];

const itemTypes = ['Ring', 'Necklace', 'Earrings', 'Bracelet'];
const karats = ['14K', '18K', '21K', '24K'];

const InventoryManagement: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [mockItems, setMockItems] = useState<InventoryItem[]>(initialItems);

  interface FormData {
    name: string;
    type: string;
    karat?: string;
    weight: string;
    price: string;
    status: 'available' | 'sold' | 'pending';
    location: string;
  }

  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: '',
    karat: '',
    weight: '',
    price: '',
    status: 'available',
    location: '',
  });
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
      setFormData({
        ...item,
        weight: item.weight.toString(),
        price: item.price.toString(),
      });
    } else {
      setSelectedItem(null);
      setFormData({
        name: '',
        type: '',
        karat: '',
        weight: '',
        price: '',
        status: 'available',
        location: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setFormData({
      name: '',
      type: '',
      karat: '',
      weight: '',
      price: '',
      status: 'available',
      location: '',
    });
  };

  const handleInputChange = (field: keyof InventoryItem) => (
    event: React.ChangeEvent<HTMLInputElement>
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
    if (!formData.name || !formData.type || !formData.weight || !formData.price || !formData.location) {
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
          item.id === selectedItem.id
            ? {
                ...item,
                ...formData,
                weight: parseFloat(formData.weight as string),
                price: parseFloat(formData.price as string),
              }
            : item
        )
      );
    } else {
      // Add new item
      const newItem: InventoryItem = {
        id: generateItemId(mockItems),
        name: formData.name!,
        type: formData.type!,
        weight: parseFloat(formData.weight as string),
        price: parseFloat(formData.price as string),
        status: formData.status as 'available' | 'sold' | 'pending',
        location: formData.location!,
      };
      setMockItems(prevItems => [...prevItems, newItem]);
    }

    setSnackbar({
      open: true,
      message: selectedItem
        ? 'Item updated successfully'
        : 'Item added successfully',
      severity: 'success',
    });

    handleCloseDialog();
  };

  const handleDelete = (item: InventoryItem) => {
    setMockItems(prevItems =>
      prevItems.filter(i => i.id !== item.id)
    );
    setSnackbar({
      open: true,
      message: 'Item deleted successfully',
      severity: 'success',
    });
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
            placeholder="Search items..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              ),
            }}
            sx={{ width: 300 }}
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
                    <TableCell>${item.price.toFixed(2)}</TableCell>
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
                value={formData.name}
                onChange={handleInputChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Type"
                value={formData.type}
                onChange={handleInputChange('type')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Karat"
                value={formData.karat || ''}
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
                label="Weight (g)"
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
                label="Price ($)"
                type="number"
                value={formData.price}
                onChange={handleInputChange('price')}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={handleInputChange('location')}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
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