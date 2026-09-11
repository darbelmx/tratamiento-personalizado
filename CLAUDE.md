# Grupo Bidao — Terapia Regenerativa (sitio web)

Sitio de una sola página (landing) para "Tratamiento Personalizado" de Grupo Bidao. Estilo editorial/clínico minimalista: navy + acento dorado, tipografía serif en títulos. HTML/CSS/JS puro, sin build tools ni frameworks.

## Publicación en línea

- Repo GitHub: https://github.com/darbelmx/tratamiento-personalizado (público, cuenta `darbelmx`)
- Sitio en vivo (GitHub Pages): **https://darbelmx.github.io/tratamiento-personalizado/**
- Rama publicada: `master`, carpeta raíz `/`. GitHub Pages reconstruye solo ~1 min después de cada push.
- Para publicar cambios nuevos: `git add`, `git commit`, `git push` a `origin master`. `gh` (GitHub CLI) ya está instalado y autenticado en esta máquina.

## Entorno / herramientas (IMPORTANTE)

- **El tool Bash está roto en este entorno** (falla siempre con errores `dofork`/`Resource temporarily unavailable`). Usar **PowerShell** para todo lo que sería shell/git/gh.
- No es raro que el PATH de `gh`/otras herramientas recién instaladas no esté cargado en la sesión de PowerShell; refrescar con:
  ```powershell
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
  ```
- Para verificación visual: `msedge.exe --headless=new --screenshot=...` contra un `python -m http.server` local. El primer intento después de levantar un server nuevo suele fallar (proceso `msedge` colgado con el lock del profile) — la solución es siempre `Get-Process msedge | Stop-Process -Force`, esperar 2s, y reintentar la misma captura; funciona a la segunda.
- Para forzar scroll a una sección concreta antes de capturar (ya que `--screenshot` no respeta bien anchors/scroll), usar un wrapper HTML mismo-origen con `<iframe src="index.html">` + `scrollTo` por JS.
- Scripts de validación (viven en el scratchpad de la sesión, no en el repo): `check.py` (estructura HTML, anchors, ids, integridad JS) y `css_check.py` (balance de llaves CSS, clases huérfanas). Correr después de cualquier edición.

## Estructura de archivos

```
index.html
css/styles.css
js/script.js       (IIFE: reveal-on-scroll, nav móvil, año footer, form)
js/explorer.js      (IIFE: explorador de padecimientos, 3 niveles)
assets/img/         (logo-icon.png, hero-bg.jpg, section-bg.jpg, imágenes de tarjetas)
```

## Orden actual de secciones (top → bottom)

1. Hero (`.hero`)
2. "Antes de empezar" — sin `id`, `.section-alt` — 6 imágenes-botón (grid 3×2) con hipervínculos a las 6 secciones siguientes
3. `#que-es` (`.section-bg`) — "Qué significa personalizado"
4. `#objetivos` (`.section-alt`) — "Alcance y objetivos"
5. `#padecimientos` (`.section-bg`) — explorador interactivo de áreas/padecimientos
6. `#tejidos` (`.section-alt`) — "Sistema inmunológico y componentes" (fusión de dos secciones antiguas)
7. `#proceso` (`.section-bg`) — "De tu caso al tratamiento" (stepper de 5 pasos)
8. `#tecnologias` (`.section-alt`) — "Cómo está construido" (tarjetas con imagen full-bleed)
9. Comparativa — sin `id`, `.section-bg` — "Dos formas de tratar"
10. `#cta-final` — formulario de contacto (fondo propio en gradiente, sin clase alt/bg)
11. `#preguntas` (`.section-alt`) — FAQ (accordion), última sección de contenido
12. Footer

**Regla fija de fondos**: después del hero, alternar estrictamente `section-bg` (textura foto sutil) / `section-alt` (`--surface-2`, azul hielo `#EAF4FB`) sección por sección. Cualquier reordenamiento futuro debe respetar esta alternancia.

## Navegación

