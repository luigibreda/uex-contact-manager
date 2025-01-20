import React, { useState } from 'react';
import { Box, Button, Typography, TextField, List, ListItem, ListItemText, Modal } from '@mui/material';
import { useContact } from '../../context/ContactContext';
import { SearchOff, Edit, Delete } from '@mui/icons-material';
import Header from '../Shared/Header';
import axios from 'axios';
import { Person } from '@mui/icons-material';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const ContactList = ({ google }) => {
  const { contacts, addContact, deleteContact, editContact } = useContact(); // Adicionado updateContact
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Controla o estado de edição
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentContact, setCurrentContact] = useState(null); // Dados do contato em edição
  const [error, setError] = useState('');
  const [cepWarning, setCepWarning] = useState('');

  // Função para abrir o modal para adição ou edição
  const handleOpenModal = (contact = null) => {
    setCurrentContact(
      contact || {
        name: '',
        cpf: '',
        phone: '',
        cep: '',
        address: '',
        latitude: null,
        longitude: null,
      }
    );
    setIsEditing(!!contact); // Define se está em modo de edição
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentContact(null);
    setError('');
    setCepWarning('');
  };

  // Função para carregar o CEP do ViaCEP
  const handleCEPChange = async (cep) => {
    setCurrentContact({ ...currentContact, cep });
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
      setCurrentContact((prev) => ({
        ...prev,
        address: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`,
      }));
      setCepWarning('');
    } catch (err) {
      setCepWarning('Erro ao buscar o CEP. Tente novamente.');
    }
  };

  // Salvar ou editar contato
  const handleSaveContact = async () => {
    if (!currentContact.name || !currentContact.cpf || !currentContact.phone || !currentContact.address) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // Obter latitude e longitude do endereço
      const { data } = await axios.get('https://api.positionstack.com/v1/forward', {
        params: {
          access_key: '0f5fdbd711e9fe46085d4b0c239ec384',
          query: currentContact.address,
        },
      });

      let latitude = null;
      let longitude = null;

      if (data?.data && data.data.length > 0) {
        latitude = data.data[0].latitude;
        longitude = data.data[0].longitude;
      } else {
        setError('Coordenadas não encontradas para o endereço. O contato será salvo sem localização.');
      }

      if (isEditing) {
        editContact({ ...currentContact, latitude, longitude });
      } else {
        addContact({ ...currentContact, latitude, longitude });
      }

      handleCloseModal();
    } catch (err) {
      setError('Erro ao buscar coordenadas para o endereço. Verifique sua conexão ou tente novamente.');
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
            onClick={() => handleOpenModal()}
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
                    backgroundColor: 'background.default',
                    borderRadius: 1,
                    mb: 1,
                    boxShadow: 1,
                  }}
                >
                  <Person sx={{ color: 'primary.main', mr: 2 }} />
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
                      </>
                    }
                  />

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      color="primary"
                      onClick={() => handleOpenModal(contact)} 
                      sx={{ minWidth: 'auto', padding: 1 }}
                    >
                      <Edit sx={{ color: 'primary.main' }} />
                    </Button>
                    <Button
                      color="error"
                      onClick={() => deleteContact(index)} 
                      sx={{ minWidth: 'auto', padding: 1 }}
                    >
                      <Delete sx={{ color: 'error.main' }} />
                    </Button>
                  </Box>
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
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Selecione um contato para visualizar no mapa
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Modal de Adicionar/Editar Contato */}
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
            {isEditing ? 'Editar Contato' : 'Adicionar Novo Contato'}
          </Typography>
          <TextField
            label="Nome"
            fullWidth
            value={currentContact?.name || ''}
            onChange={(e) => setCurrentContact({ ...currentContact, name: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="CPF"
            fullWidth
            value={currentContact?.cpf || ''}
            onChange={(e) => setCurrentContact({ ...currentContact, cpf: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Telefone"
            fullWidth
            value={currentContact?.phone || ''}
            onChange={(e) => setCurrentContact({ ...currentContact, phone: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="CEP"
            fullWidth
            value={currentContact?.cep || ''}
            onChange={(e) => handleCEPChange(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Endereço"
            fullWidth
            value={currentContact?.address || ''}
            sx={{ mb: 2 }}
            disabled
          />
          {cepWarning && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {cepWarning}
            </Typography>
          )}
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSaveContact}
          >
            {isEditing ? 'Salvar Alterações' : 'Salvar Contato'}
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
  apiKey: 'AIzaSyAygWrPYHFVzL0zblaZPkRcgIFZkBNAW9g',
})(ContactList);
