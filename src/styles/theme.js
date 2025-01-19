import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2A7D32', // Verde escuro
    },
    secondary: {
      main: '#A5D6A7', // Verde claro
    },
    error: {
      main: '#D32F2F', // Vermelho para erros
    },
    background: {
      default: '#E8F5E9', // Verde suave para fundo
      box: '#fff', // Branco para a box
    },
  },
  typography: {
    fontFamily: '"Poppins", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.8rem',
      textTransform: 'initial'
    },
  },
});

export default theme;
