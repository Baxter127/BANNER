// URL de la hoja en CSV
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7s2i7Ntt_hHKjayaDy58Joj8HO1deKznbBXfFiWMchrEfhIQc_RM-y8lWATAVlI36ya-5iiXGG1BY/pub?output=csv";

let banners = [];

// Parse CSV a objetos
function parseCSV(csv) {
  const lines = csv.split("\n").filter(l => l.trim() !== "");
  return lines.slice(1).map(line => {
    const cols = line.split(",");
    return {
      id: cols[0],
      imagen: cols[1],
      texto: cols[2],
      cta: cols[3],
      region: cols[4],
      ponderacion: parseInt(cols[5]) || 1,
      estado: (cols[6] || "").trim().toLowerCase() // "on" o "off"
    };
  });
}

// Cargar datos de Sheets
fetch(csvUrl)
  .then(res => res.text())
  .then(data => {
    banners = parseCSV(data);
    // Mostrar CDMX por defecto
    mostrarBanner("CDMX");
  });

// Mostrar un banner aleatorio según región
function mostrarBanner(region) {
  // Filtramos por región y solo los que estén activos
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

  // Render del banner
  document.getElementById("banner").innerHTML = `
    <img src="${seleccionado.imagen}" alt="banner">
    <div class="texto">
      <p>${seleccionado.texto}</p>
      <a class="cta" href="${seleccionado.cta}" target="_blank">Conoce más</a>
    </div>
  `;
}
