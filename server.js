import express from 'express';
import publicRoutes from './routes/public.js';
import privateRoutes from './routes/private.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import auth from './middlewares/auth.js'; // Middleware de autenticação

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Frontend permitido
  credentials: true, // Permitir envio de credenciais (cookies, headers de autenticação)
};

// Middleware de parse de JSON e cookies
app.use(express.json());
app.use(cors(corsOptions)); // Configuração do CORS com cookies
app.use(cookieParser()); // Middleware para cookies

// Rotas públicas
app.use('/', publicRoutes);

// Rotas privadas (uso do middleware de autenticação)
app.use('/', auth, privateRoutes);

// Inicializa o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor Rodando 🚀 na porta 3000');
});
