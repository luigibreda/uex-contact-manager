import React, { useState } from 'react';
import { TextField, Button, Alert, Box } from '@mui/material';
import axios from 'axios';

const ContactForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    cep: '',
    address: '',
  });
  const [error, setError] = useState(null);

  const handleAddressLookup = async () => {
    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${formData.cep}/json/`);
      setFormData({ ...formData, address: data.logradouro });
    } catch (err) {
      setError('Erro ao buscar endereço. Verifique o CEP.');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.cpf || !formData.phone || !formData.cep || !formData.address) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    onSave(formData);
    setFormData({ name: '', cpf: '', phone: '', cep: '', address: '' });
    setError(null);
  };

  return (
    <Box component="form" onSubmit={handleSave} sx={{ mt: 2 }}>
      <TextField
        label="Nome"
        fullWidth
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="CPF"
        fullWidth
        value={formData.cpf}
        onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Telefone"
        fullWidth
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="CEP"
        fullWidth
        value={formData.cep}
        onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
        onBlur={handleAddressLookup}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Endereço"
        fullWidth
        value={formData.address}
        disabled
        required
        sx={{ mb: 2 }}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Salvar Contato
      </Button>
    </Box>
  );
};

export default ContactForm;
