const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Empresa = require('../models/Empresa');
const { estaAutenticado } = require('../middleware/auth');

// Obtener perfil del usuario autenticado
router.get('/perfil', estaAutenticado, async (req, res) => {
    try {
        let perfil;
        if (req.session.userType === 'usuario') {
            perfil = await Usuario.buscarPorId(req.session.userId);
        } else {
            perfil = await Empresa.buscarPorId(req.session.userId);
        }

        if (!perfil) {
            return res.status(404).json({ error: 'Perfil no encontrado.' });
        }

        res.json({ ...perfil, tipo: req.session.userType });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error al obtener perfil.' });
    }
});

// Actualizar perfil
router.put('/perfil', estaAutenticado, async (req, res) => {
    try {
        if (req.session.userType === 'usuario') {
            await Usuario.actualizar(req.session.userId, req.body);
        } else {
            await Empresa.actualizar(req.session.userId, req.body);
        }
        res.json({ mensaje: 'Perfil actualizado exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ error: 'Error al actualizar perfil.' });
    }
});

module.exports = router;
