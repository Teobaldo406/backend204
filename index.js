//carga varialbles de entorno
require('dotenv').config();
// OpenAI setup (versión 4.x o superior)
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose'); // 🔹 Importamos mongoose
const User = require("./models/user"); // Importamos el modelo User

// 🔹 Conectamos a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error al conectar con MongoDB:", err));

const app = express();
app.use(express.json());
app.use(cors()); // habilita CORS

const SECRET_KEY = "secreto123";
const PORT = process.env.PORT || 4000; // puerto dinámico

// Registro
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    // Crear nuevo usuario
    const newUser = new User({ username, password });
    await newUser.save();

    res.json({ message: "Registrado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Chatbot simple
app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "No enviaste ningún mensaje." });
  }
  (async () => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Eres Erudito_IA, un asistente experto en educación y tecnología." },
          { role: "user", content: message }
        ]
      });
      const reply = completion.choices[0].message.content;
      res.json({ reply });
    } catch (err) {
      res.json({ reply: "Error al conectar con OpenAI: " + err.message });
    }
  })();
});

app.listen(PORT, () =>
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`)
);