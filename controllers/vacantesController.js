const Vacante = require('../models/Vacante');

const vacantesController = {
    // Obtener todas las vacantes (público)
    async obtenerTodas(req, res) {
        try {
            const filtros = {
                busqueda: req.query.busqueda || '',
                tipo_contrato: req.query.tipo_contrato || '',
                ubicacion: req.query.ubicacion || ''
            };
            const vacantes = await Vacante.obtenerTodas(filtros);
            res.json(vacantes);
        } catch (error) {
            console.error('Error al obtener vacantes:', error);
            res.status(500).json({ error: 'Error al obtener vacantes.' });
        }
    },

    // Obtener vacante por ID (público)
    async obtenerPorId(req, res) {
        try {
            const vacante = await Vacante.obtenerPorId(req.params.id);
            if (!vacante) {
                return res.status(404).json({ error: 'Vacante no encontrada.' });
            }
            res.json(vacante);
        } catch (error) {
            console.error('Error al obtener vacante:', error);
            res.status(500).json({ error: 'Error al obtener vacante.' });
        }
    },

    // Obtener vacantes de una empresa (privado - empresa)
    async obtenerPorEmpresa(req, res) {
        try {
            const vacantes = await Vacante.obtenerPorEmpresa(req.session.userId);
            res.json(vacantes);
        } catch (error) {
            console.error('Error al obtener vacantes de empresa:', error);
            res.status(500).json({ error: 'Error al obtener vacantes.' });
        }
    },

    // Crear vacante (privado - empresa)
    async crear(req, res) {
        try {
            const { titulo, descripcion, requisitos, salario, ubicacion, tipo_contrato, latitud, longitud } = req.body;

            if (!titulo || !descripcion) {
                return res.status(400).json({ error: 'Título y descripción son obligatorios.' });
            }

            const datos = {
                empresa_id: req.session.userId,
                titulo,
                descripcion,
                requisitos,
                salario,
                ubicacion,
                tipo_contrato,
                latitud,
                longitud
            };

            const result = await Vacante.crear(datos);
            res.status(201).json({ mensaje: 'Vacante creada exitosamente.', id: result.insertId });
        } catch (error) {
            console.error('Error al crear vacante:', error);
            res.status(500).json({ error: 'Error al crear vacante.' });
        }
    },

    // Actualizar vacante (privado - empresa)
    async actualizar(req, res) {
        try {
            const vacante = await Vacante.obtenerPorId(req.params.id);
            if (!vacante) {
                return res.status(404).json({ error: 'Vacante no encontrada.' });
            }

            if (vacante.empresa_id !== req.session.userId) {
                return res.status(403).json({ error: 'No tienes permiso para editar esta vacante.' });
            }

            const { titulo, descripcion, requisitos, salario, ubicacion, tipo_contrato, estado, latitud, longitud } = req.body;
            await Vacante.actualizar(req.params.id, { titulo, descripcion, requisitos, salario, ubicacion, tipo_contrato, estado, latitud, longitud });

            res.json({ mensaje: 'Vacante actualizada exitosamente.' });
        } catch (error) {
            console.error('Error al actualizar vacante:', error);
            res.status(500).json({ error: 'Error al actualizar vacante.' });
        }
    },

    // Eliminar vacante (privado - empresa)
    async eliminar(req, res) {
        try {
            const vacante = await Vacante.obtenerPorId(req.params.id);
            if (!vacante) {
                return res.status(404).json({ error: 'Vacante no encontrada.' });
            }

            if (vacante.empresa_id !== req.session.userId) {
                return res.status(403).json({ error: 'No tienes permiso para eliminar esta vacante.' });
            }

            await Vacante.eliminar(req.params.id);
            res.json({ mensaje: 'Vacante eliminada exitosamente.' });
        } catch (error) {
            console.error('Error al eliminar vacante:', error);
            res.status(500).json({ error: 'Error al eliminar vacante.' });
        }
    }
};

module.exports = vacantesController;
