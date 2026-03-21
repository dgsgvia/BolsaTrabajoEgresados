const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/registro/usuario', authController.registroUsuario);
router.post('/registro/empresa', authController.registroEmpresa);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/sesion', authController.verificarSesion);

module.exports = router;
