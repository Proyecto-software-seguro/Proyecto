// src/routes/userRoutes.js

const express = require('express');
const { 
    registerUser, 
    loginUser, 
    verifyUser, 
    getUserProfile, 
    createFinancialData, 
    addCreditHistory 
} = require('../controllers/userController');

const authenticate = require('../middlewares/authenticate');

const router = express.Router();

// ==========================
// RUTAS DE CLIENTES
// ==========================
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify', verifyUser);  // Nueva ruta de verificación
router.get('/perfil', authenticate, getUserProfile);

// ==========================
// RUTAS DE ADMINISTRADORES
// ==========================
router.post('/financiero', authenticate, createFinancialData);
router.post('/crediticio', authenticate, addCreditHistory);

module.exports = router;
