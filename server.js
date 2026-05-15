// src/server.js
require('dotenv').config();
const app = require('./app'); // importamos la app configurada

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Blog API escuchando en http://localhost:${PORT}`);
});