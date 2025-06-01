import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import {
  QrCodeScanner as QrCodeScannerIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Receipt as ReceiptIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import QRScanner from '../../components/QRScanner';

const SellerHome: React.FC = () => {
  const navigate = useNavigate();
  const [qrScannerOpen, setQrScannerOpen] = useState(false);

  const handleQRScan = (data: any) => {
    if (data.type === 'purchase') {
      navigate('/seller/buy', { state: { itemData: data } });
    } else if (data.type === 'sale') {
      navigate('/seller/sell', { state: { itemData: data } });
    }
  };

  const quickActions = [
    {
      title: 'Scan QR Code',
      description: 'Scan QR code for quick purchase or sale',
      icon: <QrCodeScannerIcon sx={{ fontSize: 40 }} />,
      action: () => setQrScannerOpen(true),
    },
    {
      title: 'New Purchase',
      description: 'Record a new gold purchase',
      icon: <AddIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/seller/buy'),
    },
    {
      title: 'New Sale',
      description: 'Record a new gold sale',
      icon: <RemoveIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/seller/sell'),
    },
    {
      title: 'View Invoices',
      description: 'View and manage all invoices',
      icon: <ReceiptIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/seller/invoices'),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome Back
      </Typography>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{action.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {action.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={action.action}
                    sx={{
                      borderColor: 'transparent',
                      '&:hover': {
                        borderColor: 'secondary.main',
                        backgroundColor: 'rgba(255, 215, 0, 0.04)',
                      },
                    }}
                  >
                    {action.title}
                    <ArrowForwardIcon sx={{ ml: 1 }} />
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Recent Activity */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No recent activity to display
          </Typography>
        </Box>
      </Paper>

      <QRScanner
        open={qrScannerOpen}
        onClose={() => setQrScannerOpen(false)}
        onScan={handleQRScan}
      />
    </Box>
  );
};

export default SellerHome; 