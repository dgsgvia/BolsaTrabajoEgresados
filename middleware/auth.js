// Middleware para verificar si el usuario está autenticado
function estaAutenticado(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.status(401).json({ error: 'Debes iniciar sesión para acceder a esta función.' });
}

// Middleware para verificar si es un usuario (egresado)
function esUsuario(req, res, next) {
    if (req.session && req.session.userType === 'usuario') {
        return next();
    }
    res.status(403).json({ error: 'Acceso denegado. Esta función es solo para egresados.' });
}

// Middleware para verificar si es una empresa
function esEmpresa(req, res, next) {
    if (req.session && req.session.userType === 'empresa') {
        return next();
    }
    res.status(403).json({ error: 'Acceso denegado. Esta función es solo para empresas.' });
}

module.exports = { estaAutenticado, esUsuario, esEmpresa };
