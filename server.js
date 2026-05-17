// src/server.js
require('dotenv').config();
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const app = require('./app'); // importamos la app configurada

const swaggerDocument = YAML.load('./docs/openapi.yaml');

const PORT = process.env.PORT || 3000;

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`Blog API escuchando en http://localhost:${PORT}`);
});