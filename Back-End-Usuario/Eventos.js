document.addEventListener("DOMContentLoaded", () => {
  fetch("../Back-End-PHP/obtenerEventos.php")
    .then(response => response.json())
    .then(data => {
      const main = document.querySelector(".page-content");
      main.innerHTML = "<h1>Eventos Deportivos</h1>";

      if (!data || data.length === 0) {
        main.innerHTML += "<p>No hay eventos disponibles.</p>";
        return;
      }

      data.forEach(evento => {
        // determinar URL y color
        let urlDestino = "actividades.html"; // default
        let colorFondo = "#f9f9f9";

        switch(evento.activityType.toLowerCase()) {
          case "torneo":
            urlDestino = "torneos.html";
            colorFondo = "#d1e7ff"; // azul
            break;
          case "carrera":
            urlDestino = "actividades.html";
            colorFondo = "#d4edda"; // verde
            break;
        }

        // crear tarjeta
        const tarjeta = document.createElement("div");
        tarjeta.className = "evento-card";
        tarjeta.style.backgroundColor = colorFondo;
        tarjeta.innerHTML = `
          <h2>${evento.name}</h2>
          <p><strong>Descripción:</strong> ${evento.description}</p>
          <p><strong>Fecha:</strong> ${evento.startDate} - ${evento.endDate}</p>
          <p><strong>Lugar:</strong> ${evento.location} | <strong>Campus:</strong> ${evento.campus}</p>
          <p><strong>Deporte:</strong> ${evento.sport} | <strong>Tipo:</strong> ${evento.activityType}</p>
          <p><strong>Participantes:</strong> ${evento.participants}</p>
          <p><strong>Registro:</strong> ${evento.registrationType} | <strong>Facultades:</strong> ${evento.faculties}</p>
        `;
        
        // hacer clicable toda la tarjeta
        tarjeta.style.cursor = "pointer";
        tarjeta.onclick = () => {
          window.location.href = urlDestino;
        };

        main.appendChild(tarjeta);
      });
    })
    .catch(err => {
      console.error("Error al cargar los eventos:", err);
      const main = document.querySelector(".page-content");
      main.innerHTML += "<p style='color:red;'>No se pudieron cargar los eventos.</p>";
    });
});
