import jwt from 'jsonwebtoken';

// Assegura que o segredo JWT está definido
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não está definido nas variáveis de ambiente.");
}

const auth = (req, res, next) => {
  // Verifica se o cookie com o token JWT está presente
  const token = req.cookies.token; // Busca o token no cookie

  // Se o token não estiver presente, bloqueia o acesso
  if (!token) {
    return res.status(401).json({ message: 'Acesso Negado. Token não fornecido.' });
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Armazena o ID do usuário no objeto `req` para uso posterior
    req.userId = decoded.id;

    // Prossegue para o próximo middleware
    next();
  } catch (err) {
    // Lida com o erro de token inválido ou expirado
    return res.status(401).json({ message: 'Token inválido ou expirado.', error: err.message });
  }
};

export default auth;
