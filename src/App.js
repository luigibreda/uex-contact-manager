import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './styles/theme';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import ContactList from './components/Contact/ContactList';
import '@fontsource/poppins';

// Rota protegida
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

// Rota pública
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/contacts" /> : children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Página inicial - Login (rota pública) */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* Cadastro (rota pública) */}
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />

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
    </ThemeProvider>
  );
}

export default App;
