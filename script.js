const sheetId = '1aBcD_ExAmPlE1234567'; // reemplaza con tu ID
const sheetName = 'Hoja1'; // nombre de la hoja en Google Sheets
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

let banners = [];

// Cargar datos desde Google Sheets
fetch(url)
  .then(res => res.text())
  .then(rep => {
    const jsonData = JSON.parse(rep.substr(47).slice(0, -2)); // formatear JSON
    banners = jsonData.table.rows.map(r => ({
      id: r.c[0].v,
      imagen: r.c[1].v,
      texto: r.c[2].v,
      cta: r.c[3].v,
      region: r.c[4].v,
      ponderacion: r.c[5].v
    }));
    mostrarBanner("CDMX"); // banner inicial
  });

// Función para mostrar banner según región
function mostrarBanner(region) {
  const candidatos = banners.filter(b => b.region === region);

  if (candidatos.length === 0) {
    document.getElementById("banner").innerHTML = "<p>No hay publicidad para esta región.</p>";
    return;
  }

  // Selección según ponderación
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

// Cambiar banner al seleccionar región
document.getElementById("region").addEventListener("change", (e) => {
  mostrarBanner(e.target.value);
});
