import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middlewares/auth.js'; // Middleware de autenticação

const router = express.Router();
const prisma = new PrismaClient();

router.get('/auth/check', auth, (req, res) => {
  // Se o middleware `auth` passou, significa que o token é válido
  res.status(200).json({ message: 'Autenticado', userId: req.userId });
});

// Rota para listar usuários - sem autenticação
router.get('/listar-usuarios', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ message: 'Usuários listados com sucesso', users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Falha no servidor' });
  }
});

// Rota para dashboard - autenticada
router.get('/dashboard', auth, async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ message: 'Usuários listados com sucesso', users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Falha no servidor' });
  }
});

// Rota para listar dados - autenticada
router.get('/listar-dados', auth, async (req, res) => {
  try {
    const data = await prisma.data.findMany();
    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Falha no servidor' });
  }
});

// Rota para inserir dados - autenticada
router.post('/inserir-dados', auth, async (req, res) => {
  const { acertos, banco, comissao, proposta } = req.body;

  try {
    const dataDB = await prisma.data.create({
      data: {
        acertos,
        banco,
        comissao,
        proposta,
      },
    });
    res.status(201).json(dataDB);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no Servidor, tente novamente' });
  }
});

// Rota para obter todas as tabulações - autenticada
router.get('/tabulacao', auth, async (req, res) => {
  try {
    const data = await prisma.tabulacao.findMany();
    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Falha no servidor' });
  }
});

// Rota para obter uma tabulação pelo ID - autenticada
router.get('/tabulacao/id/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const data = await prisma.tabulacao.findUnique({
      where: { id: parseInt(id) },
    });

    if (data) {
      res.status(200).json({ data });
    } else {
      res.status(404).json({ message: 'Tabulação não encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Falha no servidor' });
  }
});

// Rota para obter tabulações de um usuário - autenticada
router.get('/tabulacao/usuario/:usuarioId', auth, async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const tabulacoes = await prisma.tabulacao.findMany({
      where: { usuarioId: parseInt(usuarioId) },
    });

    if (tabulacoes.length > 0) {
      res.status(200).json({ data: tabulacoes });
    } else {
      res.status(404).json({ message: 'Nenhuma tabulação encontrada para esse usuário' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Falha no servidor' });
  }
});

// Rota para criar uma nova tabulação - autenticada
router.post('/tabulacao', auth, async (req, res) => {
  const { usuarioId, data, codigo, descricao } = req.body;

  try {
    const novaTabulacao = await prisma.tabulacao.create({
      data: {
        usuarioId,
        data: new Date(data), // Certifique-se de que a data está no formato ISO
        codigo,
        descricao,
      },
    });

    res.status(201).json(novaTabulacao);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar a tabulação' });
  }
});

// Rota para deletar uma tabulação - autenticada
router.delete('/tabulacao/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const tabulacao = await prisma.tabulacao.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ message: 'Tabulação deletada com sucesso', tabulacao });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Tabulação não encontrada' });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Erro ao deletar a tabulação' });
    }
  }
});

// Rota para atualizar uma tabulação - autenticada
router.patch('/tabulacao/:id', auth, async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
    }

    const updatedTabulacao = await prisma.tabulacao.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
    });

    res.json({ message: 'Tabulação atualizada com sucesso', tabulacao: updatedTabulacao });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Tabulação não encontrada' });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar a tabulação' });
    }
  }
});

// Rota para obter reembolsos - autenticada
router.get('/reembolso', auth, async (req, res) => {
  try {
    const data = await prisma.reembolso.findMany();
    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Falha no servidor' });
  }
});

router.post('/reembolso', auth, async (req, res) => {
  const { usuario_solicitante, dataInicio, dataFim, tipoRota, observacao, valor } = req.body;

  // Validação dos dados recebidos
  if (!usuario_solicitante || !dataInicio || !dataFim || !tipoRota) {
    return res.status(400).json({ message: 'Dados obrigatórios não fornecidos.' });
  }

  try {
    // Converter as strings de data para objetos Date
    const startDate = new Date(dataInicio);
    const endDate = new Date(dataFim);

    // Verificar se as datas são válidas
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Datas inválidas fornecidas.' });
    }

    // Criar uma nova entrada no banco de dados
    const newReembolso = await prisma.reembolso.create({
      data: {
        usuario_solicitante,
        data_incio: startDate, // Passar a data como objeto Date
        data_fim: endDate,     // Passar a data como objeto Date
        tipo_rota: tipoRota,
        obs: observacao,
        status: 'Pendente', // Definindo um status padrão, pode ser alterado conforme necessário
        valor: valor, // Inicializando valor como 0 ou pode ser alterado conforme necessário
        data_aprovacao_regional: null, // Inicializando como null
        data_aprovacao_financeiro: null, // Inicializando como null
        data_credito: null, // Inicializando como null
      },
    });

    res.status(201).json({ message: 'Reembolso criado com sucesso', data: newReembolso });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Falha ao criar o reembolso' });
  }
});

// Rota de logout
router.post('/logout', (req, res) => {
  // Limpa o cookie de autenticação
  res.clearCookie('token', {
    httpOnly: true, // Garante que o cookie não pode ser acessado via JavaScript
    secure: process.env.NODE_ENV === 'production', // Define o cookie como seguro em produção
    sameSite: 'strict', // Protege contra CSRF
  });

  // Se houver informações de sessão, limpe também (caso esteja usando sessões)
  // req.session.destroy(err => {
  //   if (err) {
  //     return res.status(500).json({ message: 'Erro ao encerrar a sessão' });
  //   }
  // });

  return res.status(200).json({ message: 'Logout bem-sucedido' });
});

export default router;
