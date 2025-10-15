let modoEdicion = false;
let eventoEditandoId = null;

// Verificar sesión y cargar datos al iniciar
window.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
    cargarActividades();
    cargarEventos();
});

function verificarSesion() {
    fetch('../Back-End-Admin/verificarSesion.php')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedin) {
                window.location.href = '../Front-End-Usuario/login.html'; // ✅ CORREGIDO
            }
        })
        .catch(() => {
            window.location.href = '../Front-End-Usuario/login.html'; // ✅ CORREGIDO
        });
}

// Cargar tipos de actividades para el select
function cargarActividades() {
    fetch('../Back-End-PHP/obtenerActividades.php')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('evento-actividad');
            select.innerHTML = '<option value="">Selecciona una actividad</option>';
            
            if (data.success && data.actividades.length > 0) {
                data.actividades.forEach(act => {
                    const option = document.createElement('option');
                    option.value = act.nombre;
                    option.textContent = act.nombre;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar actividades:', error));
}

// Cargar todos los eventos
function cargarEventos() {
    fetch('../Back-End-PHP/obtenerEventos.php')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.eventos.length > 0) {
                mostrarEventos(data.eventos);
            } else {
                document.getElementById('lista-eventos').innerHTML = 
                    '<p style="text-align: center; color: #666;">No hay eventos registrados</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('lista-eventos').innerHTML = 
                '<p style="text-align: center; color: red;">Error al cargar eventos</p>';
        });
}

// Mostrar eventos en tarjetas
function mostrarEventos(eventos) {
    const container = document.getElementById('lista-eventos');
    container.innerHTML = '';
    
    eventos.forEach(evento => {
        const card = document.createElement('div');
        card.style.cssText = 'background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-left: 4px solid #003366;';
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 10px 0; color: #003366;">${evento.nombre}</h3>
                    <p style="margin: 5px 0; color: #666;"><strong>Descripción:</strong> ${evento.descripcion}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Fecha:</strong> ${formatearFecha(evento.fecha)}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Lugar:</strong> ${evento.lugar}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Actividad:</strong> ${evento.actividad}</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="editarEvento(${evento.id})" 
                            style="padding: 8px 15px; background: #ffc107; color: #333; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        ✏️ Editar
                    </button>
                    <button onclick="eliminarEvento(${evento.id}, '${evento.nombre}')" 
                            style="padding: 8px 15px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-MX', opciones);
}

// Abrir modal para crear nuevo evento
document.getElementById('btnNuevoEvento').addEventListener('click', () => {
    modoEdicion = false;
    eventoEditandoId = null;
    document.getElementById('tituloModal').textContent = 'Crear Nuevo Evento';
    document.getElementById('formEvento').reset();
    document.getElementById('evento-id').value = '';
    document.getElementById('modalEvento').style.display = 'flex';
});

// Cerrar modal
document.getElementById('btnCancelar').addEventListener('click', () => {
    document.getElementById('modalEvento').style.display = 'none';
});

// Editar evento
function editarEvento(id) {
    modoEdicion = true;
    eventoEditandoId = id;
    
    // Buscar el evento en la lista actual
    fetch(`../Back-End-PHP/obtenerEventos.php`)
        .then(response => response.json())
        .then(data => {
            const evento = data.eventos.find(e => e.id == id);
            
            if (evento) {
                document.getElementById('tituloModal').textContent = 'Editar Evento';
                document.getElementById('evento-id').value = evento.id;
                document.getElementById('evento-nombre').value = evento.nombre;
                document.getElementById('evento-descripcion').value = evento.descripcion;
                document.getElementById('evento-fecha').value = evento.fecha;
                document.getElementById('evento-lugar').value = evento.lugar;
                document.getElementById('evento-actividad').value = evento.actividad;
                
                document.getElementById('modalEvento').style.display = 'flex';
            }
        })
        .catch(error => console.error('Error:', error));
}

// Eliminar evento
function eliminarEvento(id, nombre) {
    if (!confirm(`¿Estás seguro de eliminar el evento "${nombre}"?`)) {
        return;
    }
    
    const formData = new FormData();
    formData.append('id', id);
    
    fetch('../Back-End-Admin/eliminarEvento.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        mostrarMensaje(data.mensaje, data.success ? 'success' : 'error');
        
        if (data.success) {
            cargarEventos();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Error al eliminar evento', 'error');
    });
}

// Guardar evento (crear o editar)
document.getElementById('formEvento').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const btnSubmit = e.target.querySelector('button[type="submit"]');
    
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Guardando...';
    
    const url = modoEdicion ? 
        '../Back-End-Admin/editarEvento.php' : 
        '../Back-End-Admin/crearEvento.php';
    
    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        mostrarMensaje(data.mensaje, data.success ? 'success' : 'error');
        
        if (data.success) {
            document.getElementById('modalEvento').style.display = 'none';
            cargarEventos();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Error al guardar evento', 'error');
    })
    .finally(() => {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Guardar';
    });
});

// Mostrar mensaje de respuesta
function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje-respuesta');
    mensajeDiv.textContent = texto;
    mensajeDiv.style.display = 'block';
    
    if (tipo === 'success') {
        mensajeDiv.style.backgroundColor = '#d4edda';
        mensajeDiv.style.color = '#155724';
        mensajeDiv.style.border = '1px solid #c3e6cb';
    } else {
        mensajeDiv.style.backgroundColor = '#f8d7da';
        mensajeDiv.style.color = '#721c24';
        mensajeDiv.style.border = '1px solid #f5c6cb';
    }
    
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 5000);
}

// Cerrar sesión
document.getElementById('btnCerrarSesion').addEventListener('click', () => {
    if (confirm('¿Cerrar sesión?')) {
        fetch('../Back-End-Admin/cerrarSesion.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.removeItem('usuarioLogeado'); // Limpiar localStorage
                    window.location.href = '../Front-End-Usuario/login.html'; // ✅ CORREGIDO
                }
            });
    }
});