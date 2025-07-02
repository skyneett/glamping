// Servidor Express básico para exponer los archivos JSON como una API REST
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Utilidad para leer y escribir archivos JSON
function readJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data', file), 'utf8'));
}
function writeJSON(file, data) {
  fs.writeFileSync(path.join(__dirname, '../src/data', file), JSON.stringify(data, null, 2));
}

// Endpoints para clientes
app.get('/clientes', (req, res) => {
  res.json(readJSON('clientes.json'));
});
app.post('/clientes', (req, res) => {
  const clientes = readJSON('clientes.json');
  clientes.push(req.body);
  writeJSON('clientes.json', clientes);
  res.status(201).json(req.body);
});

// Endpoints para glampings
app.get('/glampings', (req, res) => {
  res.json(readJSON('glampings.json'));
});
app.post('/glampings', (req, res) => {
  const glampings = readJSON('glampings.json');
  glampings.push(req.body);
  writeJSON('glampings.json', glampings);
  res.status(201).json(req.body);
});

// Endpoints para reservas
app.get('/reservas', (req, res) => {
  res.json(readJSON('reservas.json'));
});
app.post('/reservas', (req, res) => {
  const reservas = readJSON('reservas.json');
  reservas.push(req.body);
  writeJSON('reservas.json', reservas);
  res.status(201).json(req.body);
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
