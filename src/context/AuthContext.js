import React, { createContext, useState, useContext } from 'react';

// Criação do contexto
const AuthContext = createContext();

// Provedor de Autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const register = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      return false; // Usuário já existe
    }

    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  // const deleteAccount = (password) => {
  //   if (password === user.password) {
  //     localStorage.removeItem('users');
  //     localStorage.removeItem(`contacts_${user.email}`);
  //     logout();
  //     return true;
  //   }
  //   return false;
  // };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
