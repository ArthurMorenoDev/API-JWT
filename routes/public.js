import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

// Cadastro

router.post('/cadastro', async (req, res) => {
  try {
    const { name, email, departament, password } = req.body;

    // Verifica se todos os campos obrigatórios estão presentes
    if (!name || !email || !departament || !password) {
      return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
    }

    // Verifica se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    // Cria o hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Salva o usuário no banco de dados
    const userDB = await prisma.user.create({
      data: {
        name,
        email,
        departament,
        password: hashPassword,
      },
    });

    res.status(201).json(userDB);
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err); // Log do erro no servidor
    res.status(500).json({ message: 'Erro no servidor, tente novamente mais tarde.' });
  }
});


// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se o email e a senha foram fornecidos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Busca o usuário no banco de dados pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Verifica se o usuário existe
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Compara a senha fornecida com a senha armazenada no banco
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha inválida' });
    }

    // Gera o Token JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

    // Busca os detalhes completos do usuário, incluindo tabulações
    const userById = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        departament: true,
        tabulacoes: true, // Assumindo que a tabela de tabulações tem uma relação com o usuário
      },
    });

    // Envia os dados de forma estruturada para o frontend, junto com o token
    return res.status(200).json({
      token, // Token JWT
      user: {
        id: userById.id,
        name: userById.name,
        email: userById.email,
        departament: userById.departament,
        tabulacoes: userById.tabulacoes, // Inclui as tabulações
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ message: 'Erro no Servidor, tente novamente' });
  }
});

export default router
