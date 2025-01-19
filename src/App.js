import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import ContactList from './components/Contact/ContactList';

// Rota protegida
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Página inicial - Login */}
          <Route path="/" element={<Login />} />

          {/* Cadastro */}
          <Route path="/signup" element={<SignUp />} />

          {/* Lista de contatos */}
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <ContactList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
