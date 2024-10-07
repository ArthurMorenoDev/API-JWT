import jwt from 'jsonwebtoken';

// Assegura que o segredo JWT está definido
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não está definido nas variáveis de ambiente.");
}

const auth = (req, res, next) => {
  try {
    // Verifica se o token está presente no localStorage (geralmente ele virá no cabeçalho)
    const token = req.headers.authorization?.split(' ')[1]; // Busca o token no header

    // Se o token não estiver presente, bloqueia o acesso
    if (!token) {
      return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    // Verifica e decodifica o token
    const decoded = (token, JWT_SECRET); // Certifique-se de que decoded está corretamente atribuído

    // Armazena o ID do usuário no objeto `req` para uso posterior
    req.userId = decoded.id;

    // Prossegue para o próximo middleware
    next();
  } catch (err) {
    // Lida com erros de token inválido ou expirado
    let errorMessage = 'Erro de autenticação.';

    if (err.name === 'TokenExpiredError') {
      errorMessage = 'Token expirado. Por favor, faça login novamente.';
    } else if (err.name === 'JsonWebTokenError') {
      errorMessage = 'Token inválido.';
    }

    // Opcional: logar o erro para monitoramento
    console.error(`Erro de autenticação: ${errorMessage}`, err);

    // Retorna uma resposta de erro ao cliente
    return res.status(401).json({ message: errorMessage, error: err.message });
  }
};

export default auth;
