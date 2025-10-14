document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const tipoQuery = params.get("tipo"); // tipo pasado desde eventos.html

  // activar nav según tipo o página actual
  if (tipoQuery === "torneo" || window.location.pathname.includes("torneos.html")) {
      document.getElementById("nav-torneos").classList.add("active");
  }
  if (tipoQuery === "carrera" || window.location.pathname.includes("actividades.html")) {
      document.getElementById("nav-actividades").classList.add("active");
  }

  fetch("../Back-End-PHP/obtenerEventos.php")
    .then(res => res.json())
    .then(data => {
      const main = document.querySelector(".page-content");
      
      if (!data || data.length === 0) {
        main.innerHTML += "<p>No hay eventos disponibles.</p>";
        return;
      }

      // filtrar eventos por tipo de la URL
      const filtrados = tipoQuery 
          ? data.filter(e => e.activityType.toLowerCase() === tipoQuery) 
          : data.filter(e => {
              // si entraste directo sin ?tipo=, filtra según la página
              if (window.location.pathname.includes("torneos.html")) return e.activityType.toLowerCase() === "torneo";
              if (window.location.pathname.includes("actividades.html")) return e.activityType.toLowerCase() === "carrera";
              return true; // si otra página, muestra todo
          });

      if (filtrados.length === 0) {
        main.innerHTML += "<p>No hay eventos de este tipo.</p>";
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

        // color según tipo
        if (evento.activityType.toLowerCase() === "torneo") tarjeta.style.backgroundColor = "#d1e7ff";
        else if (evento.activityType.toLowerCase() === "carrera") tarjeta.style.backgroundColor = "#d4edda";
        else tarjeta.style.backgroundColor = "#f9f9f9";

        tarjeta.innerHTML = `
          <h2>${evento.name}</h2>
          <p><strong>Descripción:</strong> ${evento.description}</p>
          <p><strong>Fecha:</strong> ${evento.startDate} - ${evento.endDate}</p>
          <p><strong>Lugar:</strong> ${evento.location}</p>
          <p><strong>Deporte:</strong> ${evento.sport}</p>
          <p><strong>Tipo:</strong> ${evento.activityType}</p>
          <p><strong>Participantes:</strong> ${evento.participants}</p>
          <p><strong>Registro:</strong> ${evento.registrationType} | <strong>Facultades:</strong> ${evento.faculties}</p>
        `;

        main.appendChild(tarjeta);
      });
    })
    .catch(err => {
      console.error("Error al cargar los eventos:", err);
      document.querySelector(".page-content").innerHTML += "<p style='color:red;'>No se pudieron cargar los eventos.</p>";
    });
});
