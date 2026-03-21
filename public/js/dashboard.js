// ============================================
// Dashboard Page
// ============================================

let sesionDash = null;

// ============================================
// Google Maps Variables and Functions
// ============================================
let mapPicker = null;
let mapMarker = null;

// Initialize Google Maps Picker (called by Google Maps API callback)
function initMapPicker() {
    // Map will be initialized when modal opens
}

function initializeMapInModal() {
    const mapContainer = document.getElementById('mapPicker');
    if (!mapContainer || mapPicker) return;
    
    // Default location (Mexico City)
    const defaultLocation = { lat: 20.5888, lng: -100.3899 }; // Queretaro, Mexico
    
    mapPicker = new google.maps.Map(mapContainer, {
        center: defaultLocation,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false
    });
    
    // Add click listener to place marker
    mapPicker.addListener('click', function(event) {
        placeMarker(event.latLng);
    });
}

function placeMarker(location) {
    // Remove existing marker if any
    if (mapMarker) {
        mapMarker.setMap(null);
    }
    
    // Create new marker
    mapMarker = new google.maps.Marker({
        position: location,
        map: mapPicker,
        draggable: true,
        animation: google.maps.Animation.DROP
    });
    
    // Update hidden fields
    document.getElementById('vacanteLatitud').value = location.lat();
    document.getElementById('vacanteLongitud').value = location.lng();
    document.getElementById('coordenadasSeleccionadas').textContent = 
        'Ubicacion seleccionada: ' + location.lat().toFixed(6) + ', ' + location.lng().toFixed(6);
    
    // Allow marker to be dragged
    mapMarker.addListener('dragend', function(event) {
        document.getElementById('vacanteLatitud').value = event.latLng.lat();
        document.getElementById('vacanteLongitud').value = event.latLng.lng();
        document.getElementById('coordenadasSeleccionadas').textContent = 
            'Ubicacion seleccionada: ' + event.latLng.lat().toFixed(6) + ', ' + event.latLng.lng().toFixed(6);
    });
}

function resetMapPicker() {
    if (mapMarker) {
        mapMarker.setMap(null);
        mapMarker = null;
    }
    document.getElementById('vacanteLatitud').value = '';
    document.getElementById('vacanteLongitud').value = '';
    document.getElementById('coordenadasSeleccionadas').textContent = '';
    
    if (mapPicker) {
        mapPicker.setCenter({ lat: 20.5888, lng: -100.3899 });
        mapPicker.setZoom(12);
    }
}

function setMapMarkerFromCoordinates(lat, lng) {
    if (!mapPicker) return;
    
    const location = new google.maps.LatLng(lat, lng);
    mapPicker.setCenter(location);
    mapPicker.setZoom(15);
    placeMarker(location);
}

document.addEventListener('DOMContentLoaded', async function() {
    await renderNavbar('mainNavbar');
    sesionDash = await verificarSesion();
    
    if (!sesionDash.autenticado) {
        window.location.href = '/login.html';
        return;
    }
    
    if (sesionDash.usuario.tipo === 'usuario') {
        document.getElementById('dashboardUsuario').classList.remove('hidden');
        document.getElementById('userName').textContent = sesionDash.usuario.nombre;
        cargarPostulacionesUsuario();
    } else {
        document.getElementById('dashboardEmpresa').classList.remove('hidden');
        document.getElementById('empresaName').textContent = sesionDash.usuario.nombre;
        cargarVacantesEmpresa();
    }
});

// ============================================
// Dashboard Usuario (Egresado)
// ============================================

async function cargarPostulacionesUsuario() {
    const container = document.getElementById('misPostulaciones');
    
    try {
        const postulaciones = await apiFetch('/api/postulaciones/mis-postulaciones');
        
        // Stats
        document.getElementById('statMisPostulaciones').textContent = postulaciones.length;
        document.getElementById('statPendientes').textContent = postulaciones.filter(function(p) { return p.estado === 'pendiente'; }).length;
        document.getElementById('statAceptadas').textContent = postulaciones.filter(function(p) { return p.estado === 'aceptada'; }).length;
        
        if (postulaciones.length === 0) {
            container.innerHTML = '\
                <div class="empty-state">\
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>\
                    <h3>No tienes postulaciones</h3>\
                    <p>Explora las vacantes disponibles y postulate a las que te interesen.</p>\
                    <a href="/vacantes.html" class="btn btn-primary">Ver Vacantes</a>\
                </div>';
            return;
        }
        
        var html = '<div class="table-wrapper"><table class="table">\
            <thead><tr>\
                <th>Vacante</th>\
                <th>Empresa</th>\
                <th>Tipo</th>\
                <th>Fecha</th>\
                <th>Estado</th>\
                <th></th>\
            </tr></thead><tbody>';
        
        postulaciones.forEach(function(p) {
            html += '<tr>\
                <td><strong>' + escapeHtml(p.vacante_titulo) + '</strong></td>\
                <td>' + escapeHtml(p.empresa_nombre) + '</td>\
                <td>' + escapeHtml(p.tipo_contrato) + '</td>\
                <td>' + formatearFechaCorta(p.fecha_postulacion) + '</td>\
                <td>' + getBadgeEstado(p.estado) + '</td>\
                <td><a href="/vacante-detalle.html?id=' + p.vacante_id + '" class="btn btn-secondary btn-sm">Ver</a></td>\
            </tr>';
        });
        
        html += '</tbody></table></div>';
        container.innerHTML = html;
        
    } catch (error) {
        container.innerHTML = '<div class="alert alert-error">Error al cargar postulaciones: ' + escapeHtml(error.message) + '</div>';
    }
}

