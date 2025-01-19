import React, { useState } from 'react';
import { Box, Button, Typography, TextField, List, ListItem, ListItemText, Modal } from '@mui/material';
import { useContact } from '../../context/ContactContext';
import { SearchOff } from '@mui/icons-material';
import Header from '../Shared/Header';
import axios from 'axios';
import { Person } from '@mui/icons-material';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const ContactList = ({ google }) => {
  const { contacts, addContact, deleteContact } = useContact();
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newContact, setNewContact] = useState({
    name: '',
    cpf: '',
    phone: '',
    cep: '',
    address: '',
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState('');
  const [cepWarning, setCepWarning] = useState('');

  // Função para excluir a conta do usuário
  const handleDeleteAccount = () => {
    const confirmation = window.confirm(
      'Tem certeza de que deseja excluir sua conta? Todos os contatos serão removidos.'
    );
    if (confirmation) {
      localStorage.clear(); // Remove todos os dados do localStorage (simulando a exclusão da conta)
      alert('Sua conta foi excluída com sucesso.');
      window.location.reload(); // Recarrega a página para limpar o estado
    }
  };

  // Função para abrir e fechar o modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewContact({ name: '', cpf: '', phone: '', cep: '', address: '' });
    setError('');
    setCepWarning('');
  };

  // Validação de Nome
  const validateName = (name) => {
    if (name.length < 4) {
      setError('O nome deve ter pelo menos 4 caracteres.');
      return false;
    }
    setError('');
    return true;
  };

  // Validação de CPF
  const validateCPF = (cpf) => {
    if (cpf.length < 10) {
      setError('O CPF deve ter pelo menos 11 caracteres.');
      return false;
    }
    setError('');
    return true;
  };

  // Função para carregar o CEP do ViaCEP
  const handleCEPChange = async (cep) => {
    setNewContact({ ...newContact, cep });
    setCepWarning('');
    if (cep.length < 8) {
      setCepWarning('O CEP deve ter 8 caracteres.');
      return;
    }
    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (data.erro) {
        setCepWarning('CEP inválido. Verifique e tente novamente.');
        return;
      }
      setNewContact((prev) => ({
        ...prev,
        address: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`,
      }));
      setCepWarning('');
    } catch (err) {
      setCepWarning('Erro ao buscar o CEP. Tente novamente.');
    }
  };

  // Salvar Novo Contato
  const handleAddContact = async () => {
    if (!newContact.name || !newContact.cpf || !newContact.phone || !newContact.address) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!validateName(newContact.name)) {
      return;
    }

    if (!validateCPF(newContact.cpf)) {
      return;
    }

    // Verificar CPF duplicado
    const isDuplicateCPF = contacts.some((contact) => contact.cpf === newContact.cpf);
    if (isDuplicateCPF) {
      setError('Já existe um contato com este CPF.');
      return;
    }
    try {
      // Obter latitude e longitude do endereço
      const { data } = await axios.get('https://api.positionstack.com/v1/forward', {
        params: {
          access_key: '0f5fdbd711e9fe46085d4b0c239ec384',
          query: newContact.address,
        },
      });
      if (data.data && data.data.length > 0) {
        const { latitude, longitude } = data.data[0];
        addContact({ ...newContact, latitude, longitude });
        handleCloseModal();
      } else {
        setError('Erro ao buscar coordenadas. Verifique o endereço.');
      }
    } catch (err) {
      setError('Erro ao buscar coordenadas para o endereço.');
    }
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
            backgroundColor: 'background.box',
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
              {filteredContacts.map((contact, index) => (<ListItem
                key={index}
                sx={{
                  backgroundColor: 'background.default',
                  borderRadius: 1,
                  mb: 1,
                  boxShadow: 1,
                }}
                onClick={() => setSelectedContact(contact)} // Define o contato selecionado para o mapa
              >
                <Person sx={{ color: 'primary.main', mr: 2 }} /> {/* Ícone de pessoa */}
                <ListItemText
                  primary={
                    <Typography variant="h6" component="span">
                      {contact.name}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        <strong>CPF:</strong> {contact.cpf} | <strong>Telefone:</strong> {contact.phone}
                      </Typography>
                      <br />
                      <Typography variant="body2" component="span">
                        <strong>Endereço:</strong> {contact.address}
                      </Typography>
                      <br />
                      <Typography variant="body2" component="span" color="textSecondary">
                        <strong>Lat:</strong> {contact.latitude?.toFixed(6)} | <strong>Long:</strong>{' '}
                        {contact.longitude?.toFixed(6)}
                      </Typography>
                    </>
                  }
                />
                <Button
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation(); // Impede que clique no botão afete o mapa
                    deleteContact(index);
                  }}
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

          

      {/* Botão Minha Conta */}
      <Box sx={{ padding: 2, textAlign: 'center' }}>
        <Button variant="outlined" color="error" onClick={handleDeleteAccount}>
          Deletar Minha Conta
        </Button>
      </Box>
      
        </Box>

        {/* Mapa */}
        <Box sx={{ flex: 1 }}>
          {selectedContact ? (
            <Map
              google={google}
              zoom={15}
              style={{ width: '100%', height: '100%' }}
              center={{
                lat: selectedContact.latitude || -27.5954,
                lng: selectedContact.longitude || -48.548,
              }}
            >
              <Marker
                position={{
                  lat: selectedContact.latitude || -27.5954,
                  lng: selectedContact.longitude || -48.548,
                }}
                title={selectedContact.name}
              />
            </Map>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                backgroundColor: 'background.default',
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Selecione um contato para visualizar no mapa
              </Typography>
            </Box>
          )}
        </Box>

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
            required
          />
          <TextField
            label="CPF"
            fullWidth
            value={newContact.cpf}
            onChange={(e) => setNewContact({ ...newContact, cpf: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Telefone"
            fullWidth
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="CEP"
            fullWidth
            value={newContact.cep}
            onChange={(e) => handleCEPChange(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Endereço"
            fullWidth
            value={newContact.address}
            onChange={(e) => setNewContact({ ...newContact, address: e.target.value })}
            sx={{ mb: 2 }}
            disabled // Campo desabilitado, preenchido automaticamente
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

export default GoogleApiWrapper({
  apiKey: 'AIzaSyACqcDxAZAlrPqnJ3cl3LHxzleCFFe9h4s',
})(ContactList);
