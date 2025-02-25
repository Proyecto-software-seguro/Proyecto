require('dotenv').config();
const express = require('express');
const cors = require('cors');

const loanRoutes = require('./routes/loanRoutes');
const { connectDB } = require('../config/db');

const app = express();

const corsOptions = {
  origin: ['http://localhost:3001'], // Agrega los orígenes de confianza
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Especifica los métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Define los encabezados permitidos
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/prestamos', loanRoutes);

connectDB();

app.listen(3002, () => console.log('Microservicio de Préstamos en el puerto 3002'));
