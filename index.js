import express from "express";
import cors from "cors";  // ✅ IMPORTA CORS
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors()); // ✅ HABILITA CORS

const SECRET_KEY = "secreto123"; // o tu clave JWT
const PORT = process.env.PORT || 4000; // ✅ PUERTO DINÁMICO

// "Base de datos" en memoria
const users = [];

app.use(cors());
app.use(bodyParser.json());

// Registro
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Usuario ya existe' });
  }
  users.push({ username, password });
  res.json({ message: 'Registrado correctamente' });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Middleware de autenticación
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    res.sendStatus(403);
  }
}

// Endpoint de chatbot (respuesta automática simulada)
app.post('/api/chat', auth, (req, res) => {
  const { message } = req.body;
  res.json({ reply: `Hola ${req.user.username}, me preguntaste: "${message}". ¡Esta es una respuesta automática de IA!` });
});

app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));