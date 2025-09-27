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

app.listen(PORT, () =>
  console.log('✅ Backend corriendo en http://localhost:${PORT}')
);