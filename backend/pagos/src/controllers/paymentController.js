const { registerPayment, getUserPayments } = require('../models/paymentModel');
const { updateAmortizationTable } = require('../../../prestamos/src/models/loanModel');
const axios = require('axios');

const processPayment = async (req, res) => {
    const usuarioId = req.user.id;
    const { prestamoId, monto } = req.body;

    try {
        // Verificar si el préstamo pertenece al usuario
        const loanResponse = await axios.get(`http://localhost:3002/api/prestamos/${prestamoId}`, {
            headers: { Authorization: req.headers.authorization }
        });

        if (!loanResponse.data) {
            return res.status(404).json({ error: "Préstamo no encontrado o no te pertenece." });
        }

        // Convertir cuota_mensual a número
        const cuota = parseFloat(loanResponse.data.cuota_mensual);
        const montoRedondeado = parseFloat(monto);

        if (isNaN(cuota) || isNaN(montoRedondeado)) {
            return res.status(400).json({ error: "Error: Valores de cuota o monto no válidos." });
        }

        if (montoRedondeado.toFixed(2) !== cuota.toFixed(2)) {
            return res.status(400).json({ error: "El monto debe coincidir con la cuota mensual." });
        }

        // Registrar pago
        await registerPayment(usuarioId, prestamoId, montoRedondeado);

        // Actualizar estado en la tabla de amortización
        await updateAmortizationTable(prestamoId, montoRedondeado);

        res.status(200).json({ message: "Pago realizado con éxito." });
    } catch (error) {
        console.error("❌ Error al procesar el pago:", error.message);
        res.status(500).json({ error: "Error en el servidor." });
    }
};


const getAllPaymentsHistory = async (req, res) => {
    if (req.user.rol !== "administrador") {
        return res.status(403).json({ error: "Solo los administradores pueden ver el historial de pagos." });
    }

    try {
        const payments = await getUserPayments();
        res.status(200).json(payments);
    } catch (error) {
        console.error("❌ Error al obtener historial de pagos:", error.message);
        res.status(500).json({ error: "Error en el servidor." });
    }
};

module.exports = { processPayment, getAllPaymentsHistory };
