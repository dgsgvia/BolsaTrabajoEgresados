const express = require('express');
const router = express.Router();
const postulacionesController = require('../controllers/postulacionesController');
const { estaAutenticado, esUsuario, esEmpresa } = require('../middleware/auth');

// Rutas de usuario (egresado)
router.post('/', estaAutenticado, esUsuario, postulacionesController.crear);
router.get('/mis-postulaciones', estaAutenticado, esUsuario, postulacionesController.obtenerPorUsuario);
router.get('/verificar/:vacante_id', estaAutenticado, esUsuario, postulacionesController.verificarPostulacion);

// Rutas de empresa
router.get('/vacante/:vacante_id', estaAutenticado, esEmpresa, postulacionesController.obtenerPorVacante);
router.put('/:id/estado', estaAutenticado, esEmpresa, postulacionesController.actualizarEstado);

module.exports = router;
