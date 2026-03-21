// ============================================
// Auth (Login, Registro)
// ============================================

function cambiarTipoLogin(btn) {
    document.querySelectorAll('.auth-tab').forEach(function(tab) {
        tab.classList.remove('active');
    });
    btn.classList.add('active');
    document.getElementById('tipoLogin').value = btn.dataset.tipo;
}

async function handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('btnLogin');
    btn.disabled = true;
    btn.textContent = 'Iniciando sesion...';

    try {
        const data = await apiFetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                tipo: document.getElementById('tipoLogin').value
            })
        });

        mostrarAlerta('alertContainer', data.mensaje, 'success');
        setTimeout(function() {
            window.location.href = '/dashboard.html';
        }, 500);
    } catch (error) {
        mostrarAlerta('alertContainer', error.message, 'error');
        btn.disabled = false;
        btn.textContent = 'Iniciar Sesion';
    }
}

async function handleRegistroUsuario(e) {
    e.preventDefault();
    const btn = document.getElementById('btnRegistro');
    btn.disabled = true;
    btn.textContent = 'Registrando...';

    try {
        const data = await apiFetch('/api/auth/registro/usuario', {
            method: 'POST',
            body: JSON.stringify({
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apellido').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                telefono: document.getElementById('telefono').value,
                carrera: document.getElementById('carrera').value
            })
        });

        mostrarAlerta('alertContainer', data.mensaje, 'success');
        setTimeout(function() {
            window.location.href = '/login.html';
        }, 1500);
    } catch (error) {
        mostrarAlerta('alertContainer', error.message, 'error');
        btn.disabled = false;
        btn.textContent = 'Crear Cuenta';
    }
}

async function handleRegistroEmpresa(e) {
    e.preventDefault();
    const btn = document.getElementById('btnRegistro');
    btn.disabled = true;
    btn.textContent = 'Registrando...';

    try {
        const data = await apiFetch('/api/auth/registro/empresa', {
            method: 'POST',
            body: JSON.stringify({
                nombre: document.getElementById('nombre').value,
                descripcion: document.getElementById('descripcion').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                telefono: document.getElementById('telefono').value,
                direccion: document.getElementById('direccion').value,
                sitio_web: document.getElementById('sitio_web').value
            })
        });

        mostrarAlerta('alertContainer', data.mensaje, 'success');
        setTimeout(function() {
            window.location.href = '/login.html';
        }, 1500);
    } catch (error) {
        mostrarAlerta('alertContainer', error.message, 'error');
        btn.disabled = false;
        btn.textContent = 'Registrar Empresa';
    }
}
