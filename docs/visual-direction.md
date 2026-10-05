# Quipu Systems — dirección visual

Landing provisional con fondo grafito, tipografía Geist, acento turquesa y composición editorial. Conserva el isotipo, el quipu 3D interactivo y las imágenes existentes para compartir en redes. El aviso de construcción se refiere a la nueva web; la página permite contactar a Quipu desde ahora.

El contenido se renderiza en el servidor. El componente `QuipuViewer` carga la escena Three.js en el cliente y conserva su implementación actual. Los estilos respetan `prefers-reduced-motion`.

Los botones principales abren WhatsApp en el número +51 943 526 621, con un mensaje inicial que el visitante puede editar y enviar. El contacto alternativo abre `contacto@quipusystems.dev` en el cliente de correo. No se recopilan correos ni se promete una fecha de lanzamiento.

## Contenido y composición

- Hero: «El futuro se construye conectando», propuesta de software a medida, datos e IA, aviso de nueva web y primera reunión exploratoria gratuita.
- Especialidades: las seis áreas oficiales, en una cuadrícula de tres columnas en escritorio, dos en tablet y una en móvil.
- Ejemplos de soluciones: campo y oficina, indicadores a partir de datos dispersos y flujos documentales. Se presentan como posibilidades, sin atribuirlos a proyectos de clientes.
- Método: entender el proceso, acordar los entregables y validar con el cliente; un responsable coordina las especialidades.
- Contacto: WhatsApp, número visible y correo corporativo. La página no limita la cobertura a una ciudad o país.
- Metadatos: título y descripciones sobre software, datos e inteligencia artificial, con URL canónica.
- Secciones: líneas horizontales de mayor contraste con un acento turquesa, aprovechando el espacio existente.
- Progreso de lectura: el tramo turquesa de los cinco separadores crece en secuencia con el scroll y retrocede al subir. El último, encima del footer, se completa al llegar al final de la página. Se conserva el tramo inicial de 72 píxeles y el aspecto estático si JavaScript no está disponible. El controlador actualiza transformaciones sin volver a renderizar el contenido; recalcula el recorrido cuando cambia el tamaño de la página y respeta la preferencia de movimiento reducido al desactivar la transición.
- Navegación interna: los enlaces apuntan al encabezado de cada sección, con un margen de encuadre de 28 píxeles en escritorio y 20 en móvil. «Volver al inicio» muestra también la cabecera.

Fuente del contenido: manual de marca, dossier y catálogo vigentes de la biblioteca de Windows. La gratuidad corresponde a la reunión exploratoria; el diagnóstico y la implementación tienen su propio alcance y condiciones.

## Recurso generado histórico

- Archivo: `public/images/quipu-knot.png` (1254 × 1254).
- Método: herramienta integrada `image_gen`, una generación.
- Uso: ilustración conceptual de marca; no representa un producto físico.

### Prompt final

Use case: stylized-concept. Asset type: standalone brand hero image for Quipu Systems technology startup landing page. Primary request: High-end 3D studio render of a sculptural quipu-inspired knot, one continuous thick loop with subtly intertwined hanging strands. Scene/backdrop: deep near-black #080c0f background, clean generous dark negative space on all edges to blend into website, grounded softly in dark space. Style/medium: photoreal premium industrial design. Composition/framing: square composition; sculpture centered, occupies 70% of composition, slight diagonal three-quarter view. Lighting/mood: dramatic tasteful soft studio lighting, restrained cyan glow. Color palette: precision-crafted dark chrome and satin silver with luminous teal/cyan edges; no purple. Materials/textures: detailed braided/fine filament surface on some strands. Constraints: NO UI, text, logos, watermark, clutter. Not a generic torus.
