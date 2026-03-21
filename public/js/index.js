// ============================================
// Index / Landing Page
// ============================================

document.addEventListener('DOMContentLoaded', async function() {
    // Verificar sesion y actualizar navbar
    const sesion = await verificarSesion();
    const navGuest = document.getElementById('nav-guest');
    const navUser = document.getElementById('nav-user');
    
    if (sesion.autenticado) {
        if (navGuest) navGuest.classList.add('hidden');
        if (navUser) navUser.classList.remove('hidden');
    }

    // Cargar vacantes recientes
    cargarVacantesRecientes();

    // Cargar estadisticas
    cargarEstadisticas();
});

async function cargarVacantesRecientes() {
    const container = document.getElementById('vacantesRecientes');
    try {
        const vacantes = await apiFetch('/api/vacantes');
        const recientes = vacantes.slice(0, 6);

        if (recientes.length === 0) {
            container.innerHTML = '\
                <div class="empty-state" style="grid-column: 1 / -1;">\
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>\
                    <h3>No hay vacantes disponibles</h3>\
                    <p>Las empresas aun no han publicado vacantes.</p>\
                </div>';
            return;
        }

        container.innerHTML = recientes.map(renderVacanteCard).join('');
    } catch (error) {
        container.innerHTML = '\
            <div class="empty-state" style="grid-column: 1 / -1;">\
                <h3>Bienvenido a UT Empleo</h3>\
                <p>Conecta la base de datos MySQL para ver las vacantes disponibles.</p>\
                <a href="/vacantes.html" class="btn btn-primary">Ver Vacantes</a>\
            </div>';
    }
}

async function cargarEstadisticas() {
    try {
        const stats = await apiFetch('/api/stats');
        document.getElementById('statVacantes').textContent = stats.vacantes || 0;
        document.getElementById('statEmpresas').textContent = stats.empresas || 0;
        document.getElementById('statUsuarios').textContent = stats.usuarios || 0;
    } catch (error) {
        document.getElementById('statVacantes').textContent = '6';
        document.getElementById('statEmpresas').textContent = '3';
        document.getElementById('statUsuarios').textContent = '3';
    }
}

function buscarDesdeHero() {
    const busqueda = document.getElementById('heroBusqueda').value.trim();
    if (busqueda) {
        window.location.href = '/vacantes.html?busqueda=' + encodeURIComponent(busqueda);
    } else {
        window.location.href = '/vacantes.html';
    }
}

// Buscar con Enter
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.activeElement.id === 'heroBusqueda') {
        buscarDesdeHero();
    }
});
