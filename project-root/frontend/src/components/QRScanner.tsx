import React from 'react';
import { QrReader } from 'react-qr-reader';
import { Dialog, DialogTitle, DialogContent, Box, Typography } from '@mui/material';

interface QRScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ open, onClose, onScan }) => {
  const handleScan = (result: any) => {
    if (result) {
      try {
        const data = JSON.parse(result?.text);
        onScan(data);
        onClose();
      } catch (error) {
        console.error('Invalid QR code format');
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Scan QR Code</DialogTitle>
      <DialogContent>
        <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={handleScan}
            videoStyle={{ width: '100%' }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Position the QR code within the frame to scan
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default QRScanner; 