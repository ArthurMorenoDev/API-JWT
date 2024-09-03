import jwt from 'jsonwebtoken';

// Assegure-se de que o segredo JWT está definido e não é vazio
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não está definido nas variáveis de ambiente.");
}

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se o cabeçalho de autorização está presente
  if (!authHeader) {
    return res.status(401).json({ message: 'Acesso Negado. Token não fornecido.' });
  }

  // Extrai o token do cabeçalho
  const token = authHeader.replace('Bearer ', '');

  try {
    // Verifica o token e decodifica
    const decoded = jwt.verify(token, JWT_SECRET);

    // Armazena o ID do usuário no objeto req para uso posterior
    req.userId = decoded.id;
    
    // Prossegue para o próximo middleware
    next();
  } catch (err) {
    // Lida com o erro do token inválido
    return res.status(401).json({ message: 'Token Inválido.', error: err.message });
  }
};

export default auth;
