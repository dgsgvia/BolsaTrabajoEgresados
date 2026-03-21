const express = require('express');
const router = express.Router();
const vacantesController = require('../controllers/vacantesController');
const { estaAutenticado, esEmpresa } = require('../middleware/auth');

// Rutas públicas
router.get('/', vacantesController.obtenerTodas);

// Rutas privadas (empresa) - DEBEN IR ANTES de /:id
router.get('/empresa/mis-vacantes', estaAutenticado, esEmpresa, vacantesController.obtenerPorEmpresa);
router.post('/', estaAutenticado, esEmpresa, vacantesController.crear);
router.put('/:id', estaAutenticado, esEmpresa, vacantesController.actualizar);
router.delete('/:id', estaAutenticado, esEmpresa, vacantesController.eliminar);

// Ruta publica parametrica (al final)
router.get('/:id', vacantesController.obtenerPorId);

module.exports = router;
