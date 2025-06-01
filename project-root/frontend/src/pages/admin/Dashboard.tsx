import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  BarChart,
  PieChart,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Settings as SettingsIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock data for charts
const salesData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

// Mock data for inventory distribution by karat
const goldKaratDistribution = [
  { name: '14K', value: 150 },
  { name: '18K', value: 250 },
  { name: '21K', value: 400 },
  { name: '24K', value: 100 },
];

const COLORS = ['#FFBB28', '#FF8042', '#00C49F', '#0088FE']; // Colors for karats

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    // TODO: Implement actual export functionality
    setSnackbar({
      open: true,
      message: `Exporting data to ${format.toUpperCase()}...`,
      severity: 'info',
    });
    handleMenuClose();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-seller':
        navigate('/admin/sellers');
        break;
      case 'modify-fees':
        navigate('/admin/fees');
        break;
      case 'manage-inventory':
        navigate('/admin/inventory');
        break;
      case 'export':
        handleMenuClick(new MouseEvent('click') as any);
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Admin Dashboard
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6">Active Sellers</Typography>
              </Box>
              <Typography variant="h4">12</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InventoryIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6">Total Inventory</Typography>
              </Box>
              <Typography variant="h4">1,234</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6">Monthly Revenue</Typography>
              </Box>
              <Typography variant="h4">$45,678</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Sales Overview</Typography>
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Gold Inventory Distribution by Karat</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={goldKaratDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {goldKaratDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Quick Actions</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                justifyContent: 'flex-start',
                backgroundColor: 'primary.main',
                border: '2px solid transparent',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  borderColor: 'secondary.main',
                },
              }}
              onClick={() => handleQuickAction('add-seller')}
            >
              Add New Seller
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<SettingsIcon />}
              sx={{
                justifyContent: 'flex-start',
                backgroundColor: 'primary.main',
                border: '2px solid transparent',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  borderColor: 'secondary.main',
                },
              }}
              onClick={() => handleQuickAction('modify-fees')}
            >
              Modify Fees
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<InventoryIcon />}
              sx={{
                justifyContent: 'flex-start',
                backgroundColor: 'primary.main',
                border: '2px solid transparent',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  borderColor: 'secondary.main',
                },
              }}
              onClick={() => handleQuickAction('manage-inventory')}
            >
              Manage Inventory
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{
                justifyContent: 'flex-start',
                backgroundColor: 'primary.main',
                border: '2px solid transparent',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  borderColor: 'secondary.main',
                },
              }}
              onClick={() => handleQuickAction('export')}
            >
              Export Data
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Menu for export options */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleExport('excel')}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export to Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('pdf')}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export to PDF</ListItemText>
        </MenuItem>
      </Menu>

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

export default AdminDashboard; 