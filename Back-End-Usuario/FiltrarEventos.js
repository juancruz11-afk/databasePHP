document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const tipoQuery = params.get("tipo"); // tipo pasado desde eventos.html

  const main = document.querySelector(".page-content");
  
  // Activar navegación según página
  if (tipoQuery === "torneo" || window.location.pathname.includes("torneos.html")) {
    document.getElementById("nav-torneos").classList.add("active");
  }
  if (tipoQuery === "carrera" || window.location.pathname.includes("actividades.html")) {
    document.getElementById("nav-actividades").classList.add("active");
  }

  fetch("../Back-End-PHP/obtenerEventos.php")
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) {
        main.insertAdjacentHTML("beforeend", "<p>No hay eventos disponibles.</p>");
        return;
      }

      // Filtrar según tipo o página actual
      const filtrados = tipoQuery
        ? data.filter(e => e.actividad.toLowerCase().includes(tipoQuery))
        : data.filter(e => {
            if (window.location.pathname.includes("torneos.html")) return e.actividad.toLowerCase().includes("fútbol");
            if (window.location.pathname.includes("actividades.html")) return e.actividad.toLowerCase().includes("natación");
            return true;
          });

      if (filtrados.length === 0) {
        main.insertAdjacentHTML("beforeend", "<p>No hay eventos de este tipo.</p>");
        return;
      }

      filtrados.forEach(evento => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "evento-card";
        tarjeta.style.cursor = "pointer";
        tarjeta.style.margin = "10px 0";
        tarjeta.style.padding = "15px";
        tarjeta.style.border = "1px solid #ccc";
        tarjeta.style.borderRadius = "8px";
        tarjeta.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";

        // Colores según actividad
        if (evento.actividad.toLowerCase().includes("fútbol")) tarjeta.style.backgroundColor = "#d1e7ff";
        else if (evento.actividad.toLowerCase().includes("natación")) tarjeta.style.backgroundColor = "#d4edda";
        else tarjeta.style.backgroundColor = "#f9f9f9";

        tarjeta.innerHTML = `
          <h2>${evento.nombre}</h2>
          <p><strong>Descripción:</strong> ${evento.descripcion}</p>
          <p><strong>Fecha:</strong> ${evento.fecha}</p>
          <p><strong>Lugar:</strong> ${evento.lugar}</p>
          <p><strong>Actividad:</strong> ${evento.actividad}</p>
        `;

        main.appendChild(tarjeta);
      });
    })
    .catch(err => {
      console.error("Error al cargar los eventos:", err);
      main.insertAdjacentHTML("beforeend", "<p style='color:red;'>No se pudieron cargar los eventos.</p>");
    });
});
