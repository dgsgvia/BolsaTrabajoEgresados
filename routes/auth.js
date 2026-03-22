const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/registro/usuario', authController.registroUsuario);
router.post('/registro/empresa', authController.registroEmpresa);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/sesion', authController.verificarSesion);
router.post('/recuperar-password', authController.recuperarPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
