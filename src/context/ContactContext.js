import React, { createContext, useState, useContext, useEffect } from 'react';

const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);

  // Carregar contatos do localStorage ao inicializar
  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    setContacts(storedContacts);
  }, []);

  // Salvar contatos no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (newContact) => {
    setContacts((prevContacts) => [...prevContacts, newContact]);
  };

  const editContact = (updatedContact) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.cpf === updatedContact.cpf ? updatedContact : contact
      )
    );
  };

  const deleteContact = (index) => {
    const confirmation = window.confirm(
      'Tem certeza de que deseja excluir o contato?'
    );
    if (confirmation) {
      setContacts((prevContacts) => prevContacts.filter((_, i) => i !== index));
      alert('Seu contato foi excluída com sucesso.');
      // window.location.reload(); // Recarrega a página para limpar o estado
    }
  };

  return (
    <ContactContext.Provider value={{ contacts, addContact, editContact, deleteContact }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => useContext(ContactContext);
