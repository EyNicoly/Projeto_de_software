/**
 * UserProfile Component - Tela de Usuário Integrada
 * 
 * Adaptado do projeto TelaUsuarioTrainer para integração com TrainerBody
 * Design: Moderno Minimalista com Tailwind CSS
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserProfile.css';

// Componente Header
const Header = ({ onBackToDashboard, onLogout }) => {
  return (
    <header className="user-profile-header">
      <div className="user-profile-container">
        {/* Logo */}
        <div className="user-profile-logo">
          <div className="logo-icon">
            <i className="fas fa-dumbbell"></i>
          </div>
          <h1>TrainerBody</h1>
        </div>

        {/* Navigation */}
        <nav className="user-profile-nav">
          <button className="btn-secondary-profile" onClick={onBackToDashboard}>
            <i className="fas fa-arrow-left"></i>
            Voltar aos Treinos
          </button>
          <button className="btn-logout-profile" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
};

// Componente SectionCard
const SectionCard = ({ title, icon, children }) => {
  return (
    <div className="section-card">
      <div className="section-card-header">
        <div className="section-card-icon">{icon}</div>
        <h2>{title}</h2>
      </div>
      <div className="section-card-content">
        {children}
      </div>
    </div>
  );
};

// Componente QuestionnaireHistory
const QuestionnaireHistory = ({ onNewQuestionnaire }) => {
  // Buscar histórico do localStorage
  const userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
  const currentWorkout = JSON.parse(localStorage.getItem('currentWorkout') || 'null');
  
  const mockData = [];
  
  // Se houver treino gerado, adicionar ao histórico
  if (currentWorkout && currentWorkout.meta) {
    mockData.push({
      id: '1',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      trainingFocus: currentWorkout.meta.objetivo || 'Treino Personalizado',
    });
  }

  return (
    <SectionCard
      title="Histórico de Questionários"
      icon={<i className="fas fa-clipboard-check"></i>}
    >
      <div className="history-list">
        {mockData.length > 0 ? (
          mockData.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-item-content">
                <p className="history-item-title">{item.trainingFocus}</p>
                <p className="history-item-date">
                  {new Date(item.date).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="history-item-status">
                <span className="badge-success">
                  <i className="fas fa-check-circle"></i>
                  Completo
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state">
            Nenhum questionário realizado ainda.
          </p>
        )}
      </div>
      <button className="btn-primary-full" onClick={onNewQuestionnaire}>
        <i className="fas fa-plus"></i>
        Fazer Novo Questionário
      </button>
    </SectionCard>
  );
};

// Componente IMCHistory
const IMCHistory = () => {
  const imcResult = JSON.parse(localStorage.getItem('imcResult') || 'null');
  
  const mockData = [];
  
  if (imcResult && imcResult.imc) {
    mockData.push({
      id: '1',
      date: new Date().toISOString().split('T')[0],
      imc: imcResult.imc,
      classification: imcResult.classification,
    });
  }

  return (
    <SectionCard
      title="Histórico de IMC"
      icon={<i className="fas fa-chart-line"></i>}
    >
      <div className="history-list">
        {mockData.length > 0 ? (
          mockData.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-item-content">
                <p className="history-item-title">IMC: {item.imc}</p>
                <p className="history-item-date">
                  {new Date(item.date).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="history-item-status">
                <span className="badge-info">
                  {item.classification}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state">
            Nenhum cálculo de IMC realizado ainda.
          </p>
        )}
      </div>
    </SectionCard>
  );
};

// Componente LoginData
const LoginData = ({ onChangePassword, onLogout }) => {
  // Dados mockados - em produção, buscar do backend via API
  const mockUserData = {
    name: 'Usuário TrainerBody',
    email: localStorage.getItem('userEmail') || 'usuario@trainerbody.com',
    joinDate: '2025-01-15',
    lastLogin: new Date().toLocaleString('pt-BR'),
  };

  return (
    <SectionCard
      title="Dados de Login"
      icon={<i className="fas fa-user"></i>}
    >
      <div className="login-data-grid">
        {/* Name */}
        <div className="data-item">
          <div className="data-item-icon">
            <i className="fas fa-user"></i>
          </div>
          <div>
            <p className="data-item-label">Nome</p>
            <p className="data-item-value">{mockUserData.name}</p>
          </div>
        </div>

        {/* Email */}
        <div className="data-item">
          <div className="data-item-icon">
            <i className="fas fa-envelope"></i>
          </div>
          <div>
            <p className="data-item-label">Email</p>
            <p className="data-item-value">{mockUserData.email}</p>
          </div>
        </div>

        {/* Join Date */}
        <div className="data-item">
          <div className="data-item-icon">
            <i className="fas fa-calendar"></i>
          </div>
          <div>
            <p className="data-item-label">Data de Cadastro</p>
            <p className="data-item-value">
              {new Date(mockUserData.joinDate).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Last Login */}
        <div className="data-item">
          <div className="data-item-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div>
            <p className="data-item-label">Último Acesso</p>
            <p className="data-item-value">{mockUserData.lastLogin}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="login-data-actions">
        <button className="btn-primary-profile" onClick={onChangePassword}>
          <i className="fas fa-key"></i>
          Alterar Senha
        </button>
        <button className="btn-secondary-profile" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i>
          Sair da Conta
        </button>
      </div>
    </SectionCard>
  );
};

// Componente Principal UserProfile
export default function UserProfile() {
  const navigate = useNavigate();

  // Verificar autenticação
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair?')) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const handleNewQuestionnaire = () => {
    // Voltar para dashboard e abrir questionário
    localStorage.setItem('activeSection', 'questionnaire');
    navigate('/dashboard');
  };

  const handleChangePassword = () => {
    alert('Funcionalidade de alteração de senha em desenvolvimento.');
  };

  return (
    <div className="user-profile-page">
      {/* Header */}
      <Header 
        onBackToDashboard={handleBackToDashboard}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="user-profile-main">
        <div className="user-profile-grid">
          {/* Left Column - Questionnaire and IMC */}
          <div className="user-profile-left">
            <QuestionnaireHistory onNewQuestionnaire={handleNewQuestionnaire} />
            <IMCHistory />
          </div>

          {/* Right Column - Login Data */}
          <div className="user-profile-right">
            <LoginData 
              onChangePassword={handleChangePassword}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
