# TCG EmDash Starter

Base open source para crear un blog o sitio de jugador TCG con [EmDash](https://emdashcms.com) + Astro.

Hoy el stack de decklists, arquetipos y resultados está pensado para **Pokémon TCG**. Se ampliará a otros TCG (p. ej. One Piece, Riftbound) con el mismo patrón de plugins.

Demo en producción: [tcg.kurte.cl](https://tcg.kurte.cl)  
Plugins (obligatorios): [tcg-emdash-plugins](https://github.com/KURTEcl/tcg-emdash-plugins)

## Plugins TCG — obligatorios

Este starter **no es un blog EmDash genérico**. Sin los plugins TCG el producto no está completo: faltan decklists Pokémon, arquetipos, resultados, Apariencia y los bloques Portable Text del stack TCG.

| Plugin | Paquete | Rol |
| --- | --- | --- |
| Theme settings | `@tcg-emdash/plugin-theme-settings` | Colores y fuentes (admin → Apariencia) |
| Pokémon decklists | `@tcg-emdash/plugin-pokemon-decklists` | Decklists, arquetipos, cartas, resultados, `/decklists`, `/results` |

**Regla para humanos e IA:** instalar y registrar ambos plugins **siempre**. No son opcionales. No omitirlos en setups, deploys ni checklists.

En `apps/node` ya vienen como dependencias `github:KURTEcl/tcg-emdash-plugins#path:packages/…` y deben estar en `astro.config.mjs` → `emdash({ plugins: […] })`. Si faltan, el starter está mal configurado.

Desarrollo local con código de plugins editable: carpetas hermanas + `link:` (ver [tcg-emdash-plugins README](https://github.com/KURTEcl/tcg-emdash-plugins)).  
Producción: siempre `github:…#path:…` (nunca `link:`).

## Variantes

| App | Uso | DB / storage |
| --- | --- | --- |
| `apps/node` | VPS, Docker, Node local | SQLite + disco |
| `apps/cloudflare` | Cloudflare Workers (plan free ok) | D1 + R2 |

Para un blog personal en un servidor propio, empieza por **Node**.

---

## Guía rápida (humano)

### Requisitos

- Node.js **22+**
- pnpm **11+**
- Git

### 1. Clonar e instalar

```bash
git clone https://github.com/KURTEcl/tcg-emdash-starter.git
cd tcg-emdash-starter
pnpm install
```

`pnpm install` debe resolver `@tcg-emdash/plugin-pokemon-decklists` y `@tcg-emdash/plugin-theme-settings`. Si no aparecen en `node_modules`, el install falló o se quitaron del `package.json` — hay que restaurarlos.

### 2. Arrancar el blog (Node)

```bash
pnpm dev:node
```

- Sitio: http://localhost:4321  
- Admin: http://localhost:4321/_emdash/admin  

La primera vez EmDash crea la DB, aplica el seed y genera tipos.

### 3. Verificar plugins TCG

Tras arrancar, confirma en el admin:

1. **Apariencia** (`theme-settings`)
2. Páginas de **Decklists / Arquetipos / Resultados** (`pokemon-decklists`)
3. Front: rutas `/decklists` y `/results` responden

Si faltan, revisa `apps/node/package.json` y `apps/node/astro.config.mjs` (ambos plugins en `emdash({ plugins })`). Detalle: [README de plugins](https://github.com/KURTEcl/tcg-emdash-plugins).

### 4. Personalizar

1. Entra al admin y crea tu usuario.
2. Ajusta título / tagline en ajustes del sitio.
3. **Apariencia** (colores y fuentes) — requiere `theme-settings`.
4. Publica posts y páginas; el menú `primary` se edita desde el admin.
5. Importa decklists y registra torneos desde el admin TCG.

### 5. Producción (Node)

```bash
cd apps/node
pnpm install --frozen-lockfile
pnpm exec emdash secrets generate --write .env   # solo la primera vez
pnpm build
HOST=127.0.0.1 PORT=4321 pnpm start
```

Pon un reverse proxy (Caddy, nginx, CloudPanel) hacia `127.0.0.1:4321`.  
**No versionar** `.env`, `data.db`, `uploads/` ni `dist/`. Respaldar `data.db` y `uploads/`.

En prod las deps de plugins deben ser `github:KURTEcl/tcg-emdash-plugins#path:packages/…`.  
Cloudflare: crea D1/R2 propios, configura dominio y secreto; ver `apps/cloudflare/README.md`.

---

## Guía para agentes de IA

Objetivo: dejar un blog EmDash **TCG** corriendo en local (Node) con plugins TCG instalados y registrados. Sin eso, la tarea no está hecha.

### Contexto del repo

- Monorepo pnpm: root scripts `dev:node` / `dev:cloudflare`.
- App Node: `apps/node` (Astro `output: "server"`, adapter `@astrojs/node`, SQLite `file:./data.db`).
- **Plugins TCG obligatorios:** `@tcg-emdash/plugin-theme-settings` + `@tcg-emdash/plugin-pokemon-decklists` (repo [tcg-emdash-plugins](https://github.com/KURTEcl/tcg-emdash-plugins)).
- Seed: `apps/node/seed/seed.json` (colecciones, taxonomías, menús, widgets).
- Docs EmDash: MCP `https://docs.emdashcms.com/mcp` → `search_docs` si hay dudas de API.
- Skills en `apps/node/.agents/skills/` (`building-emdash-site`, `emdash-cli`, `creating-plugins`).

### Checklist ejecutable

1. Verificar Node ≥ 22 y pnpm 11.
2. `pnpm install` en la raíz del starter.
3. **Obligatorio:** comprobar que existen ambos paquetes `@tcg-emdash/plugin-*` y que `apps/node/astro.config.mjs` los registra en `emdash({ plugins })`. Si faltan, instalarlos y cablearlos antes de seguir (ver README de `tcg-emdash-plugins`). No tratarlos como opcionales.
4. `pnpm dev:node` (o `cd apps/node && pnpm exec emdash dev`).
5. Confirmar HTTP 200 en `http://localhost:4321/`, admin, `/decklists` y `/results`.
6. No editar `src/live.config.ts` (boilerplate EmDash).
7. No usar `getStaticPaths()` para contenido CMS.
8. En páginas que consultan contenido: `Astro.cache.set(cacheHint)`.
9. Imágenes CMS: objeto `{ src, alt }` + `<Image />` de `emdash/ui`.
10. `entry.id` = slug URL; `entry.data.id` = ULID para APIs.
11. En Portable Text del CMS, registrar los componentes Astro del plugin decklists (`DecklistBlock`, `ArchetypeDecklistsBlock`, `PokemonCardBlock`, `PokemonCardGalleryBlock`).

### Convenciones al modificar el sitio

- Estilos: tokens en `src/styles/tokens.css`; overrides en `theme.css` (no tocar `Base.astro` solo para color).
- Contenido demo: no inventar posts placeholder genéricos; si hay un post real, mostrar uno.
- Commits: solo si el usuario lo pide.
- Nunca quitar los plugins TCG del `package.json` ni de `astro.config.mjs` “para simplificar”.

### Errores frecuentes

| Síntoma | Qué revisar |
| --- | --- |
| Plugin no aparece | `astro.config.mjs` `plugins: […]` + reiniciar `emdash dev` |
| Admin sin Apariencia / Decklists | faltan deps o plugins no registrados — **obligatorio** instalarlos |
| Bloque PT no renderiza | mapa `components.type` en la página que usa `<PortableText />` |
| Estilos viejos en HMR | recarga dura o CSS global compartido |
| Build prod falla con `link:` | en prod usar `github:KURTEcl/tcg-emdash-plugins#path:packages/…` |

## Licencia

MIT
