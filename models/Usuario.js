const db = require('../config/database');

const Usuario = {
    async crear(datos) {
        const { nombre, apellido, email, password, telefono, carrera } = datos;
        const [result] = await db.execute(
            'INSERT INTO usuarios (nombre, apellido, email, password, telefono, carrera) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, apellido, email, password, telefono, carrera]
        );
        return result;
    },

    async buscarPorEmail(email) {
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows[0];
    },

    async buscarPorId(id) {
        const [rows] = await db.execute('SELECT id, nombre, apellido, email, telefono, carrera, fecha_registro FROM usuarios WHERE id = ?', [id]);
        return rows[0];
    },

    async actualizar(id, datos) {
        const { nombre, apellido, telefono, carrera } = datos;
        const [result] = await db.execute(
            'UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, carrera = ? WHERE id = ?',
            [nombre, apellido, telefono, carrera, id]
        );
        return result;
    }
};

module.exports = Usuario;
