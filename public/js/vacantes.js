// ============================================
// Vacantes Page
// ============================================

document.addEventListener('DOMContentLoaded', async function() {
    await renderNavbar('mainNavbar');
    
    // Check URL params for pre-filled search
    const params = new URLSearchParams(window.location.search);
    const busqueda = params.get('busqueda');
    if (busqueda) {
        document.getElementById('filtroBusqueda').value = busqueda;
    }
    
    cargarVacantes();
});

async function cargarVacantes() {
    const container = document.getElementById('vacantesGrid');
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
        const busqueda = document.getElementById('filtroBusqueda').value.trim();
        const tipo = document.getElementById('filtroTipo').value;
        const ubicacion = document.getElementById('filtroUbicacion').value.trim();

        let url = '/api/vacantes?';
        if (busqueda) url += 'busqueda=' + encodeURIComponent(busqueda) + '&';
        if (tipo) url += 'tipo_contrato=' + encodeURIComponent(tipo) + '&';
        if (ubicacion) url += 'ubicacion=' + encodeURIComponent(ubicacion) + '&';

        const vacantes = await apiFetch(url);
        const info = document.getElementById('resultadosInfo');
        
        if (vacantes.length === 0) {
            info.textContent = '';
            container.innerHTML = '\
                <div class="empty-state" style="grid-column: 1 / -1;">\
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>\
                    <h3>No se encontraron vacantes</h3>\
                    <p>Intenta con otros filtros de busqueda.</p>\
                </div>';
            return;
        }

        info.textContent = vacantes.length + ' vacante' + (vacantes.length !== 1 ? 's' : '') + ' encontrada' + (vacantes.length !== 1 ? 's' : '');
        container.innerHTML = vacantes.map(renderVacanteCard).join('');
    } catch (error) {
        container.innerHTML = '\
            <div class="empty-state" style="grid-column: 1 / -1;">\
                <h3>Error al cargar vacantes</h3>\
                <p>Verifica la conexion a la base de datos.</p>\
            </div>';
    }
}

function filtrarVacantes() {
    cargarVacantes();
}

// Search on Enter
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && (
        document.activeElement.id === 'filtroBusqueda' ||
        document.activeElement.id === 'filtroUbicacion'
    )) {
        filtrarVacantes();
    }
});
