import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@mui/material';

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <Button variant="outlined" color="error" onClick={logout}>
      Sair
    </Button>
  );
};

export default LogoutButton;
