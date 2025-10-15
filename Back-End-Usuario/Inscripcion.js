document.addEventListener("DOMContentLoaded", () => {
    // Agregar botones de inscripción a cada evento
    agregarBotonesInscripcion();
});

function agregarBotonesInscripcion() {
    const tarjetasEvento = document.querySelectorAll('.evento-card');
    
    tarjetasEvento.forEach((tarjeta, index) => {
        const btnInscribir = document.createElement('button');
        btnInscribir.textContent = 'Inscribirse';
        btnInscribir.className = 'btn-inscribir';
        btnInscribir.style.backgroundColor = '#007bff';
        btnInscribir.style.color = 'white';
        btnInscribir.style.padding = '10px 20px';
        btnInscribir.style.border = 'none';
        btnInscribir.style.borderRadius = '5px';
        btnInscribir.style.cursor = 'pointer';
        btnInscribir.style.marginTop = '10px';
        
        btnInscribir.addEventListener('click', () => {
            mostrarFormularioInscripcion(index);
        });
        
        tarjeta.appendChild(btnInscribir);
    });
}

function mostrarFormularioInscripcion(eventoId) {
    // Crear modal/formulario de inscripción
    const modal = document.createElement('div');
    modal.id = 'modal-inscripcion';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%;">
            <h2>Inscribirse al Evento</h2>
            <form id="formInscripcion">
                <div style="margin: 15px 0;">
                    <label style="display: block; margin-bottom: 5px;">Nombre completo:</label>
                    <input type="text" name="nombre" required 
                           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                <div style="margin: 15px 0;">
                    <label style="display: block; margin-bottom: 5px;">Correo electrónico:</label>
                    <input type="email" name="correo" required 
                           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                <div style="margin: 15px 0;">
                    <label style="display: block; margin-bottom: 5px;">Teléfono:</label>
                    <input type="tel" name="telefono" required 
                           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                <input type="hidden" name="evento_id" value="${eventoId}">
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button type="submit" 
                            style="flex: 1; padding: 10px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Inscribirse
                    </button>
                    <button type="button" id="btnCerrarModal" 
                            style="flex: 1; padding: 10px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal
    document.getElementById('btnCerrarModal').addEventListener('click', () => {
        modal.remove();
    });
    
    // Enviar inscripción
    document.getElementById('formInscripcion').addEventListener('submit', (e) => {
        e.preventDefault();
        enviarInscripcion(e.target, modal);
    });
}

function enviarInscripcion(form, modal) {
    const formData = new FormData(form);
    const btnEnviar = form.querySelector('button[type="submit"]');
    
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';
    
    fetch('../Back-End-PHP/inscribirEvento.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.mensaje);
            modal.remove();
        } else {
            alert(data.mensaje);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al procesar la inscripción. Intenta de nuevo.');
    })
    .finally(() => {
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Inscribirse';
    });
}