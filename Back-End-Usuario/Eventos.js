document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector(".page-content");

  fetch("../Back-End-PHP/obtenerEventos.php")
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) {
        main.insertAdjacentHTML("beforeend", "<p>No hay eventos disponibles.</p>");
        return;
      }

      data.forEach(evento => {
        let colorFondo = "#f9f9f9";
        if (evento.actividad.toLowerCase().includes("fútbol")) colorFondo = "#d1e7ff";
        if (evento.actividad.toLowerCase().includes("natación")) colorFondo = "#d4edda";

        const tarjeta = document.createElement("div");
        tarjeta.className = "evento-card";
        tarjeta.style.backgroundColor = colorFondo;
        tarjeta.style.margin = "10px 0";
        tarjeta.style.padding = "15px";
        tarjeta.style.border = "1px solid #ccc";
        tarjeta.style.borderRadius = "8px";
        tarjeta.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";

        tarjeta.innerHTML = `
          <h2>${evento.nombre}</h2>
          <p><strong>Actividad:</strong> ${evento.actividad}</p>
          <p><strong>Descripción:</strong> ${evento.descripcion}</p>
          <p><strong>Fecha:</strong> ${evento.fecha}</p>
          <p><strong>Lugar:</strong> ${evento.lugar}</p>
        `;

        tarjeta.style.cursor = "pointer";
        tarjeta.onclick = () => window.location.href = "actividades.html";

        main.appendChild(tarjeta);
      });
    })
    .catch(err => {
      console.error("Error al cargar los eventos:", err);
      main.insertAdjacentHTML("beforeend", "<p style='color:red;'>No se pudieron cargar los eventos.</p>");
    });
});
