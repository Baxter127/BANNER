// URL base de tu Google Sheets en formato CSV
const baseUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7s2i7Ntt_hHKjayaDy58Joj8HO1deKznbBXfFiWMchrEfhIQc_RM-y8lWATAVlI36ya-5iiXGG1BY/pub?output=csv";

// Función para parsear CSV de forma segura
function csvToJson(csv) {
    const rows = csv.trim().split("\n");
    rows.shift(); // quitar encabezado

    return rows
        .filter(r => r.trim() !== "")
        .map(row => {
            // Dividir usando regex para respetar comas dentro de comillas
            const cols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];

            return {
                imagen: cols[1]?.replace(/"/g, "") || "", 
                titulo: cols[2]?.replace(/"/g, "") || "",
                condicion: cols[3]?.replace(/"/g, "") || "",
                boton: cols[4]?.replace(/"/g, "") || "",
                cta: cols[5]?.replace(/"/g, "") || "",
                cinta: cols[6]?.replace(/"/g, "") || "",
                onoff: (cols[7] || "").toLowerCase().trim()
            };
        });
}

async function cargarBanner() {
    try {
        const csvUrl = `${baseUrl}&t=${Date.now()}`; // Evitar cache
        const res = await fetch(csvUrl, { cache: "no-store" });
        const csvData = await res.text();
        const data = csvToJson(csvData);

        // Filtrar solo los "on"
        const activos = data.filter(b => b.onoff === "on");

        const banner = document.getElementById("banner");
        banner.innerHTML = ""; // Limpiar cualquier contenido previo

        if (activos.length === 0) {
            banner.innerHTML = "<p>No hay publicidad activa.</p>";
            return;
        }

        // Tomar solo el último activo para consistencia
        const seleccionado = activos[activos.length - 1];

        // Renderizar banner HTML
        banner.innerHTML = `
            <img src="${seleccionado.imagen}" alt="banner">
            <div class="contenido">
                <h1>${seleccionado.titulo}</h1>
                <p>${seleccionado.condicion}</p>
                <a href="${seleccionado.cta}" target="_blank" class="cta">${seleccionado.boton}</a>
            </div>
            ${seleccionado.cinta ? `<div class="cinta">${seleccionado.cinta}</div>` : ""}
        `;

    } catch (error) {
        console.error("Error cargando el banner:", error);
        document.getElementById("banner").innerHTML = "<p>Error al cargar datos.</p>";
    }
}

document.addEventListener("DOMContentLoaded", cargarBanner);