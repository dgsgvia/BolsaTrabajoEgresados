// ============================================
// Vacante Detalle Page
// ============================================

let vacanteActual = null;
let sesionActual = null;
let mapDisplay = null;
let mapDisplayMarker = null;

// ============================================
// Google Maps Display Functions
// ============================================
function initMapDisplay() {
    // Map will be initialized when vacancy is loaded
}

function initializeMapDisplay(lat, lng) {
    const mapContainer = document.getElementById('mapDisplay');
    if (!mapContainer) return;
    
    const location = { lat: parseFloat(lat), lng: parseFloat(lng) };
    
    mapDisplay = new google.maps.Map(mapContainer, {
        center: location,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false
    });
    
    mapDisplayMarker = new google.maps.Marker({
        position: location,
        map: mapDisplay,
        title: vacanteActual ? vacanteActual.titulo : 'Ubicacion del trabajo'
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    await renderNavbar('mainNavbar');
    sesionActual = await verificarSesion();
    
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    if (!id) {
        window.location.href = '/vacantes.html';
        return;
    }
    
    cargarVacante(id);
});

async function cargarVacante(id) {
    const container = document.getElementById('vacanteDetalle');
    
    try {
        vacanteActual = await apiFetch('/api/vacantes/' + id);
        
        let botonPostularse = '';
        
        if (sesionActual.autenticado && sesionActual.usuario.tipo === 'usuario') {
            try {
                const check = await apiFetch('/api/postulaciones/verificar/' + id);
                if (check.postulado) {
                    botonPostularse = '<button class="btn btn-secondary btn-lg" disabled>Ya te postulaste ' + getBadgeEstado(check.postulacion.estado) + '</button>';
                } else if (vacanteActual.estado === 'activa') {
                    botonPostularse = '<button class="btn btn-primary btn-lg" onclick="abrirModalPostulacion()">Postularse a esta vacante</button>';
                }
            } catch (e) {
                if (vacanteActual.estado === 'activa') {
                    botonPostularse = '<button class="btn btn-primary btn-lg" onclick="abrirModalPostulacion()">Postularse a esta vacante</button>';
                }
            }
        } else if (!sesionActual.autenticado) {
            botonPostularse = '<a href="/login.html" class="btn btn-primary btn-lg">Inicia sesion para postularte</a>';
        }
        
        container.innerHTML = '\
            <a href="/vacantes.html" style="display: inline-flex; align-items: center; gap: 6px; color: var(--color-text-light); font-size: 0.9rem; margin-bottom: 16px;">\
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>\
                Volver a vacantes\
            </a>\
            <div class="card">\
                <div class="d-flex justify-between align-center" style="flex-wrap: wrap; gap: 12px;">\
                    <div>\
                        <h1>' + escapeHtml(vacanteActual.titulo) + '</h1>\
                        <div class="empresa-info">\
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>\
                            ' + escapeHtml(vacanteActual.empresa_nombre) + '\
                        </div>\
                    </div>\
                    <div>' + getBadgeEstado(vacanteActual.estado) + '</div>\
                </div>\
                \
                <div class="card-meta">\
                    ' + (vacanteActual.ubicacion ? '<div class="card-meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' + escapeHtml(vacanteActual.ubicacion) + '</div>' : '') + '\
                    ' + (vacanteActual.salario ? '<div class="card-meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' + escapeHtml(vacanteActual.salario) + '</div>' : '') + '\
                    <div class="card-meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>' + escapeHtml(vacanteActual.tipo_contrato) + '</div>\
                    <div class="card-meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' + formatearFecha(vacanteActual.fecha_publicacion) + '</div>\
                </div>\
                \
                <div class="seccion">\
                    <h3>Descripcion del puesto</h3>\
                    <p>' + escapeHtml(vacanteActual.descripcion) + '</p>\
                </div>\
                \
                ' + (vacanteActual.requisitos ? '<div class="seccion"><h3>Requisitos</h3><p>' + escapeHtml(vacanteActual.requisitos) + '</p></div>' : '') + '\
                \
                ' + (vacanteActual.empresa_descripcion ? '<div class="seccion"><h3>Acerca de ' + escapeHtml(vacanteActual.empresa_nombre) + '</h3><p>' + escapeHtml(vacanteActual.empresa_descripcion) + '</p>' + (vacanteActual.empresa_sitio_web ? '<p class="mt-1"><a href="' + escapeHtml(vacanteActual.empresa_sitio_web) + '" target="_blank">' + escapeHtml(vacanteActual.empresa_sitio_web) + '</a></p>' : '') + '</div>' : '') + '\
                \
                ' + (vacanteActual.latitud && vacanteActual.longitud ? '<div class="seccion"><h3>Ubicacion del trabajo</h3><div id="mapDisplay" style="width: 100%; height: 300px; border-radius: 8px; border: 1px solid var(--color-border);"></div></div>' : '') + '\
                \
                <div class="mt-3">' + botonPostularse + '</div>\
            </div>';
        
        // Initialize map if coordinates exist
        if (vacanteActual.latitud && vacanteActual.longitud) {
            setTimeout(function() {
                if (typeof google !== 'undefined' && google.maps) {
                    initializeMapDisplay(vacanteActual.latitud, vacanteActual.longitud);
                }
            }, 100);
        }
            
    } catch (error) {
        container.innerHTML = '\
            <div class="empty-state">\
                <h3>Vacante no encontrada</h3>\
                <p>La vacante que buscas no existe o ha sido eliminada.</p>\
                <a href="/vacantes.html" class="btn btn-primary">Ver vacantes</a>\
            </div>';
    }
}

function abrirModalPostulacion() {
    document.getElementById('modalPostulacion').classList.add('active');
}

function cerrarModal() {
    document.getElementById('modalPostulacion').classList.remove('active');
}

async function enviarPostulacion(e) {
    e.preventDefault();
    const btn = document.getElementById('btnPostular');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
        const mensajePostulacion = document.getElementById('mensajePostulacion').value;
        
        await apiFetch('/api/postulaciones', {
            method: 'POST',
            body: JSON.stringify({
                vacante_id: vacanteActual.id,
                mensaje: mensajePostulacion
            })
        });
        
        // Send email notification via EmailJS
        await enviarEmailNotificacion(mensajePostulacion);
        
        cerrarModal();
        cargarVacante(vacanteActual.id);
    } catch (error) {
        alert(error.message);
        btn.disabled = false;
        btn.textContent = 'Enviar Postulacion';
    }
}

