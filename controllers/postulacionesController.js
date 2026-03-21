const Postulacion = require('../models/Postulacion');
const Vacante = require('../models/Vacante');

const postulacionesController = {
    // Postularse a una vacante (privado - usuario)
    async crear(req, res) {
        try {
            const { vacante_id, mensaje } = req.body;

            if (!vacante_id) {
                return res.status(400).json({ error: 'ID de vacante es obligatorio.' });
            }

            const vacante = await Vacante.obtenerPorId(vacante_id);
            if (!vacante) {
                return res.status(404).json({ error: 'Vacante no encontrada.' });
            }

            if (vacante.estado === 'cerrada') {
                return res.status(400).json({ error: 'Esta vacante ya no acepta postulaciones.' });
            }

            const existente = await Postulacion.verificarPostulacion(req.session.userId, vacante_id);
            if (existente) {
                return res.status(400).json({ error: 'Ya te has postulado a esta vacante.' });
            }

            await Postulacion.crear({
                usuario_id: req.session.userId,
                vacante_id,
                mensaje
            });

            res.status(201).json({ mensaje: 'Postulación enviada exitosamente.' });
        } catch (error) {
            console.error('Error al crear postulación:', error);
            res.status(500).json({ error: 'Error al enviar postulación.' });
        }
    },

    // Obtener postulaciones del usuario (privado - usuario)
    async obtenerPorUsuario(req, res) {
        try {
            const postulaciones = await Postulacion.obtenerPorUsuario(req.session.userId);
            res.json(postulaciones);
        } catch (error) {
            console.error('Error al obtener postulaciones:', error);
            res.status(500).json({ error: 'Error al obtener postulaciones.' });
        }
    },

    // Obtener postulaciones de una vacante (privado - empresa)
    async obtenerPorVacante(req, res) {
        try {
            const vacante = await Vacante.obtenerPorId(req.params.vacante_id);
            if (!vacante) {
                return res.status(404).json({ error: 'Vacante no encontrada.' });
            }

            if (vacante.empresa_id !== req.session.userId) {
                return res.status(403).json({ error: 'No tienes permiso para ver estas postulaciones.' });
            }

            const postulaciones = await Postulacion.obtenerPorVacante(req.params.vacante_id);
            res.json({ vacante, postulaciones });
        } catch (error) {
            console.error('Error al obtener postulaciones:', error);
            res.status(500).json({ error: 'Error al obtener postulaciones.' });
        }
    },

    // Actualizar estado de postulación (privado - empresa)
    async actualizarEstado(req, res) {
        try {
            const { estado } = req.body;
            const estadosValidos = ['pendiente', 'revisada', 'aceptada', 'rechazada'];

            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({ error: 'Estado inválido.' });
            }

            await Postulacion.actualizarEstado(req.params.id, estado);
            res.json({ mensaje: 'Estado de postulación actualizado.' });
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            res.status(500).json({ error: 'Error al actualizar estado.' });
        }
    },

    // Verificar si ya se postuló
    async verificarPostulacion(req, res) {
        try {
            const postulacion = await Postulacion.verificarPostulacion(req.session.userId, req.params.vacante_id);
            res.json({ postulado: !!postulacion, postulacion });
        } catch (error) {
            console.error('Error al verificar postulación:', error);
            res.status(500).json({ error: 'Error al verificar postulación.' });
        }
    }
};

module.exports = postulacionesController;
