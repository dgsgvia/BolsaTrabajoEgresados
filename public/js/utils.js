// ============================================
// Utilidades Globales
// ============================================

const API_URL = '';

// Fetch wrapper
async function apiFetch(url, options = {}) {
    const config = {
        headers: { 'Content-Type': 'application/json' },
        ...options
    };
    const response = await fetch(API_URL + url, config);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Error en la solicitud');
    }
    return data;
}

// Mostrar alerta
function mostrarAlerta(contenedor, mensaje, tipo = 'error') {
    const container = typeof contenedor === 'string' ? document.getElementById(contenedor) : contenedor;
    if (!container) return;
    container.innerHTML = '<div class="alert alert-' + tipo + '">' + escapeHtml(mensaje) + '</div>';
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Formatear fecha
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-MX', opciones);
}

// Formatear fecha corta
function formatearFechaCorta(fechaStr) {
    const fecha = new Date(fechaStr);
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return fecha.toLocaleDateString('es-MX', opciones);
}

// Verificar sesion
async function verificarSesion() {
    try {
        const data = await apiFetch('/api/auth/sesion');
        return data;
    } catch (error) {
        return { autenticado: false };
    }
}

// Cerrar sesion
async function cerrarSesion() {
    try {
        await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
        // Ignore
    }
    window.location.href = '/login.html';
}

// Renderizar navbar
async function renderNavbar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const sesion = await verificarSesion();

    let navLinks = '';
    if (sesion.autenticado) {
        navLinks = '\
            <li><a href="/">Inicio</a></li>\
            <li><a href="/vacantes.html">Vacantes</a></li>\
            <li><a href="/dashboard.html">Mi Panel</a></li>\
            <li><a href="#" onclick="cerrarSesion(); return false;" class="btn btn-secondary btn-sm">Cerrar Sesion</a></li>';
    } else {
        navLinks = '\
            <li><a href="/">Inicio</a></li>\
            <li><a href="/vacantes.html">Vacantes</a></li>\
            <li><a href="/login.html" class="btn btn-primary btn-sm">Iniciar Sesion</a></li>';
    }

    container.innerHTML = '\
        <div class="container">\
            <a href="/" class="navbar-brand">\
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>\
                UT Empleo\
            </a>\
            <button class="navbar-toggle" onclick="toggleMenu()">\
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>\
            </button>\
            <ul class="navbar-nav" id="navMenu">' + navLinks + '</ul>\
        </div>';
}

// Toggle mobile menu
function toggleMenu() {
    const nav = document.getElementById('navMenu');
    if (nav) {
        nav.classList.toggle('active');
    }
}

// Obtener badge de estado
function getBadgeEstado(estado) {
    const badgeMap = {
        'pendiente': 'badge-warning',
        'revisada': 'badge-info',
        'aceptada': 'badge-success',
        'rechazada': 'badge-danger',
        'activa': 'badge-success',
        'cerrada': 'badge-danger'
    };
    return '<span class="badge ' + (badgeMap[estado] || 'badge-primary') + '">' + escapeHtml(estado) + '</span>';
}

// Truncar texto
function truncarTexto(texto, maxLen) {
    if (!texto) return '';
    return texto.length > maxLen ? texto.substring(0, maxLen) + '...' : texto;
}

// Renderizar tarjeta de vacante
function renderVacanteCard(vacante) {
    return '\
        <div class="card vacante-card" onclick="window.location.href=\'/vacante-detalle.html?id=' + vacante.id + '\'">\
            <div class="card-header">\
                <div>\
                    <div class="card-title">' + escapeHtml(vacante.titulo) + '</div>\
                    <div class="card-subtitle">' + escapeHtml(vacante.empresa_nombre) + '</div>\
                </div>\
                <span class="badge badge-primary">' + escapeHtml(vacante.tipo_contrato) + '</span>\
            </div>\
            <div class="card-body">\
                <p>' + escapeHtml(truncarTexto(vacante.descripcion, 120)) + '</p>\
                <div class="card-meta">\
                    ' + (vacante.ubicacion ? '<div class="card-meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' + escapeHtml(vacante.ubicacion) + '</div>' : '') + '\
                    ' + (vacante.salario ? '<div class="card-meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' + escapeHtml(vacante.salario) + '</div>' : '') + '\
                </div>\
            </div>\
            <div class="card-footer">\
                <span style="font-size: 0.8rem; color: var(--color-text-light);">' + formatearFechaCorta(vacante.fecha_publicacion) + '</span>\
                <span class="btn btn-primary btn-sm">Ver detalle</span>\
            </div>\
        </div>';
}
