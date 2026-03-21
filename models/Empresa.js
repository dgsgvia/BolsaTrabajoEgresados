const db = require('../config/database');

const Empresa = {
    async crear(datos) {
        const { nombre, descripcion, email, password, telefono, direccion, sitio_web } = datos;
        const [result] = await db.execute(
            'INSERT INTO empresas (nombre, descripcion, email, password, telefono, direccion, sitio_web) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, email, password, telefono, direccion, sitio_web]
        );
        return result;
    },

    async buscarPorEmail(email) {
        const [rows] = await db.execute('SELECT * FROM empresas WHERE email = ?', [email]);
        return rows[0];
    },

    async buscarPorId(id) {
        const [rows] = await db.execute('SELECT id, nombre, descripcion, email, telefono, direccion, sitio_web, fecha_registro FROM empresas WHERE id = ?', [id]);
        return rows[0];
    },

    async actualizar(id, datos) {
        const { nombre, descripcion, telefono, direccion, sitio_web } = datos;
        const [result] = await db.execute(
            'UPDATE empresas SET nombre = ?, descripcion = ?, telefono = ?, direccion = ?, sitio_web = ? WHERE id = ?',
            [nombre, descripcion, telefono, direccion, sitio_web, id]
        );
        return result;
    }
};

module.exports = Empresa;
