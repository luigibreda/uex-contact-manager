import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TextField, Button, Alert, Container, Typography, Box } from '@mui/material';
import Header from '../Shared/Header';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login(formData.email, formData.password);
    if (success) {
      navigate('/contacts');
    } else {
      setError('E-mail ou senha inválidos!');
    }
  };

  return (
    <>
      <Header></Header>
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Box
          sx={{
            padding: 4,
            backgroundColor: 'background.box',
            borderRadius: 2,
            boxShadow: 2,
          }}
        >

          {/* Luigi GIF */}
          <img
            src="/luigi.gif"
            alt="Luigi"
            style={{
              width: '150px',
              display: 'block',
              margin: '0 auto 16px',
            }}
          />

          <Typography variant="h2" color="primary" gutterBottom>
            Bem-vindo de volta!
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Faça login para acessar o Gerenciador de Contatos. <br></br>
            Organize seus contatos de forma fácil e prática.
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="E-mail"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Senha"
              type="password"
              fullWidth
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2 }}
            >
              Entrar
            </Button>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </form>
        </Box>
      </Container>
    </>
  );
};

export default Login;
