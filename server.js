import express from 'express';
import publicRoutes from './routes/public.js';
import privateRoutes from './routes/private.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import auth from './middlewares/auth.js'; // Middleware de autenticação

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: ['http://172.25.10.4:3960','http://191.233.254.11:3960','http://localhost:5173'],  // Frontend permitido
  credentials: false, // Permitir envio de credenciais (cookies, headers de autenticação)
};

// Middleware de parse de JSON e cookies
app.use(express.json());
app.use(cors(corsOptions)); // Configuração do CORS com cookies
app.use(cookieParser()); // Middleware para cookies

// Rotas públicas
app.use('/', publicRoutes);

// Rotas privadas (uso do middleware de autenticação)
app.use('/', auth, privateRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

// Inicializa o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor Rodando 🚀 na porta 3000');
});
