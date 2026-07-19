# TCG EmDash Starter

Base open source para crear un blog o sitio de jugador TCG con [EmDash](https://emdashcms.com) + Astro.

Demo en producción: [tcg.kurte.cl](https://tcg.kurte.cl)  
Plugins: [tcg-emdash-plugins](https://github.com/KURTEcl/tcg-emdash-plugins)

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

### 2. Arrancar el blog (Node)

```bash
pnpm dev:node
```

- Sitio: http://localhost:4321  
- Admin: http://localhost:4321/_emdash/admin  

La primera vez EmDash crea la DB, aplica el seed y genera tipos.

### 3. (Opcional) Añadir plugins TCG

En otra carpeta hermana (o submodule):

```bash
git clone https://github.com/KURTEcl/tcg-emdash-plugins.git ../tcg-emdash-plugins
```

Sigue la guía en el README de plugins para registrar `theme-settings` y `pokemon-decklists` en `apps/node`.

### 4. Personalizar

1. Entra al admin y crea tu usuario.
2. Ajusta título / tagline en ajustes del sitio.
3. Si instalaste `theme-settings`: **Apariencia** (colores y fuentes).
4. Publica posts y páginas; el menú `primary` se edita desde el admin.

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

Cloudflare: crea D1/R2 propios, configura dominio y secreto; ver `apps/cloudflare/README.md`.

---

## Guía para agentes de IA

Objetivo: dejar un blog EmDash TCG corriendo en local (Node) con el menor número de pasos.

### Contexto del repo

- Monorepo pnpm: root scripts `dev:node` / `dev:cloudflare`.
- App Node: `apps/node` (Astro `output: "server"`, adapter `@astrojs/node`, SQLite `file:./data.db`).
- Seed: `apps/node/seed/seed.json` (colecciones, taxonomías, menús, widgets).
- Docs EmDash: MCP `https://docs.emdashcms.com/mcp` → `search_docs` si hay dudas de API.
- Skills en `apps/node/.agents/skills/` (`building-emdash-site`, `emdash-cli`, `creating-plugins`).

### Checklist ejecutable

1. Verificar Node ≥ 22 y pnpm 11.
2. `pnpm install` en la raíz del starter.
3. `pnpm dev:node` (o `cd apps/node && pnpm exec emdash dev`).
4. Confirmar HTTP 200 en `http://localhost:4321/` y admin en `/_emdash/admin`.
5. Si el usuario pide plugins TCG:
   - Clonar/usar `tcg-emdash-plugins` al lado del starter.
   - Seguir `../tcg-emdash-plugins/README.md` (dependencias `link:` o `github:…#path:…`, plugins en `astro.config.mjs`, bloques en páginas Portable Text).
6. No editar `src/live.config.ts` (boilerplate EmDash).
7. No usar `getStaticPaths()` para contenido CMS.
8. En páginas que consultan contenido: `Astro.cache.set(cacheHint)`.
9. Imágenes CMS: objeto `{ src, alt }` + `<Image />` de `emdash/ui`.
10. `entry.id` = slug URL; `entry.data.id` = ULID para APIs.

### Convenciones al modificar el sitio

- Estilos: tokens en `src/styles/tokens.css`; overrides en `theme.css` (no tocar `Base.astro` solo para color).
- Contenido demo: no inventar posts placeholder genéricos; si hay un post real, mostrar uno.
- Commits: solo si el usuario lo pide.

### Errores frecuentes

| Síntoma | Qué revisar |
| --- | --- |
| Plugin no aparece | `astro.config.mjs` `plugins: […]` + reiniciar `emdash dev` |
| Bloque PT no renderiza | mapa `components.type` en la página que usa `<PortableText />` |
| Estilos viejos en HMR | recarga dura o CSS global compartido |
| Build prod falla con `link:` | en prod usar `github:KURTEcl/tcg-emdash-plugins#path:packages/…` |

---

## Estado

Starter usable. El esquema TCG rico y los plugins viven en `tcg-emdash-plugins` e irán incorporándose al starter de forma incremental.

## Licencia

MIT
