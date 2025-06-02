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
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import axios from '../../config/axios'; // Use the configured axios instance

interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  status: 'active' | 'inactive';
}

const SellerManagement: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [formData, setFormData] = useState<Partial<Seller>>({
    name: '',
    email: '',
    phone: '',
    password: '',
    status: 'active',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch sellers from backend
  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/management/getallsellers');
      console.log('Fetched sellers:', response.data);
      
      // Transform backend data to match frontend interface
      const transformedData = response.data.map((seller: any) => ({
        id: seller.id || seller._id,
        name: seller.name || seller.fullName,
        email: seller.email,
        phone: seller.phone || seller.phoneNumber || '',
        password: '', // Never show actual password
        status: seller.status || 'active',
      }));
      
      setSellers(transformedData);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch sellers',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch sellers on component mount
  useEffect(() => {
    fetchSellers();
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

  const handleOpenDialog = (seller?: Seller) => {
    if (seller) {
      setSelectedSeller(seller);
      setFormData({
        ...seller,
        password: '', // Don't populate password field when editing
      });
    } else {
      setSelectedSeller(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSeller(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      status: 'active',
    });
  };

  const handleInputChange = (field: keyof Seller) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error',
      });
      return;
    }

    if (!selectedSeller && !formData.password) {
      setSnackbar({
        open: true,
        message: 'Password is required for new sellers',
        severity: 'error',
      });
      return;
    }

    try {
      if (selectedSeller) {
        // Update existing seller
        const updateData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          status: formData.status,
          ...(formData.password && { password: formData.password }),
        };

        await axios.put(`/api/management/updateseller/${selectedSeller.id}`, updateData);
        
        setSnackbar({
          open: true,
          message: 'Seller updated successfully',
          severity: 'success',
        });
      } else {
        // Create new seller
        const sellerData = {
          name: formData.name!,
          email: formData.email!,
          phone: formData.phone!,
          password: formData.password!,
          role: 'seller', // Ensure role is set to seller
          status: formData.status || 'active',
        };

        await axios.post('/api/auth/signup', sellerData);
        
        setSnackbar({
          open: true,
          message: 'Seller added successfully',
          severity: 'success',
        });
      }

      // Refresh the sellers list
      await fetchSellers();
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error submitting seller data:', error);
      const errorMessage = error.response?.data?.message || 'Error submitting seller data';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const handleDelete = async (seller: Seller) => {
    if (!window.confirm('Are you sure you want to delete this seller?')) {
      return;
    }

    try {
      await axios.delete(`/api/management/deleteseller/${seller.id}`);
      
      setSnackbar({
        open: true,
        message: 'Seller deleted successfully',
        severity: 'success',
      });

      // Refresh the sellers list
      await fetchSellers();
    } catch (error: any) {
      console.error('Error deleting seller:', error);
      const errorMessage = error.response?.data?.message || 'Error deleting seller';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredSellers = sellers.filter((seller) =>
    Object.values(seller).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const paginatedSellers = filteredSellers.slice(
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
        Seller Management
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            placeholder="Search sellers..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
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
            sx={{
              backgroundColor: 'primary.main',
              border: '2px solid transparent',
              '&:hover': {
                backgroundColor: 'primary.dark',
                borderColor: 'secondary.main',
              },
            }}
          >
            Add New Seller
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell>{seller.id}</TableCell>
                  <TableCell>{seller.name}</TableCell>
                  <TableCell>{seller.email}</TableCell>
                  <TableCell>{seller.phone || '-'}</TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: seller.status === 'active' ? 'success.light' : 'error.light',
                        color: seller.status === 'active' ? 'success.dark' : 'error.dark',
                      }}
                    >
                      {seller.status}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(seller)}
                      title="Edit"
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
                      onClick={() => handleDelete(seller)}
                      title="Delete"
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
          count={filteredSellers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Add/Edit Seller Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedSeller ? 'Edit Seller' : 'Add New Seller'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                margin="normal"
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
                value={formData.status}
                onChange={handleInputChange('status')}
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'secondary.main',
                    },
                  },
                }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                margin="normal"
                required={!selectedSeller}
                helperText={selectedSeller ? 'Leave blank to keep current password' : 'Required for new sellers'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            sx={{
              backgroundColor: 'primary.main',
              border: '2px solid transparent',
              '&:hover': {
                backgroundColor: 'primary.dark',
                borderColor: 'secondary.main',
              },
            }}
          >
            {selectedSeller ? 'Update' : 'Add'}
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

export default SellerManagement;