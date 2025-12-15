import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TrainerBody from './pages/TrainerBody';
import UserProfile from './pages/UserProfile'; // Importar a nova tela
import './App.css';

/**
 * App Component - TrainerBody Integrado
 * 
 * Fluxo de Navegação:
 * 1. / (Login) → /dashboard (Tela Inicial com Treinos)
 * 2. /dashboard → /profile (Tela de Usuário)
 * 3. /profile → /dashboard (Voltar aos Treinos)
 * 
 * Proteção de Rotas:
 * - Rotas /dashboard e /profile requerem autenticação
 * - Usuário não autenticado é redirecionado para /
 */

// Componente de Proteção de Rota
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota de Login */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Rota da Tela Inicial (Dashboard de Treinos) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <TrainerBody />
            </ProtectedRoute>
          } 
        />
        
        {/* Rota da Tela de Usuário (Perfil) */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Rota padrão - redireciona para login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
