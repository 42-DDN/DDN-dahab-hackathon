import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import {
  ShoppingCart as BuyIcon,
  Sell as SellIcon,
  Receipt as InvoiceIcon,
  QrCodeScanner as QrIcon,
} from '@mui/icons-material';

const SellerHome: React.FC = () => {
  const navigate = useNavigate();

  const handleBuy = () => {
    navigate('/seller/buy');
  };

  const handleSell = () => {
    navigate('/seller/sell');
  };

  const handleInvoice = () => {
    navigate('/seller/invoice');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        Seller Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Buy Option */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BuyIcon sx={{ color: 'primary.main', mr: 1, fontSize: 40 }} />
                <Typography variant="h5">Buy Option</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                Purchase new items and manage your inventory
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant="contained"
                onClick={handleBuy}
                startIcon={<BuyIcon />}
              >
                Start Buying
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Sell Option */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SellIcon sx={{ color: 'primary.main', mr: 1, fontSize: 40 }} />
                <Typography variant="h5">Sell Option</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                Sell items using QR code or manual entry
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSell}
                startIcon={<SellIcon />}
              >
                Start Selling
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Invoice Management */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InvoiceIcon sx={{ color: 'primary.main', mr: 1, fontSize: 40 }} />
                <Typography variant="h5">Invoice Management</Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                View and manage your transaction invoices
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                variant="contained"
                onClick={handleInvoice}
                startIcon={<InvoiceIcon />}
              >
                View Invoices
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Quick Actions</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<QrIcon />}
              onClick={() => navigate('/seller/sell')}
            >
              Scan QR Code
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<BuyIcon />}
              onClick={() => navigate('/seller/buy')}
            >
              New Purchase
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SellIcon />}
              onClick={() => navigate('/seller/sell')}
            >
              New Sale
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<InvoiceIcon />}
              onClick={() => navigate('/seller/invoice')}
            >
              View Invoices
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default SellerHome; 