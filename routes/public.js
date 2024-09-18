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
    const userInfo = req.body

    // Busca o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { email: userInfo.email },
    })

    // Verifica se o usuário existe dentro do banco
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    // Compara a senha do banco com a que o usuário digitou
    const isMatch = await bcrypt.compare(userInfo.password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Senha inválida' })
    }

    // Gerar o Token JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' })

    // Buscar o usuário pelo ID novamente para obter todos os detalhes
    const userById = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        departament: true,
        tabulacoes: true,
      },
    })

    res.status(200).json({ token, user: userById })
  } catch (err) {
    res.status(500).json({ message: 'Erro no Servidor, tente novamente' })
  }
})

export default router