// ============================================
// Dashboard Empresa
// ============================================

async function cargarVacantesEmpresa() {
    const container = document.getElementById('misVacantes');
    
    try {
        const vacantes = await apiFetch('/api/vacantes/empresa/mis-vacantes');
        
        // Stats
        document.getElementById('statMisVacantes').textContent = vacantes.length;
        var totalPost = 0;
        vacantes.forEach(function(v) { totalPost += (v.total_postulaciones || 0); });
        document.getElementById('statPostulacionesRecibidas').textContent = totalPost;
        
        if (vacantes.length === 0) {
            container.innerHTML = '\
                <div class="empty-state">\
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>\
                    <h3>No has publicado vacantes</h3>\
                    <p>Crea tu primera vacante para recibir postulaciones de egresados.</p>\
                </div>';
            return;
        }
        
        var html = '<div class="table-wrapper"><table class="table">\
            <thead><tr>\
                <th>Titulo</th>\
                <th>Tipo</th>\
                <th>Postulaciones</th>\
                <th>Estado</th>\
                <th>Fecha</th>\
                <th>Acciones</th>\
            </tr></thead><tbody>';
        
        vacantes.forEach(function(v) {
            html += '<tr>\
                <td><strong>' + escapeHtml(v.titulo) + '</strong></td>\
                <td>' + escapeHtml(v.tipo_contrato) + '</td>\
                <td><a href="#" onclick="verPostulaciones(' + v.id + '); return false;" style="font-weight: 600;">' + (v.total_postulaciones || 0) + ' postulaciones</a></td>\
                <td>' + getBadgeEstado(v.estado) + '</td>\
                <td>' + formatearFechaCorta(v.fecha_publicacion) + '</td>\
                <td>\
                    <div class="d-flex gap-1">\
                        <button class="btn btn-secondary btn-sm" onclick="editarVacante(' + v.id + ')">Editar</button>\
                        <button class="btn btn-danger btn-sm" onclick="eliminarVacante(' + v.id + ')">Eliminar</button>\
                    </div>\
                </td>\
            </tr>';
        });
        
        html += '</tbody></table></div>';
        container.innerHTML = html;
        
    } catch (error) {
        container.innerHTML = '<div class="alert alert-error">Error al cargar vacantes: ' + escapeHtml(error.message) + '</div>';
    }
}

// ============================================
// CRUD Vacantes (Empresa)
// ============================================

function mostrarFormVacante() {
    document.getElementById('modalVacanteTitle').textContent = 'Nueva Vacante';
    document.getElementById('btnGuardarVacante').textContent = 'Publicar Vacante';
    document.getElementById('vacanteId').value = '';
    document.getElementById('vacanteForm').reset();
    resetMapPicker();
    document.getElementById('modalVacante').classList.add('active');
    
    // Initialize map after modal is visible
    setTimeout(function() {
        initializeMapInModal();
    }, 100);
}

function cerrarModalVacante() {
    document.getElementById('modalVacante').classList.remove('active');
}

async function editarVacante(id) {
    try {
        const vacante = await apiFetch('/api/vacantes/' + id);
        document.getElementById('modalVacanteTitle').textContent = 'Editar Vacante';
        document.getElementById('btnGuardarVacante').textContent = 'Guardar Cambios';
        document.getElementById('vacanteId').value = vacante.id;
        document.getElementById('vacanteTitulo').value = vacante.titulo;
        document.getElementById('vacanteDescripcion').value = vacante.descripcion;
        document.getElementById('vacanteRequisitos').value = vacante.requisitos || '';
        document.getElementById('vacanteSalario').value = vacante.salario || '';
        document.getElementById('vacanteUbicacion').value = vacante.ubicacion || '';
        document.getElementById('vacanteTipo').value = vacante.tipo_contrato;
        document.getElementById('vacanteEstado').value = vacante.estado;
        
        // Reset map first
        resetMapPicker();
        
        document.getElementById('modalVacante').classList.add('active');
        
        // Initialize map and set marker if coordinates exist
        setTimeout(function() {
            initializeMapInModal();
            if (vacante.latitud && vacante.longitud) {
                document.getElementById('vacanteLatitud').value = vacante.latitud;
                document.getElementById('vacanteLongitud').value = vacante.longitud;
                setMapMarkerFromCoordinates(parseFloat(vacante.latitud), parseFloat(vacante.longitud));
            }
        }, 100);
    } catch (error) {
        alert('Error al cargar vacante: ' + error.message);
    }
}

