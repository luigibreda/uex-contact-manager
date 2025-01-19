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

  const editContact = (index, updatedContact) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact, i) => (i === index ? updatedContact : contact))
    );
  };

  const deleteContact = (index) => {
    setContacts((prevContacts) => prevContacts.filter((_, i) => i !== index));
  };

  return (
    <ContactContext.Provider value={{ contacts, addContact, editContact, deleteContact }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => useContext(ContactContext);
