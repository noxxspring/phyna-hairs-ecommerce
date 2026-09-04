import { createTheme } from '@mui/material/styles';

export const customTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#08080c',
      paper: '#12121a',
    },
    primary: {
      main: '#e6c687', // Luxury Gold
    },
    secondary: {
      main: '#ff2a85', // Shimmering Pink
    },
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
    },
  },
  typography: {
    fontFamily: ['serif', 'Inter', 'sans-serif'].join(','),
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': { color: '#ffffff' },
          '& .MuiInputLabel-root': { color: '#a1a1aa' },
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
            '&:hover fieldset': { borderColor: '#ff2a85' },
            '&.Mui-focused fieldset': { borderColor: '#ff2a85' },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.15)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#ff2a85' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff2a85' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#12121a',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.05)',
        },
        head: {
          color: '#e6c687',
          fontWeight: 'bold',
        },
      },
    },
  },
});