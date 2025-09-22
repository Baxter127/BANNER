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
                imagen: cols[1]?.replace(/"/g, "") || "",     
                titulo: cols[2]?.replace(/"/g, "") || "",     
                condicion: cols[3]?.replace(/"/g, "") || "",  
                boton: cols[4]?.replace(/"/g, "") || "",      
                ligaboton: cols[5]?.replace(/"/g, "") || "",  
                cta: cols[6]?.replace(/"/g, "") || "",        
                cinta: cols[7]?.replace(/"/g, "") || "",      
                ligacinta: cols[8]?.replace(/"/g, "") || "",  
                onoff: (cols[9] || "").toLowerCase().trim()   
            };
        });
}

// Función para mostrar un banner
function mostrarBanner(activos) {
    const banner = document.getElementById("banner");
    banner.innerHTML = "";

    if (activos.length === 0) {
        banner.innerHTML = "<p>No hay banners disponibles.</p>";
        return;
    }

    const seleccionado = activos[Math.floor(Math.random() * activos.length)];

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
}

// Función principal para cargar banners y rotar
async function cargarBanner() {
    try {
        const csvUrl = `${baseUrl}&t=${Date.now()}`;
        //const res = await fetch(csvUrl, { cache: "no-store" });
        const res = await fetch(csvUrl); // quitar cache: "no-store"
        const csvData = await res.text();
        const data = csvToJson(csvData);

        const activos = data.filter(b => b.onoff === "on");

        // Mostrar el primer banner inmediatamente
        mostrarBanner(activos);

        // Rotar banner cada 5 segundos (5000 ms)
        setInterval(() => {
            mostrarBanner(activos);
        }, 5000);

    } catch (error) {
        console.error("Error cargando el banner:", error);
        document.getElementById("banner").innerHTML = "<p>Error al cargar datos.</p>";
    }
}

document.addEventListener("DOMContentLoaded", cargarBanner);