Header y menú móvil muestran **solo** las 6 preguntas de "Antes de empezar" (mismos labels e hipervínculos que las 6 imágenes de esa sección):
`qué es → #que-es` · `para quién es → #objetivos` · `para qué sirve → #padecimientos` · `cómo funciona → #tejidos` · `cómo es el tratamiento → #proceso` · `cómo está hecho → #tecnologias`

Footer nav es independiente y no se tocó (apunta a `#que-es`/`#tecnologias`/`#padecimientos`/`#tejidos`/`#preguntas`).

## Sistema de diseño

- Tokens CSS en `:root` (`css/styles.css`): colores (navy, dorado/`--gold-ink`, `--surface-2`, `--border-strong`), espaciados, radios (`--r-md`/`--r-lg`), sombras (`--sh-1`/`--sh-2`), easings (`--ease`, `--ease-soft`).
- **Sin modo oscuro** (se eliminó por completo a petición del usuario) y **sin login/registro** (se quitaron "Acceder"/"Crear cuenta", `login.html`, `registro.html`, `auth.css`, `auth.js`).
- Componente reutilizable **"quote-line"**: frase itálica serif centrada con línea delgada arriba y abajo (`::before`/`::after`, gradiente `linear-gradient(90deg, transparent, var(--border-strong), transparent)`). Implementado en `.hero-quote` (referencia original), `.pull-quote`, `.section-closer`, `.comparison-note`. **Todas las secciones de contenido ya tienen una frase de cierre en este estilo** — si se agrega una sección nueva, debe llevar una también, en el mismo tono (hedged, "acompañar"/"apoyar", sin afirmaciones curativas).
- `.card .card-eyebrow`: texto dorado, **no itálico** (se quitó la itálica a petición explícita del usuario — "distorsiona la lectura"). Ojo con especificidad CSS: usar selectores de 2 clases (`.card .card-eyebrow`), no uno solo, porque `.card p` puede pisarlo.
- `.tech-card`: imagen full-bleed arriba (`.tech-card-media`, `object-fit:cover`) + cuerpo con eyebrow/título/texto abajo (`.tech-card-body`). No usar el patrón viejo de icon-box pequeño.
- `.badge-images` (sección "Antes de empezar"): 6 `<a><img></a>`, grid 3×2, `aspect-ratio:8/9; object-fit:contain`, hover con borde dorado (`box-shadow: 0 0 0 3px var(--gold)`). Los PNG de origen fueron auto-recortados a su bounding box de contenido (alpha channel) para uniformar tamaños tras una edición manual del usuario — si el usuario vuelve a editar/reemplazar estas imágenes y quedan desalineadas, repetir ese recorte antes de tocar CSS.

## Explorador de padecimientos (`js/explorer.js`)

3 niveles: Área → Subcategoría → Padecimiento (pills). Datos en un array `DATA` dentro del IIFE (5 áreas: Inmuno-Oncología, Enfermedades Autoinmunes, Sistema Inmunológico, Medicina Regenerativa y Musculoesquelética, Neuroendocrino y Metabólico).

**Caso especial**: si un área tiene una sola subcategoría (hoy solo Inmuno-Oncología), se salta el nivel 2 y el clic en la tarjeta de área va directo a nivel 3 (lista de padecimientos), para no obligar un clic redundante. El breadcrumb y los botones "Regresar"/"Ver otras categorías" ya contemplan este caso (vuelven a nivel 1 en vez de a un nivel 2 inexistente).

## Contenido — restricciones importantes

- **Nunca inventar afirmaciones médicas** (efectos secundarios, contraindicaciones, tasas de éxito, curaciones). El usuario ha sido explícito: si falta un dato médico (p. ej. una respuesta de FAQ), pedírselo, no redactarlo.
- Tono general: "coadyuvante", "apoyo", "puede considerarse", "según valoración médica" — nunca lenguaje curativo/garantista.

## Pendiente (abierto, esperando al usuario)

- FAQ: el usuario pidió agregar "¿El tratamiento tiene efectos secundarios o contraindicaciones?" pero **no dio el texto de la respuesta**. No se agregó. Falta que el usuario proporcione la respuesta para incluirla en el accordion de `#preguntas` (mismo formato que las demás: `<details>`/ítem con id `faq-15` siguiendo la numeración existente hasta `faq-14`).
