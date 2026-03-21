const db = require('../config/database');

const Vacante = {
    async crear(datos) {
        const { empresa_id, titulo, descripcion, requisitos, salario, ubicacion, tipo_contrato, latitud, longitud } = datos;
        const [result] = await db.execute(
            'INSERT INTO vacantes (empresa_id, titulo, descripcion, requisitos, salario, ubicacion, tipo_contrato, latitud, longitud) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [empresa_id, titulo, descripcion, requisitos, salario, ubicacion, tipo_contrato, latitud || null, longitud || null]
        );
        return result;
    },

    async obtenerTodas(filtros = {}) {
        let query = `
            SELECT v.*, e.nombre AS empresa_nombre, e.direccion AS empresa_direccion
            FROM vacantes v
            JOIN empresas e ON v.empresa_id = e.id
            WHERE v.estado = 'activa'
        `;
        const params = [];

        if (filtros.busqueda) {
            query += ' AND (v.titulo LIKE ? OR v.descripcion LIKE ? OR e.nombre LIKE ?)';
            const busqueda = `%${filtros.busqueda}%`;
            params.push(busqueda, busqueda, busqueda);
        }

        if (filtros.tipo_contrato) {
            query += ' AND v.tipo_contrato = ?';
            params.push(filtros.tipo_contrato);
        }

        if (filtros.ubicacion) {
            query += ' AND v.ubicacion LIKE ?';
            params.push(`%${filtros.ubicacion}%`);
        }

        query += ' ORDER BY v.fecha_publicacion DESC';

        const [rows] = await db.execute(query, params);
        return rows;
    },

    async obtenerPorId(id) {
        const [rows] = await db.execute(`
            SELECT v.*, e.nombre AS empresa_nombre, e.descripcion AS empresa_descripcion,
                   e.direccion AS empresa_direccion, e.sitio_web AS empresa_sitio_web, e.telefono AS empresa_telefono,
                   e.email AS empresa_email
            FROM vacantes v
            JOIN empresas e ON v.empresa_id = e.id
            WHERE v.id = ?
        `, [id]);
        return rows[0];
    },

    async obtenerPorEmpresa(empresa_id) {
        const [rows] = await db.execute(`
            SELECT v.*, 
                (SELECT COUNT(*) FROM postulaciones WHERE vacante_id = v.id) AS total_postulaciones
            FROM vacantes v
            WHERE v.empresa_id = ?
            ORDER BY v.fecha_publicacion DESC
        `, [empresa_id]);
        return rows;
    },

    async actualizar(id, datos) {
        const { titulo, descripcion, requisitos, salario, ubicacion, tipo_contrato, estado, latitud, longitud } = datos;
        const [result] = await db.execute(
            'UPDATE vacantes SET titulo = ?, descripcion = ?, requisitos = ?, salario = ?, ubicacion = ?, tipo_contrato = ?, estado = ?, latitud = ?, longitud = ? WHERE id = ?',
            [titulo, descripcion, requisitos, salario, ubicacion, tipo_contrato, estado, latitud || null, longitud || null, id]
        );
        return result;
    },

    async eliminar(id) {
        const [result] = await db.execute('DELETE FROM vacantes WHERE id = ?', [id]);
        return result;
    },

    async contarPorEmpresa(empresa_id) {
        const [rows] = await db.execute('SELECT COUNT(*) AS total FROM vacantes WHERE empresa_id = ?', [empresa_id]);
        return rows[0].total;
    }
};

module.exports = Vacante;
