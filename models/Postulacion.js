const db = require('../config/database');

const Postulacion = {
    async crear(datos) {
        const { usuario_id, vacante_id, mensaje } = datos;
        const [result] = await db.execute(
            'INSERT INTO postulaciones (usuario_id, vacante_id, mensaje) VALUES (?, ?, ?)',
            [usuario_id, vacante_id, mensaje]
        );
        return result;
    },

    async obtenerPorUsuario(usuario_id) {
        const [rows] = await db.execute(`
            SELECT p.*, v.titulo AS vacante_titulo, v.salario, v.ubicacion, v.tipo_contrato,
                   e.nombre AS empresa_nombre
            FROM postulaciones p
            JOIN vacantes v ON p.vacante_id = v.id
            JOIN empresas e ON v.empresa_id = e.id
            WHERE p.usuario_id = ?
            ORDER BY p.fecha_postulacion DESC
        `, [usuario_id]);
        return rows;
    },

    async obtenerPorVacante(vacante_id) {
        const [rows] = await db.execute(`
            SELECT p.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido,
                   u.email AS usuario_email, u.telefono AS usuario_telefono, u.carrera AS usuario_carrera
            FROM postulaciones p
            JOIN usuarios u ON p.usuario_id = u.id
            WHERE p.vacante_id = ?
            ORDER BY p.fecha_postulacion DESC
        `, [vacante_id]);
        return rows;
    },

    async verificarPostulacion(usuario_id, vacante_id) {
        const [rows] = await db.execute(
            'SELECT * FROM postulaciones WHERE usuario_id = ? AND vacante_id = ?',
            [usuario_id, vacante_id]
        );
        return rows[0];
    },

    async actualizarEstado(id, estado) {
        const [result] = await db.execute(
            'UPDATE postulaciones SET estado = ? WHERE id = ?',
            [estado, id]
        );
        return result;
    },

    async contarPorUsuario(usuario_id) {
        const [rows] = await db.execute('SELECT COUNT(*) AS total FROM postulaciones WHERE usuario_id = ?', [usuario_id]);
        return rows[0].total;
    },

    async contarPorEmpresa(empresa_id) {
        const [rows] = await db.execute(`
            SELECT COUNT(*) AS total FROM postulaciones p
            JOIN vacantes v ON p.vacante_id = v.id
            WHERE v.empresa_id = ?
        `, [empresa_id]);
        return rows[0].total;
    }
};

module.exports = Postulacion;
