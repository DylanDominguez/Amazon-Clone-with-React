#!/usr/bin/env node
/**
 * Genera el PDF oficial de la documentación del proyecto.
 *
 * Flujo:  DOCUMENTACION.md  ->  HTML (marked)  ->  PDF (Puppeteer/Chrome)
 *
 * Uso:    npm --prefix docs run generar
 *
 * Salida: docs/pdf/Documentacion-Oficial-v<versión>.pdf
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import puppeteer from "puppeteer";

const DOCS_DIR = path.dirname(fileURLToPath(import.meta.url));
const SRC_MD = path.join(DOCS_DIR, "DOCUMENTACION.md");
const SRC_CSS = path.join(DOCS_DIR, "plantilla.css");
const OUT_DIR = path.join(DOCS_DIR, "pdf");

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Lee el front matter (bloque entre ---) y devuelve metadatos + cuerpo. */
function parseFrontMatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { meta: {}, body: raw };

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key) meta[key] = value;
  }
  return { meta, body: raw.slice(match[0].length) };
}

/**
 * Asigna ids a los encabezados h2/h3 y construye el índice.
 * El primer h1 se elimina: el título ya aparece en la portada.
 */
function procesarEncabezados(html) {
  const toc = [];
  let counter = 0;

  const sinH1 = html.replace(/<h1>[\s\S]*?<\/h1>/, "");
  const conIds = sinH1.replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (_m, level, inner) => {
      counter += 1;
      const id = `sec-${counter}`;
      const texto = inner.replace(/<[^>]+>/g, "").trim();
      toc.push({ nivel: Number(level), id, texto });
      return `<h${level} id="${id}">${inner}</h${level}>`;
    }
  );

  return { html: conIds, toc };
}

function renderIndice(toc) {
  const items = toc
    .map(
      ({ nivel, id, texto }) =>
        `<li class="${nivel === 3 ? "n3" : "n2"}"><a href="#${id}">${escapeHtml(
          texto
        )}</a></li>`
    )
    .join("\n      ");
  return `<section class="indice">
      <h2>Índice</h2>
      <ul>
      ${items}
      </ul>
    </section>`;
}

function renderPortada(meta) {
  const filas = [
    ["Versión del documento", meta.version],
    ["Fecha de emisión", meta.fecha],
    ["Estado", meta.estado],
    ["Autor", meta.autor],
    ["Contacto", meta.contacto],
    ["Audiencia", meta.audiencia],
    ["Commit documentado", meta.commit_base ? `\`${meta.commit_base}\`` : "—"],
  ]
    .map(([k, v]) => `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(v ?? "—")}</td></tr>`)
    .join("\n        ");

  return `<section class="portada">
      <div class="portada-banda">
        <div class="portada-marca">Amazon Clone</div>
        <h1 class="portada-titulo">${escapeHtml(meta.titulo ?? "Proyecto")}</h1>
        <p class="portada-subtitulo">${escapeHtml(meta.subtitulo ?? "")}</p>
      </div>
      <div class="portada-cuerpo">
        <table class="tabla-meta">
          ${filas}
        </table>
      </div>
      <div class="portada-pie">
        Documento destinado al equipo de desarrollo. La fuente de verdad es
        <strong>docs/DOCUMENTACION.md</strong>; este PDF es un entregable generado
        automáticamente.
      </div>
    </section>`;
}

async function main() {
  console.log("Leyendo documentación...");
  const [markdown, css] = await Promise.all([
    readFile(SRC_MD, "utf8"),
    readFile(SRC_CSS, "utf8"),
  ]);

  const { meta, body } = parseFrontMatter(markdown);
  const contenido = marked.parse(body, { gfm: true, breaks: false });
  const { html: contenidoHtml, toc } = procesarEncabezados(contenido);

  const documento = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(meta.titulo ?? "Documentación")}</title>
  <style>${css}</style>
</head>
<body>
  ${renderPortada(meta)}
  ${renderIndice(toc)}
  <section class="contenido">
    ${contenidoHtml}
  </section>
</body>
</html>`;

  const version = meta.version ?? "0.0.0";
  const nombreSalida = `Documentacion-Oficial-v${version}.pdf`;
  await mkdir(OUT_DIR, { recursive: true });

  console.log("Renderizando PDF con Chrome...");
  const navegador = await puppeteer.launch({ headless: true });
  try {
    const pagina = await navegador.newPage();
    await pagina.setContent(documento, { waitUntil: "networkidle0" });
    await pagina.evaluate(() => document.fonts.ready);

    const rutaSalida = path.join(OUT_DIR, nombreSalida);
    await pagina.pdf({
      path: rutaSalida,
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `<div></div>`,
      footerTemplate: `
        <div style="width:100%; font-size:7.5px; padding:0 14mm; display:flex;
                    justify-content:space-between; color:#6b7280;
                    font-family:'Segoe UI', Arial, sans-serif;">
          <span>${escapeHtml(meta.titulo ?? "")} · Documentación v${escapeHtml(version)}</span>
          <span>Página <span class="pageNumber"></span> / <span class="totalPages"></span></span>
        </div>`,
      margin: {
        top: "14mm",
        bottom: "14mm",
        left: "12mm",
        right: "12mm",
      },
    });

    console.log(`\n PDF generado: docs\\pdf\\${nombreSalida}`);
    console.log(`   Versión ${version} · ${toc.length} secciones indexadas · Fecha ${meta.fecha ?? "—"}`);
  } finally {
    await navegador.close();
  }
}

main().catch((error) => {
  console.error("Error al generar el PDF:", error);
  process.exitCode = 1;
});
