// URL de la hoja en CSV
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7s2i7Ntt_hHKjayaDy58Joj8HO1deKznbBXfFiWMchrEfhIQc_RM-y8lWATAVlI36ya-5iiXGG1BY/pub?output=csv";

let banners = [];

// Función para convertir CSV a objetos JS
function parseCSV(csv) {
  const lines = csv.split("\n").filter(l => l.trim() !== "");
  const headers = lines[0].split(",");

  return lines.slice(1).map(line => {
    const cols = line.split(",");
    return {
      id: cols[0],
      imagen: cols[1],
      texto: cols[2],
      cta: cols[3],
      region: cols[4],
      ponderacion: parseInt(cols[5]) || 1,
      estado: (cols[6] || "").trim().toLowerCase() // ahora espera "on" o "off"
    };
  });
}

// Cargar datos desde Google Sheets (CSV)
fetch(csvUrl)
  .then(res => res.text())
  .then(data => {
    banners = parseCSV(data);
    mostrarBanner("CDMX"); // banner inicial
  });

// Mostrar banner según región y ponderación
function mostrarBanner(region) {
  // Filtramos por región y solo los que estén "on"
  const candidatos = banners.filter(b => b.region === region && b.estado === "on");

  if (candidatos.length === 0) {
    document.getElementById("banner").innerHTML = "<p>No hay publicidad activa para esta región.</p>";
    return;
  }

  // Selección aleatoria con ponderación
  let total = candidatos.reduce((sum, b) => sum + b.ponderacion, 0);
  let rand = Math.random() * total;
  let seleccionado;

  for (let b of candidatos) {
    if (rand < b.ponderacion) {
      seleccionado = b;
      break;
    }
    rand -= b.ponderacion;
  }

  document.getElementById("banner").innerHTML = `
    <img src="${seleccionado.imagen}" alt="banner">
    <div class="texto">
      <p>${seleccionado.texto}</p>
      <a class="cta" href="${seleccionado.cta}" target="_blank">Conoce más</a>
    </div>
  `;
}

// Evento al cambiar región
document.getElementById("region").addEventListener("change", e => {
  mostrarBanner(e.target.value);
});

// 🔄 Mostrar aleatorio cada vez que recargues la página
window.onload = () => {
  const region = document.getElementById("region").value;
  mostrarBanner(region);
};
