import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  const { logout, user } = useAuth();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Gerenciador de Contatos
          </Link>
        </Typography>
        <Box>
          {!user ? (
            <>
              <Button color="inherit" component={Link} to="/">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Registrar
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/contacts">
                Home
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
