require('dotenv').config();
// OpenAI setup (versión 4.x o superior)
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors()); // habilita CORS

const SECRET_KEY = "secreto123";
const PORT = process.env.PORT || 4000; // puerto dinámico

// "Base de datos" en memoria
const users = [];

// Registro
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "Usuario ya existe" });
  }
  users.push({ username, password });
  res.json({ message: "Registrado correctamente" });
});

// Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// Chatbot simple
app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "No enviaste ningún mensaje." });
  }
  (async () => {
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Eres Erudito_IA, un asistente experto en educación y tecnología." },
          { role: "user", content: message }
        ]
      });
      const reply = completion.data.choices[0].message.content;
      res.json({ reply });
    } catch (err) {
      res.json({ reply: "Error al conectar con OpenAI: " + err.message });
    }
  })();
});

app.listen(PORT, () =>
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`)
);