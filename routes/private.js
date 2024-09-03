import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/listar-usuarios', async (req, res) => {
  try {
    const users = await prisma.user.findMany()

    res.status(200).json({ message: 'Usuários listados com sucesso', users })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Falha no servidor' })
  }
})

router.get('/dashboard', async (req, res) => {
  try {
    const users = await prisma.user.findMany()

    res.status(200).json({ message: 'Usuários listados com sucesso', users })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Falha no servidor' })
  }
})

router.get('/listar-dados', async (req, res) => {
  try {
    const data = await prisma.data.findMany()

    res.status(200).json({ data })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Falha no servidor' })
  }
})

export default router