// ============================================
// EmailJS Integration
// ============================================
async function enviarEmailNotificacion(mensajeAdicional) {
    try {
        // Get user info from session
        const sesion = await verificarSesion();
        if (!sesion.autenticado || !sesion.usuario) {
            console.log('Usuario no autenticado, no se enviara email');
            return;
        }
        
        const usuario = sesion.usuario;

        console.log(usuario);
        
        // Prepare email parameters
        const templateParams = {
            to_email: vacanteActual.empresa_email || '',
            empresa_nombre: vacanteActual.empresa_nombre || '',
            egresado_nombre: usuario.nombre + (usuario.apellido ? ' ' + usuario.apellido : ''),
            egresado_email: usuario.email || '',
            vacante_titulo: vacanteActual.titulo || '',
            vacante_id: vacanteActual.id || '',
            mensaje: mensajeAdicional || 'Sin mensaje adicional',
        };
        console.log(templateParams);
        
        // Send email using EmailJS
        // Replace EMAILJS_SERVICE_ID_HERE and EMAILJS_TEMPLATE_ID_HERE with your actual IDs
        await emailjs.send(
            'service_wa1l6so',
            'template_k9rqwol',
            templateParams
        );
        
        console.log('Email de notificacion enviado exitosamente');
    } catch (error) {
        // Don't block the application if email fails, just log the error
        console.error('Error al enviar email de notificacion:', error);
    }
}
