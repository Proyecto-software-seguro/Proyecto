require('dotenv').config();
const express = require('express');
const cors = require('cors');

const loanRoutes = require('./routes/loanRoutes');
const { connectDB } = require('../config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/prestamos', loanRoutes);

connectDB();

app.listen(3002, () => console.log('Microservicio de Préstamos en el puerto 3002'));
