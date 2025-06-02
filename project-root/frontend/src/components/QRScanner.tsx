import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography } from '@mui/material';
import jsQR from 'jsqr';

interface QRScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (data: any) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ open, onClose, onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const [isScanning, setIsScanning] = useState(false);

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        try {
          const data = JSON.parse(code.data);
          onScan(data);
          onClose();
          return;
        } catch (error) {
          console.error('Invalid QR code format');
        }
      }
    }

    if (isScanning) {
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        scanQRCode();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      stopCamera();
    }
  };

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      // stopCamera(); // Keep camera running to allow scanning again if dialog is reopened quickly
    }

    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => {
          track.stop();
          track.enabled = false;
        });
        streamRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsScanning(false);
    };
  }, [open]); // eslint-disable-next-line react-hooks/exhaustive-deps

  if (!open) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>Scan QR Code</DialogTitle>
      <DialogContent>
        <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            playsInline
            autoPlay
            muted
          />
          <canvas
            ref={canvasRef}
            style={{
              display: 'none',
            }}
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