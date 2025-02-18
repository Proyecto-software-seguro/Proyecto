const { pool } = require('../../config/db');

const createLoan = async (usuarioId, monto, tasa, plazo, cuotaMensual, estado) => {
    const query = `
        INSERT INTO prestamos (usuario_id, monto, tasa, plazo, cuota_mensual, estado, fecha_inicio)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *;
    `;
    const values = [usuarioId, monto, tasa, plazo, cuotaMensual, estado];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const approveLoan = async (prestamoId) => {
    const query = `
        UPDATE prestamos
        SET estado = 'pendiente'
        WHERE id = $1 AND estado = 'pendiente_aprobacion'
        RETURNING *;
    `;
    const result = await pool.query(query, [prestamoId]);
    return result.rowCount > 0 ? result.rows[0] : null;
};

// ==========================
// 🚀 Rechazar préstamo
// ==========================
const rejectLoan = async (prestamoId) => {
    const query = `
        UPDATE prestamos
        SET estado = 'rechazado'
        WHERE id = $1 AND estado = 'pendiente_aprobacion'
        RETURNING *;
    `;
    const result = await pool.query(query, [prestamoId]);
    return result.rowCount > 0 ? result.rows[0] : null;
};

const getUserLoans = async (usuarioId) => {
    const query = `SELECT * FROM prestamos WHERE usuario_id = $1;`;
    const result = await pool.query(query, [usuarioId]);
    return result.rows;
};

const hasActiveLoan = async (usuarioId) => {
    const query = `SELECT COUNT(*) FROM prestamos WHERE usuario_id = $1 AND estado = 'pendiente';`;
    const result = await pool.query(query, [usuarioId]);
    return result.rows[0].count > 0;
};

const hasLoanAwaitingApproval = async (usuarioId) => {
    const query = `SELECT COUNT(*) FROM prestamos WHERE usuario_id = $1 AND estado = 'pendiente_aprobacion';`;
    const result = await pool.query(query, [usuarioId]);
    return result.rows[0].count > 0;
};

const generateAmortization = async (prestamoId, monto, tasa, plazo) => {
    try {
        const tasaMensual = parseFloat(tasa) / 100 / 12;
        const cuotaMensual = monto * tasaMensual / (1 - Math.pow(1 + tasaMensual, -plazo));
        let saldoRestante = parseFloat(monto);

        for (let i = 1; i <= plazo; i++) {
            saldoRestante -= cuotaMensual;

            const query = `
                INSERT INTO amortizacion (prestamo_id, numero_cuota, monto_cuota, saldo_restante, fecha_pago, estado)
                VALUES ($1, $2::INTEGER, $3::NUMERIC(10,2), $4::NUMERIC(10,2), NOW() + ($2 || ' month')::INTERVAL, 'pendiente');
            `;

            await pool.query(query, [
                parseInt(prestamoId),  
                parseInt(i),  
                parseFloat(cuotaMensual.toFixed(2)),  
                parseFloat(saldoRestante.toFixed(2))
            ]);
        }
        console.log(`✅ Tabla de amortización generada para préstamo ID ${prestamoId}`);
    } catch (error) {
        console.error("❌ Error al generar la tabla de amortización:", error.message);
        throw new Error("Error en la generación de amortización.");
    }
};

const isLoanFullyPaid = async (prestamoId) => {
    const query = `
        SELECT COUNT(*) AS cuotas_pendientes
        FROM amortizacion
        WHERE prestamo_id = $1 AND estado = 'pendiente';
    `;
    const result = await pool.query(query, [prestamoId]);

    return parseInt(result.rows[0].cuotas_pendientes) === 0; // Si no hay cuotas pendientes, está pagado
};

const getLoanByIdFromDB = async (id) => {
    const query = "SELECT * FROM prestamos WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const updateAmortizationTable = async (prestamoId, monto) => {
    try {
        const query = `
            UPDATE amortizacion 
            SET estado = 'pagado'
            WHERE id = (
                SELECT id FROM amortizacion 
                WHERE prestamo_id = $1 AND estado = 'pendiente'
                ORDER BY numero_cuota ASC 
                LIMIT 1
            )
            RETURNING *;
        `;
        const result = await pool.query(query, [prestamoId]);

        if (result.rowCount === 0) {
            throw new Error("No hay cuotas pendientes para este préstamo.");
        }

        return result.rows[0];
    } catch (error) {
        console.error("❌ Error al actualizar la tabla de amortización:", error.message);
        throw error;
    }
};


module.exports = { createLoan, getUserLoans, hasActiveLoan, hasLoanAwaitingApproval, approveLoan, rejectLoan, generateAmortization, isLoanFullyPaid, getLoanByIdFromDB, updateAmortizationTable};
