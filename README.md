# TCG EmDash Starter

Base open source para crear sitios y blogs de jugadores de TCG con EmDash.

## Variantes

- `apps/node`: Node.js, SQLite y almacenamiento local.
- `apps/cloudflare`: Cloudflare Workers, D1 y R2, compatible con el plan gratuito.

## Desarrollo

Requiere Node.js 22+ y pnpm 11.

```bash
pnpm install
pnpm dev:node
```

El sitio estará en <http://localhost:4321> y el administrador en <http://localhost:4321/_emdash/admin>.

Para trabajar con la variante Cloudflare:

```bash
pnpm dev:cloudflare
```

Antes de desplegar, crea tus propios recursos D1/R2, configura el dominio público y genera una clave única con `pnpm exec emdash secrets generate`.

## Estado

Fundación inicial. El esquema, el diseño TCG y los plugins se incorporarán de forma incremental.

## Licencia

MIT
