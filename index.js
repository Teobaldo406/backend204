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
  let reply = "No entendí tu pregunta.";
  if (!message) {
    return res.status(400).json({ reply: "No enviaste ningún mensaje." });
  }
  const msg = message.toLowerCase();
  if (msg.includes("hora")) {
    reply = `La hora actual es ${new Date().toLocaleTimeString()}`;
  } else if (msg.includes("nombre")) {
    reply = "Mi nombre es Erudito_IA.";
  } else if (msg.includes("hola")) {
    reply = "¡Hola! ¿En qué puedo ayudarte?";
  } else if (msg.includes("dominio")) {
    reply = "Mi dominio es Erudito, especializado en inteligencia artificial y asistencia educativa.";
  } else if (msg.includes("especialidad")) {
    reply = "Mi especialidad es ayudar con temas de educación y tecnología.";
  } else if (msg.includes("servicios")) {
    reply = "Ofrezco asistencia en tareas, explicaciones y consultas sobre tecnología y educación.";
  } else if (msg.includes("ia") || msg.includes("inteligencia artificial")) {
    reply = "La inteligencia artificial (IA) es la capacidad de una máquina para imitar la inteligencia humana. ¿Quieres saber más sobre IA?";
  }
  res.json({ reply });
});

app.listen(PORT, () =>
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`)
);