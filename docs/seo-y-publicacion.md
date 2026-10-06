# SEO y publicación de Quipu Systems

## Enfoque de la landing provisional

El mensaje público conserva el texto original: software a medida, datos e inteligencia artificial para conectar y mejorar los procesos de las empresas. No se restringe por ubicación, tamaño de empresa o sector. El enfoque comercial interno no se publica como límite del servicio.

La página mantiene el aviso de web en construcción. El contenido, título y descripción conservan el alcance amplio de la versión original sin inventar clientes, proyectos, personas, certificaciones o direcciones de oficina.

Incluye URL canónica HTTPS con `www`, metadatos de español de Perú, indexación permitida, robots, sitemap de la única página, imagen social horizontal, texto alternativo y JSON-LD de Organization, WebSite, WebPage y Service. La imagen 3D inicial permite navegar sin descargar el modelo.

El JSON-LD conserva el teléfono y correo ya publicados y no añade una ubicación o área de servicio que limite el alcance público. No añade valoraciones, perfiles sociales sin verificar ni un fundador inferido del autor del repositorio. [Google explica cómo utiliza los datos de organización](https://developers.google.com/search/docs/appearance/structured-data/organization).

## Search Console

Esta parte requiere la cuenta propietaria de Google y acceso al DNS o la configuración de Vercel.

1. Añadir la propiedad de dominio `quipusystems.dev` en [Google Search Console](https://search.google.com/search-console).
2. Publicar en DNS el TXT de verificación que Google genere. El token se obtiene de esa cuenta, no del código.
3. Tras publicar, enviar `https://www.quipusystems.dev/sitemap.xml` en Sitemaps.
4. Inspeccionar `https://www.quipusystems.dev/`, comprobar la página publicada y solicitar indexación.
5. Revisar consultas, impresiones, clics y páginas indexadas conforme se acumule tráfico.

Para una propiedad de prefijo de URL también se admite verificación por HTML: guardar el valor del token en `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, reconstruir y publicar. La propiedad de dominio usa DNS.

Referencia: [comenzar con Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start). La indexación y las posiciones se comprueban después de publicar.

## Analítica y contacto

Web Analytics ya está habilitado en Vercel. La integración se carga por defecto tras publicar este código; `NEXT_PUBLIC_WEB_ANALYTICS=false` permite desactivarla. Solo si el plan actual admite eventos personalizados, activar `NEXT_PUBLIC_CONTACT_ANALYTICS=true`.

Comprobar páginas vistas y eventos `contact_click`. El evento describe canal y ubicación del enlace; no demuestra que se haya enviado un mensaje ni cerrado una venta.

Los eventos de contacto están desactivados por defecto. [Los eventos personalizados requieren Pro o Enterprise](https://vercel.com/docs/analytics/custom-events). No se agregó una suscripción.

## Correo y DNS en Name.com

El dominio se compró en Name.com. La auditoría encontró MX de Zoho y SPF, pero no DMARC. No se modificaron registros externos. La consulta pública confirmó nameservers de Name.com (`ns1bcp.name.com`, `ns2bkr.name.com`, `ns3bfm.name.com` y `ns4sxy.name.com`). Los registros TXT se gestionan allí. [Guía oficial de Name.com para añadir TXT](https://www.name.com/support/articles/115004972547-adding-a-txt-record).

1. Revisar SPF y verificar DKIM en Zoho Mail.
2. Confirmar qué servicios envían correo con `@quipusystems.dev` y que estén autenticados.
3. Crear o elegir un buzón operativo para reportes agregados. Una opción es el alias `dmarc@quipusystems.dev`, si se crea expresamente.
4. En Zoho Admin Console → Domains → quipusystems.dev → Email Configuration → DMARC, generar una política de monitorización.
5. En Name.com → My Domains → quipusystems.dev → DNS Records, publicar un único TXT con host `_dmarc` (nombre completo `_dmarc.quipusystems.dev`). Si se creó el alias anterior, la propuesta inicial es:

```text
v=DMARC1; p=none; rua=mailto:dmarc@quipusystems.dev
```

Verificar en Zoho y revisar reportes antes de pasar a cuarentena o rechazo. `p=none` observa los resultados; todavía no rechaza correo que falle autenticación. El selector y clave pública DKIM deben provenir de la cuenta real.

[Zoho documenta una implantación por fases](https://www.zoho.com/mail/help/adminconsole/dmarc-policy.html).

## Contenido para la versión oficial

Preparar páginas distintas y útiles sobre software a medida, IA y automatización, y análisis de datos. Explicar procesos que se mejoran, entregables, límites y cómo empieza el proyecto. Evitar páginas que solo cambien una ciudad o palabra.

Temas alineados con el mercado:

- Software a medida: integración de herramientas, procesos y equipos.
- Inteligencia artificial y automatización: documentos, flujos y revisión humana.
- Análisis de datos: fuentes internas, indicadores e insights para tomar decisiones.

Añadir proyectos reales con autorización, información confirmada del equipo y resultados comprobados cuando estén disponibles. No hay datos suficientes para publicar esos casos ahora.

## Validación antes y después de publicar

Ejecutar lint, TypeScript, build y auditoría. Comprobar carga inicial sin GLB, activación voluntaria, teclado, móvil, imagen alternativa y funcionamiento sin JavaScript. Verificar robots, sitemap, imagen social y dominio canónico.

Después del deployment, confirmar encabezados y metadatos públicos y comprobar los datos estructurados con [Rich Results Test](https://search.google.com/test/rich-results) o [Schema Markup Validator](https://validator.schema.org/).
