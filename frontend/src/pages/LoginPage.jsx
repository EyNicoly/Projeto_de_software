import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import '../styles/LoginPage.css';
import gymImage from '../assets/Gymnastic-bro.svg';

const LoginPage = () => {
  const [activeForm, setActiveForm] = useState('login');
  const navigate = useNavigate();

  // Estados para o formulário de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [loginError, setLoginError] = useState('');

  // Estados para o formulário de Registro
  const [regNome, setRegNome] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSenha, setRegSenha] = useState('');
  const [regConfirmaSenha, setRegConfirmaSenha] = useState('');
  const [registerError, setRegisterError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // --- LOGIN COM RESET ---
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginEmail.trim() === '' || loginSenha.trim() === '') {
      return setLoginError("Preencha todos os campos");
    }
    setLoginError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email: loginEmail,
        password: loginSenha,
      });

      // 🔥 RESET TOTAL: Apaga TUDO do localStorage
      localStorage.clear();
      
      // Salva o email para exibição na tela de perfil
      localStorage.setItem('userEmail', loginEmail);

      // Salva o novo token do usuário atual
      const { token } = response.data;
      localStorage.setItem('token', token);

      // Vai para o dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('Erro no login:', error.response ? error.response.data : error.message);
      setLoginError(error.response ? error.response.data.message : 'Erro ao conectar ao servidor');
    }
  };

  // --- REGISTRO ---
  const handleRegister = async (e) => {
    e.preventDefault();
    if (regNome.trim() === '' || regEmail.trim() === '' || regSenha.trim() === '' || regConfirmaSenha.trim() === '') {
      return setRegisterError("Todos os campos são obrigatórios");
    }
    if (!validateEmail(regEmail)) {
      return setRegisterError("Digite um e-mail válido");
    }
    if (regSenha.length < 6) {
      return setRegisterError("A senha deve ter pelo menos 6 caracteres");
    }
    if (regSenha !== regConfirmaSenha) {
      return setRegisterError("As senhas não coincidem");
    }
    setRegisterError('');

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        email: regEmail,
        password: regSenha,
      });

      alert('Cadastro realizado com sucesso! Faça login.');
      setActiveForm('login');

    } catch (error) {
      console.error('Erro no cadastro:', error.response ? error.response.data : error.message);
      setRegisterError(error.response ? error.response.data.message : 'Erro ao conectar ao servidor');
    }
  };

  return (
    <div className="main-login">
      <div className="background-bubbles">
        <span></span><span></span><span></span><span></span><span></span>
      </div>

      <div className="left-login">
        <h1>FitPro<br />Monte Seu Treino!</h1>
        <img src={gymImage} className="left-login-image" alt="Gym" />
      </div>

      <div className="right-login">
        {activeForm === 'login' ? (
          <div className="card-login">
            <h1>LOGIN</h1>
            <form onSubmit={handleLogin}>
              <div className="textfield">
                <label htmlFor="login-email">E-mail</label>
                <input
                  type="email"
                  id="login-email"
                  placeholder="seu@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="textfield">
                <label htmlFor="login-senha">Senha</label>
                <input
                  type="password"
                  id="login-senha"
                  placeholder="Senha"
                  value={loginSenha}
                  onChange={(e) => setLoginSenha(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-login">Login</button>
              {loginError && <p className="error-message show">{loginError}</p>}
              <p className="switch-text">
                Não tem conta? <a href="#" onClick={(e) => { e.preventDefault(); setActiveForm('register'); }}>Criar conta</a>
              </p>
            </form>
          </div>
        ) : (
          <div className="card-login">
            <h1>CRIAR CONTA</h1>
            <form onSubmit={handleRegister}>
              <div className="textfield">
                <label htmlFor="reg-nome">Nome</label>
                <input
                  type="text"
                  id="reg-nome"
                  placeholder="Seu nome"
                  value={regNome}
                  onChange={(e) => setRegNome(e.target.value)}
                />
              </div>
              <div className="textfield">
                <label htmlFor="reg-email">E-mail</label>
                <input
                  type="email"
                  id="reg-email"
                  placeholder="Seu e-mail"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>
              <div className="textfield">
                <label htmlFor="reg-senha">Senha</label>
                <input
                  type="password"
                  id="reg-senha"
                  placeholder="Crie uma senha"
                  value={regSenha}
                  onChange={(e) => setRegSenha(e.target.value)}
                />
              </div>
              <div className="textfield">
                <label htmlFor="reg-confirma-senha">Confirmar Senha</label>
                <input
                  type="password"
                  id="reg-confirma-senha"
                  placeholder="Confirme sua senha"
                  value={regConfirmaSenha}
                  onChange={(e) => setRegConfirmaSenha(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-login">Cadastrar</button>
              {registerError && <p className="error-message show">{registerError}</p>}
              <p className="switch-text">
                Já tem conta? <a href="#" onClick={(e) => { e.preventDefault(); setActiveForm('login'); }}>Entrar</a>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
