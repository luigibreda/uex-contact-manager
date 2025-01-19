import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TextField, Button, Alert } from '@mui/material';

const SignUp = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    const success = register(formData.email, formData.password);
    if (success) {
      navigate('/');
    } else {
      setError('Usuário já existe!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Cadastro</h2>
      <form onSubmit={handleSignUp}>
        <TextField
          label="E-mail"
          fullWidth
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <Button type="submit" variant="contained" style={{ marginTop: '16px' }}>
          Cadastrar
        </Button>
        {error && <Alert severity="error" style={{ marginTop: '16px' }}>{error}</Alert>}
      </form>
    </div>
  );
};

export default SignUp;
