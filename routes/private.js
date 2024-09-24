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

router.get('/tabulacao/id/:id', async (req, res) => {
  const { id } = req.params; // Obtém o ID da URL

  try {
    // Encontra o registro na tabela tabulacao com base no ID da tabulação
    const data = await prisma.tabulacao.findUnique({
      where: { id: parseInt(id) }, // Converte o ID para número
    });

    if (data) {
      res.status(200).json({ data }); // Se encontrado, retorna o dado
    } else {
      res.status(404).json({ message: 'Tabulação não encontrada' }); // Se não encontrado, retorna 404
    }
  } catch (err) {
    console.log(err); // Loga o erro para depuração
    res.status(500).json({ message: 'Falha no servidor' }); // Retorna um erro genérico de servidor
  }
});

router.get('/tabulacao/usuario/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params; // Obtém o usuarioId da URL

  try {
    // Encontra todos os registros na tabela 'tabulacao' com base no usuarioId
    const tabulacoes = await prisma.tabulacao.findMany({
      where: { usuarioId: parseInt(usuarioId) }, // Converte usuarioId para número
    });

    if (tabulacoes.length > 0) {
      res.status(200).json({ data: tabulacoes }); // Retorna as tabulações encontradas
    } else {
      res.status(404).json({ message: 'Nenhuma tabulação encontrada para esse usuário' }); // Retorna 404 se não encontrar
    }
  } catch (err) {
    console.log(err); // Loga o erro para depuração
    res.status(500).json({ message: 'Falha no servidor' }); // Retorna um erro genérico de servidor
  }
});

router.post('/tabulacao', async (req, res) => {
  const { usuarioId, data, codigo, descricao } = req.body;

  try {
    const novaTabulacao = await prisma.tabulacao.create({
      data: {
        usuarioId,
        data: new Date(data), // Certifique-se de que a data está no formato ISO
        codigo,
        descricao
      }
    });

    res.status(201).json(novaTabulacao);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar a tabulação' });
  }
});

router.delete('/tabulacao/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const tabulacao = await prisma.tabulacao.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ message: 'Tabulação deletada com sucesso', tabulacao });

  } catch (error) {
    if (error.code === 'P2025') {
      // P2025 é o código de erro do Prisma para "Registro não encontrado"
      res.status(404).json({ error: 'Tabulação não encontrada' });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Erro ao deletar a tabulação' });
    }
  }
});

router.patch('/tabulacao/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body; 

  try {
    // Valida se o corpo da requisição contém algum dado para atualização
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
    }

    // Atualiza a tabulação com os dados fornecidos
    const updatedTabulacao = await prisma.tabulacao.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
    });

    res.json({ message: 'Tabulação atualizada com sucesso', tabulacao: updatedTabulacao });

  } catch (error) {
    if (error.code === 'P2025') {
      // P2025 é o código de erro do Prisma para "Registro não encontrado"
      res.status(404).json({ error: 'Tabulação não encontrada' });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar a tabulação' });
    }
  }
});


router.get('/reembolso', async (req, res) => {
  try {
    const data = await prisma.reembolso.findMany()

    res.status(200).json({ data })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Falha no servidor' })
  }
})



export default router