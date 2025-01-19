import React, { useState } from 'react';
import { Box, Button, Typography, TextField, List, ListItem, ListItemText, Modal } from '@mui/material';
import { useContact } from '../../context/ContactContext';
import { SearchOff } from '@mui/icons-material'; // Ícone para melhorar o design
import Header from '../Shared/Header';

const ContactList = () => {
  const { contacts, addContact, deleteContact } = useContact();
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    cpf: '',
    phone: '',
    cep: '',
    address: '',
  });
  const [error, setError] = useState('');

  // Função para abrir e fechar o modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewContact({ name: '', cpf: '', phone: '', cep: '', address: '' }); // Limpa o formulário
    setError(''); // Limpa erros
  };

  // Função para salvar o novo contato
  const handleAddContact = () => {
    if (!newContact.name || !newContact.cpf || !newContact.phone || !newContact.address) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    // Validação de CPF duplicado
    const isDuplicateCPF = contacts.some((contact) => contact.cpf === newContact.cpf);
    if (isDuplicateCPF) {
      setError('Já existe um contato com este CPF.');
      return;
    }

    addContact(newContact);
    handleCloseModal();
  };

  // Filtrar contatos com base no texto digitado
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(search.toLowerCase()) || contact.cpf.includes(search)
  );

  return (
    <>
      <Header />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Lista de contatos */}
        <Box
          sx={{
            width: '30%',
            padding: 2,
            backgroundColor: 'background.default',
            overflowY: 'auto',
            borderRight: '1px solid #ccc',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Contatos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mb: 2 }}
            onClick={handleOpenModal}
          >
            Adicionar Novo Contato
          </Button>
          <TextField
            label="Pesquisar por Nome ou CPF"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 2 }}
          />
          {/* Verificar se há contatos encontrados */}
          {filteredContacts.length > 0 ? (
            <List>
              {filteredContacts.map((contact, index) => (
                <ListItem
                  key={index}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 1,
                    mb: 1,
                    boxShadow: 1,
                  }}
                >
                  <ListItemText
                    primary={contact.name}
                    secondary={`CPF: ${contact.cpf} | Telefone: ${contact.phone}`}
                  />
                  <Button
                    color="error"
                    onClick={() => deleteContact(index)}
                    sx={{ ml: 2 }}
                  >
                    Excluir
                  </Button>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <SearchOff sx={{ fontSize: 60, color: 'gray' }} />
              <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
                Nenhum contato encontrado
              </Typography>
            </Box>
          )}
        </Box>

        {/* Mapa */}
        <Box sx={{ flex: 1 }}>Mapa vai aqui</Box>
      </Box>

      {/* Modal para Adicionar Novo Contato */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" mb={2}>
            Adicionar Novo Contato
          </Typography>
          <TextField
            label="Nome"
            fullWidth
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="CPF"
            fullWidth
            value={newContact.cpf}
            onChange={(e) => setNewContact({ ...newContact, cpf: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Telefone"
            fullWidth
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="CEP"
            fullWidth
            value={newContact.cep}
            onChange={(e) => setNewContact({ ...newContact, cep: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Endereço"
            fullWidth
            value={newContact.address}
            onChange={(e) => setNewContact({ ...newContact, address: e.target.value })}
            sx={{ mb: 2 }}
          />
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddContact}
          >
            Salvar Contato
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleCloseModal}
          >
            Cancelar
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ContactList;
