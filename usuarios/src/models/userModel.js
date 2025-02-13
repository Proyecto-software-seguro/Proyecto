// src/models/userModel.js

const { pool } = require('../../config/db');
const bcrypt = require('bcrypt');

// Crear un nuevo usuario con información adicional
exports.createUser = async (nombre, email, password, rol, sueldo, carga_familiar, direccion) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const query = `INSERT INTO usuarios (nombre, email, password, rol, is_verified, sueldo, carga_familiar, direccion) 
                       VALUES ($1, $2, $3, $4, false, $5, $6, $7) RETURNING *;`;
        const values = [nombre, email, hashedPassword, rol, sueldo, carga_familiar, direccion];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error al crear usuario:", error.message);
        throw error;
    }
};

// Obtener usuario por correo electrónico
exports.getUserByEmail = async (email) => {
    try {
        const query = `SELECT * FROM usuarios WHERE email = $1;`;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al obtener usuario por email:", error.message);
        throw error;
    }
};

// Obtener usuario por ID
exports.getUserById = async (id) => {
    try {
        const query = `SELECT id, nombre, email, rol, is_verified, sueldo, carga_familiar, direccion 
                       FROM usuarios WHERE id = $1;`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al obtener usuario por ID:", error.message);
        throw error;
    }
};

// Obtener el ID de un rol por su nombre (CORRECCIÓN)
exports.getRoleIdByName = async (roleName) => {
    try {
        const query = 'SELECT id FROM roles WHERE nombre = $1;';
        const result = await pool.query(query, [roleName]);
        return result.rows[0]?.id || null; // Devuelve el ID del rol o null si no existe
    } catch (error) {
        console.error("Error al obtener el ID del rol:", error.message);
        throw error;
    }
};

// Actualizar un usuario
exports.updateUser = async (id, nombre, email, rol, sueldo, carga_familiar, direccion) => {
    try {
        const query = `UPDATE usuarios SET nombre = $1, email = $2, rol = $3, sueldo = $4, carga_familiar = $5, direccion = $6 
                       WHERE id = $7 RETURNING *;`;
        const values = [nombre, email, rol, sueldo, carga_familiar, direccion, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error al actualizar usuario:", error.message);
        throw error;
    }
};

// Eliminar usuario
exports.deleteUser = async (id) => {
    try {
        const query = `DELETE FROM usuarios WHERE id = $1 RETURNING *;`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al eliminar usuario:", error.message);
        throw error;
    }
};
