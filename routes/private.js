import express from 'express'
import { PrismaClient } from '@prisma/client'
// import { data } from "autoprefixer"

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

router.post('/inserir-dados', async (req, res) => {
  try {
    const data = req.body

    

    const dataDB = await prisma.data.create({
      data: {
        acertos: data.acertos,
        banco: data.banco,
        comissao: data.comissao,
        proposta: data.proposta,
      }
    })
    res.status(201).json(dataDB)
  } catch (err) {
    res.status(500).json({ message: 'Erro no Servidor, tente novamente' })
  }
})

router.get('/tabulacao', async (req, res) => {
  try {
    const data = await prisma.tabulacao.findMany()

    res.status(200).json({ data })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Falha no servidor' })
  }
})

// router.post('/inserir-tabulacao', async (req, res) => {
//   try {
//     const data = req.body

    

//     const dataDB = await prisma.tabulacao.create({
//       data: {
//         data: data.data,
//         descricao: data.descricao,
//         codigo: data.codigo,
//         usuarioId: data.usuarioId
//       }
//     })
//     res.status(201).json(dataDB)
//   } catch (err) {
//     res.status(500).json({ message: 'Erro no Servidor, tente novamente' })
//   }
// })






export default router