async function guardarVacante(e) {
    e.preventDefault();
    const btn = document.getElementById('btnGuardarVacante');
    btn.disabled = true;
    
    const id = document.getElementById('vacanteId').value;
    const latitud = document.getElementById('vacanteLatitud').value;
    const longitud = document.getElementById('vacanteLongitud').value;
    
    const datos = {
        titulo: document.getElementById('vacanteTitulo').value,
        descripcion: document.getElementById('vacanteDescripcion').value,
        requisitos: document.getElementById('vacanteRequisitos').value,
        salario: document.getElementById('vacanteSalario').value,
        ubicacion: document.getElementById('vacanteUbicacion').value,
        tipo_contrato: document.getElementById('vacanteTipo').value,
        estado: document.getElementById('vacanteEstado').value || 'activa',
        latitud: latitud ? parseFloat(latitud) : null,
        longitud: longitud ? parseFloat(longitud) : null
    };
    
    try {
        if (id) {
            await apiFetch('/api/vacantes/' + id, { method: 'PUT', body: JSON.stringify(datos) });
        } else {
            await apiFetch('/api/vacantes', { method: 'POST', body: JSON.stringify(datos) });
        }
        cerrarModalVacante();
        cargarVacantesEmpresa();
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        btn.disabled = false;
    }
}

async function eliminarVacante(id) {
    if (!confirm('Estas seguro de eliminar esta vacante? Se eliminaran tambien las postulaciones asociadas.')) return;
    
    try {
        await apiFetch('/api/vacantes/' + id, { method: 'DELETE' });
        cargarVacantesEmpresa();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ============================================
// Ver Postulaciones (Empresa)
// ============================================

async function verPostulaciones(vacanteId) {
    const container = document.getElementById('postulacionesLista');
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    document.getElementById('modalPostulaciones').classList.add('active');
    
    try {
        const data = await apiFetch('/api/postulaciones/vacante/' + vacanteId);
        
        if (data.postulaciones.length === 0) {
            container.innerHTML = '\
                <div class="empty-state" style="padding: 30px;">\
                    <h3>Sin postulaciones</h3>\
                    <p>Aun no hay postulaciones para esta vacante.</p>\
                </div>';
            return;
        }
        
        var html = '';
        data.postulaciones.forEach(function(p) {
            html += '\
                <div class="card" style="margin-bottom: 12px;">\
                    <div class="d-flex justify-between align-center" style="flex-wrap: wrap; gap: 8px;">\
                        <div>\
                            <strong>' + escapeHtml(p.usuario_nombre) + ' ' + escapeHtml(p.usuario_apellido) + '</strong>\
                            <div style="font-size: 0.85rem; color: var(--color-text-light);">' + escapeHtml(p.usuario_carrera || 'Sin carrera especificada') + '</div>\
                            <div style="font-size: 0.85rem; color: var(--color-text-light);">' + escapeHtml(p.usuario_email) + (p.usuario_telefono ? ' | ' + escapeHtml(p.usuario_telefono) : '') + '</div>\
                        </div>\
                        <div>' + getBadgeEstado(p.estado) + '</div>\
                    </div>\
                    ' + (p.mensaje ? '<p style="margin-top: 10px; font-size: 0.9rem; color: var(--color-text-light);">' + escapeHtml(p.mensaje) + '</p>' : '') + '\
                    <div class="d-flex gap-1 mt-2">\
                        <select class="form-control" style="width: auto; font-size: 0.8rem;" onchange="cambiarEstadoPostulacion(' + p.id + ', this.value)">\
                            <option value="pendiente"' + (p.estado === 'pendiente' ? ' selected' : '') + '>Pendiente</option>\
                            <option value="revisada"' + (p.estado === 'revisada' ? ' selected' : '') + '>Revisada</option>\
                            <option value="aceptada"' + (p.estado === 'aceptada' ? ' selected' : '') + '>Aceptada</option>\
                            <option value="rechazada"' + (p.estado === 'rechazada' ? ' selected' : '') + '>Rechazada</option>\
                        </select>\
                        <span style="font-size: 0.8rem; color: var(--color-text-light); align-self: center;">' + formatearFechaCorta(p.fecha_postulacion) + '</span>\
                    </div>\
                </div>';
        });
        
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = '<div class="alert alert-error">Error: ' + escapeHtml(error.message) + '</div>';
    }
}

function cerrarModalPostulaciones() {
    document.getElementById('modalPostulaciones').classList.remove('active');
}

async function cambiarEstadoPostulacion(id, estado) {
    try {
        await apiFetch('/api/postulaciones/' + id + '/estado', {
            method: 'PUT',
            body: JSON.stringify({ estado: estado })
        });
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
