import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import ContactList from './components/Contact/ContactList';

function App() {
  return (
    <Router>
      <Routes>
        {/* Página inicial - Login */}
        <Route path="/" element={<Login />} />

        {/* Cadastro */}
        <Route path="/signup" element={<SignUp />} />

        {/* Lista de contatos */}
        <Route path="/contacts" element={<ContactList />} />
      </Routes>
    </Router>
  );
}

export default App;
