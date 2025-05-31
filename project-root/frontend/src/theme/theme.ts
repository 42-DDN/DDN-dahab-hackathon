import { createTheme } from '@mui/material/styles';

// Define the custom colors
const colors = {
  darkGreen: '#1B4332',
  gold: '#D4AF37',
  white: '#FFFFFF',
};

// Create the theme
const theme = createTheme({
  palette: {
    primary: {
      main: colors.darkGreen,
      light: '#2D6A4F',
      dark: '#081C15',
      contrastText: colors.white,
    },
    secondary: {
      main: colors.gold,
      light: '#E5C76B',
      dark: '#B38F2A',
      contrastText: colors.darkGreen,
    },
    background: {
      default: colors.white,
      paper: colors.white,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      color: colors.darkGreen,
      fontWeight: 600,
    },
    h2: {
      color: colors.darkGreen,
      fontWeight: 600,
    },
    h3: {
      color: colors.darkGreen,
      fontWeight: 500,
    },
    h4: {
      color: colors.darkGreen,
      fontWeight: 500,
    },
    h5: {
      color: colors.darkGreen,
      fontWeight: 500,
    },
    h6: {
      color: colors.darkGreen,
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: colors.darkGreen,
            opacity: 0.9,
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: colors.gold,
            opacity: 0.9,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.darkGreen,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.darkGreen,
          color: colors.white,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: colors.darkGreen,
          color: colors.white,
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme; 