// URL base de tu Google Sheets en formato CSV
const baseUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7s2i7Ntt_hHKjayaDy58Joj8HO1deKznbBXfFiWMchrEfhIQc_RM-y8lWATAVlI36ya-5iiXGG1BY/pub?output=csv";

// Función para parsear CSV
function csvToJson(csv) {
    const rows = csv.trim().split("\n");
    rows.shift(); // quitar encabezado

    return rows
        .filter(r => r.trim() !== "")
        .map(row => {
            const cols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];

            return {
                imagen: cols[1]?.replace(/"/g, "") || "",     // Col B
                titulo: cols[2]?.replace(/"/g, "") || "",     // Col C
                condicion: cols[3]?.replace(/"/g, "") || "",  // Col D
                boton: cols[4]?.replace(/"/g, "") || "",      // Col E (texto botón)
                ligaboton: cols[5]?.replace(/"/g, "") || "",  // Col F (liga del botón)
                cta: cols[6]?.replace(/"/g, "") || "",        // Col G (link adicional)
                cinta: cols[7]?.replace(/"/g, "") || "",      // Col H
                ligacinta: cols[8]?.replace(/"/g, "") || "",  // Col I
                onoff: (cols[9] || "").toLowerCase().trim()   // Col J
            };
        });
}

async function cargarBanner() {
    try {
        const csvUrl = `${baseUrl}&t=${Date.now()}`;
        const res = await fetch(csvUrl, { cache: "no-store" });
        const csvData = await res.text();
        const data = csvToJson(csvData);

        const activos = data.filter(b => b.onoff === "on");
        const banner = document.getElementById("banner");
        banner.innerHTML = "";

        if (activos.length === 0) {
            banner.innerHTML = "<p>No hay publicidad activa.</p>";
            return;
        }

        const seleccionado = activos[activos.length - 1];

        banner.innerHTML = `
            <img src="${seleccionado.imagen}" alt="banner">
            <div class="contenido">
                <h1>${seleccionado.titulo}</h1>
                <p>${seleccionado.condicion}</p>
                <a href="${seleccionado.ligaboton || seleccionado.cta}" target="_blank" class="cta">
                    ${seleccionado.boton}
                </a>
            </div>
            ${
              seleccionado.cinta 
                ? `<div class="cinta">
                      ${
                        seleccionado.ligacinta 
                          ? `<a href="${seleccionado.ligacinta}" target="_blank" style="color:white; text-decoration:none;">${seleccionado.cinta}</a>` 
                          : seleccionado.cinta
                      }
                   </div>`
                : ""
            }
        `;
    } catch (error) {
        console.error("Error cargando el banner:", error);
        document.getElementById("banner").innerHTML = "<p>Error al cargar datos.</p>";
    }
}

document.addEventListener("DOMContentLoaded", cargarBanner);
