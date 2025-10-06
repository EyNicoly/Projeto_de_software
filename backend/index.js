// backend/index.js

// Importações principais
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/.env' });


// Importações do Banco de Dados
const sequelize = require('./config/database');
const User = require('./models/User');

// Cria a aplicação Express
const app = express();
const PORT = process.env.PORT || 5000;

// Configuração de Middlewares
app.use(cors());
app.use(express.json());
//kdopdjpjdp


// Rota de Teste
app.get('/api', (req, res) => {
  res.json({ message: "API do Backend do site de treinos está no ar!" });
});

// Rota de Cadastro de Usuário
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, forneça email e senha.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Este email já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'Usuário criado com sucesso!', userId: newUser.id });

  } catch (error) {
    console.error('ERRO DETALHADO NO REGISTRO:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário.', error: error.message });
  }
});

// Rota de Login de Usuário (com JWT)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Por favor, forneça email e senha.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token }); 
      }
    );

  } catch (error) {
    console.error('ERRO DETALHADO NO LOGIN:', error);
    res.status(500).json({ message: 'Erro ao fazer login.', error: error.message });
  }
});

sequelize.sync().then(() => {
  console.log('Banco de dados conectado e modelos sincronizados.');
  app.listen(PORT, () => {
    console.log(`Servidor do backend rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao conectar ou sincronizar com o banco de dados:', err);
});