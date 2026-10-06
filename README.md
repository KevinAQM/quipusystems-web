# Quipu Systems

Landing provisional de [Quipu Systems](https://www.quipusystems.dev/): software a medida, datos e inteligencia artificial para conectar y mejorar los procesos de tu empresa. El mensaje público mantiene el alcance amplio de la versión original y el aviso de web en construcción hasta publicar la versión oficial.

## Desarrollo

Usar Node.js 24 y la versión de pnpm declarada en `package.json`.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

La página se abre en `http://localhost:3000`. No necesita variables de entorno para mostrar contenido, contacto o visor 3D. Para configurar una integración, copiar `.env.example` a `.env.local` y completar los valores correspondientes.

## Comprobaciones y despliegue

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm audit --prod
pnpm start
```

El workflow de GitHub ejecuta estas comprobaciones en pushes a `main` y pull requests. Dependabot propone actualizaciones de paquetes y Actions, agrupando Next.js y su configuración de ESLint.

La publicación se realiza mediante el proyecto existente de Vercel conectado a GitHub. Configurar Node.js 24, instalación `pnpm install --frozen-lockfile` y build `pnpm build`. Cambiar variables `NEXT_PUBLIC_*` requiere un nuevo deployment, ya que se incorporan al build.

La base de esta mejora es `7d715e5`, cuyo árbol coincide con `9b43711`. Se conserva el historial de GitHub y se excluye la animación de divisores que se había revertido.

## Imagen inicial y experiencia 3D

El visitante ve primero `public/images/quipu-front.webp`, una captura del modelo real con su cámara frontal, materiales e iluminación originales. Tiene transparencia y mide 1000 × 1000. El modelo y Three.js se cargan solo después de pulsar «Explorar en 3D».

La imagen permanece visible durante la preparación y si falla el modelo o WebGL. El botón permite reintentar. Sin JavaScript se conserva la imagen estática. El visor admite arrastre, flechas, Inicio y restablecer la vista frontal.

El GLB, sus materiales, sombras y generación se mantienen intactos. No se redujo geometría ni calidad del 3D.

Para regenerar la imagen después de un cambio intencional en la escena, iniciar el servidor y después ejecutar:

```bash
pnpm exec playwright install chromium
pnpm capture:quipu http://localhost:3000
pnpm generate:social
```

Playwright puede necesitar dependencias del sistema en Linux. Es una herramienta de desarrollo; no se utiliza en el servidor publicado. La captura lee el canvas directamente, preservando su buffer únicamente durante el proceso y excluyendo texto o controles de la página.

`pnpm generate:quipu` reconstruye el GLB con `scripts/generate-quipu.mjs`. Usarlo solo cuando se quiera modificar deliberadamente el modelo.

## Archivos y SEO

- `src/lib/site.ts`: nombre, dominio canónico, contacto y mensaje principal.
- `src/app/layout.tsx`: metadatos de buscadores y redes sociales.
- `src/app/page.tsx`: contenido y JSON-LD de organización, sitio y servicios.
- `src/app/robots.ts` y `sitemap.ts`: rutas de rastreo e indexación.
- `public/og-image.jpg`: única imagen social, 1200 × 630, creada con `scripts/generate-social-image.mjs`.
- `assets/branding`, `assets/references` y `assets/archive`: recursos de diseño preservados fuera del directorio público.
- [Plan de SEO y configuración externa](docs/seo-y-publicacion.md): Search Console, analítica, correo y evolución de la web oficial.

## Analítica opcional

Web Analytics ya está habilitado en Vercel y la integración se carga por defecto. Para desactivarla (por ejemplo en un build local), establecer `NEXT_PUBLIC_WEB_ANALYTICS=false`. El endpoint de Insights lo sirve Vercel; un servidor `pnpm start` local no implementa esa ruta.

Si el plan actual admite eventos personalizados, establecer también `NEXT_PUBLIC_CONTACT_ANALYTICS=true`. Se registra `contact_click` con `channel` (`whatsapp` o `email`) y `location` (`header`, `hero` o `contact`). El evento no envía teléfono, correo, mensaje ni URL del enlace.

[Los eventos personalizados requieren Pro o Enterprise](https://vercel.com/docs/analytics/custom-events). El código no contrata planes ni activa funciones de pago. La medición de páginas se puede activar independientemente.

ESLint permanece en la rama 9 porque los plugins React, accesibilidad e imports de la configuración de Next.js todavía declaran compatibilidad hasta esa versión. Migrar cuando soporten la nueva API.
