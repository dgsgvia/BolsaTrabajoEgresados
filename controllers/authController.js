const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const Empresa = require('../models/Empresa');
const crypto = require('crypto');
const db = require('../config/database');

const authController = {
    // Registro de usuario (egresado)
    async registroUsuario(req, res) {
        try {
            const { nombre, apellido, email, password, telefono, carrera } = req.body;

            if (!nombre || !apellido || !email || !password) {
                return res.status(400).json({ error: 'Nombre, apellido, email y contraseña son obligatorios.' });
            }

            const existente = await Usuario.buscarPorEmail(email);
            if (existente) {
                return res.status(400).json({ error: 'Ya existe una cuenta con este correo electrónico.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await Usuario.crear({ nombre, apellido, email, password: hashedPassword, telefono, carrera });

            res.status(201).json({ mensaje: 'Registro exitoso. Ya puedes iniciar sesión.' });
        } catch (error) {
            console.error('Error en registro de usuario:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    },

    // Registro de empresa
    async registroEmpresa(req, res) {
        try {
            const { nombre, descripcion, email, password, telefono, direccion, sitio_web } = req.body;

            if (!nombre || !email || !password) {
                return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios.' });
            }

            const existente = await Empresa.buscarPorEmail(email);
            if (existente) {
                return res.status(400).json({ error: 'Ya existe una cuenta con este correo electrónico.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await Empresa.crear({ nombre, descripcion, email, password: hashedPassword, telefono, direccion, sitio_web });

            res.status(201).json({ mensaje: 'Registro exitoso. Ya puedes iniciar sesión.' });
        } catch (error) {
            console.error('Error en registro de empresa:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    },

    // Login
    async login(req, res) {
        try {
            const { email, password, tipo } = req.body;

            if (!email || !password || !tipo) {
                return res.status(400).json({ error: 'Email, contraseña y tipo de cuenta son obligatorios.' });
            }

            let cuenta;
            if (tipo === 'usuario') {
                cuenta = await Usuario.buscarPorEmail(email);
            } else if (tipo === 'empresa') {
                cuenta = await Empresa.buscarPorEmail(email);
            } else {
                return res.status(400).json({ error: 'Tipo de cuenta inválido.' });
            }

            if (!cuenta) {
                return res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos.' });
            }

            const passwordValida = await bcrypt.compare(password, cuenta.password);
            if (!passwordValida) {
                return res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos.' });
            }

            req.session.userId = cuenta.id;
            req.session.userType = tipo;
            req.session.userName = cuenta.nombre;
            req.session.userEmail = cuenta.email;

            res.json({
                mensaje: 'Inicio de sesión exitoso.',
                usuario: {
                    id: cuenta.id,
                    nombre: cuenta.nombre,
                    tipo: tipo
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    },

    // Logout
    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al cerrar sesión.' });
            }
            res.json({ mensaje: 'Sesión cerrada exitosamente.' });
        });
    },

    // Verificar sesión
    async verificarSesion(req, res) {
        if (req.session.userId) {
            res.json({
                autenticado: true,
                usuario: {
                    id: req.session.userId,
                    tipo: req.session.userType,
                    nombre: req.session.userName,
                    email: req.session.userEmail
                }
            });
        } else {
            res.json({ autenticado: false });
        }
    },

    // Solicitar recuperación de contraseña
    async recuperarPassword(req, res) {
        try {
            const { email } = req.body;

            const usuario = await Usuario.buscarPorEmail(email);

            if (!usuario) {
                return res.json({ mensaje: 'Si el correo existe, se enviará un enlace.' });
            }

            const token = crypto.randomBytes(32).toString('hex');
            const expiry = new Date(Date.now() + 3600000); // 1 hora

            await db.execute(
                'UPDATE usuarios SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
                [token, expiry, email]
            );

            const link = `https://TU-DOMINIO/reset-password.html?token=${token}`;

            console.log("LINK DE RECUPERACIÓN:", link);

            res.json({ mensaje: 'Correo enviado.', token });

        } catch (error) {
            console.error('Error en recuperar contraseña:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    },

    // Cambiar contraseña
    async resetPassword(req, res) {
        try {
            const { token, password } = req.body;

            const [usuarios] = await db.execute(
                'SELECT * FROM usuarios WHERE reset_token = ? AND reset_token_expiry > NOW()',
                [token]
            );

            if (usuarios.length === 0) {
                return res.status(400).json({ error: 'Token inválido o expirado.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await db.execute(
                'UPDATE usuarios SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
                [hashedPassword, usuarios[0].id]
            );

            res.json({ mensaje: 'Contraseña actualizada correctamente.' });

        } catch (error) {
            console.error('Error en reset password:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
};

module.exports = authController;
