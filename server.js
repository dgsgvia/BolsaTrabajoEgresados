require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// Middlewares
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'bolsa_trabajo_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// Rutas API
// ============================================
const authRoutes = require('./routes/auth');
const vacantesRoutes = require('./routes/vacantes');
const postulacionesRoutes = require('./routes/postulaciones');
const usuariosRoutes = require('./routes/usuarios');

app.use('/api/auth', authRoutes);
app.use('/api/vacantes', vacantesRoutes);
app.use('/api/postulaciones', postulacionesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Ruta de estadisticas
app.get('/api/stats', async (req, res) => {
    try {
        const db = require('./config/database');
        const [vacantes] = await db.execute("SELECT COUNT(*) AS total FROM vacantes WHERE estado = 'activa'");
        const [empresas] = await db.execute('SELECT COUNT(*) AS total FROM empresas');
        const [usuarios] = await db.execute('SELECT COUNT(*) AS total FROM usuarios');
        res.json({
            vacantes: vacantes[0].total,
            empresas: empresas[0].total,
            usuarios: usuarios[0].total
        });
    } catch (error) {
        res.json({ vacantes: 0, empresas: 0, usuarios: 0 });
    }
});

// SPA fallback - servir index.html para rutas no encontradas
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// Iniciar servidor
// ============================================
const server = app.listen(PORT, () => {
    console.log('===========================================');
    console.log('  Bolsa de Trabajo - Universidad Tecnologica');
    console.log('  Servidor corriendo en: http://localhost:' + PORT);
    console.log('===========================================');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log('Puerto ' + PORT + ' en uso, intentando puerto ' + (PORT + 1));
        app.listen(PORT + 1, () => {
            console.log('Servidor corriendo en: http://localhost:' + (PORT + 1));
        });
    } else {
        console.error('Error del servidor:', err);
    }
});
