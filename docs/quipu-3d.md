# Quipu interactivo

La portada utiliza `src/components/3d/QuipuViewer.tsx` y el modelo real
`public/models/quipu-spanish-alphabet.glb`, reconstruido tomando como referencia
`assets/references/quipu-spanish-alphabet.png`. Las caras posteriores se han modelado
por interpretación: una sola imagen no contiene esa geometría oculta.

El modelo conserva cinco cuerdas, la central turquesa, las trenzas, los amarres,
las puntas deshilachadas y esta distribución:

| Cuerda | Valor | Nudos superiores | Vueltas inferiores |
| --- | --- | --- | --- |
| Q | 18 | 1 | 8 |
| U | 22 | 2 | 2 |
| I | 9 | 0 | 9 |
| P | 17 | 1 | 7 |
| U | 22 | 2 | 2 |

La distribución sigue la convención moderna del alfabeto español documentada
en este proyecto. Es una reconstrucción visual, no una validación arqueológica
ni topológica de los nudos.

## Interacción

- Arrastrar con el mouse o un dedo gira la vista alrededor del objeto.
- Se puede recorrer toda la vuelta horizontal y observarlo desde arriba y abajo.
- Las flechas del teclado giran el visor cuando tiene el foco.
- `Inicio` o el botón **Vista frontal** recuperan la orientación original.
- No hay animación, viento, autorrotación ni inercia al soltar el mouse.
- El render solo se actualiza cuando cambia la vista o el tamaño del contenedor.
- La rueda conserva el desplazamiento de la página.
- Durante la carga solo se muestra el aviso de preparación, manteniendo el
  espacio del visor. Se revela el objeto después de dibujar su primer fotograma.
  No se intercala la imagen original ni se cambia de una fotografía a otro objeto.
- Si falla WebGL o la carga, se muestra un aviso sin sustituir el objeto por la
  imagen de referencia.

## Acabado de estudio

- Cuerdas de tres cabos redondeados y compactos. Se eliminó la sección en ocho
  que dejaba huecos y producía un contorno parecido a una cadena en la versión anterior.
- Nudos más compactos, vueltas de contorno regular y puntas con 42 filamentos
  afinados, además de fibras cortas sueltas sobre las cuerdas.
- Materiales físicos en grafito, plata y turquesa, con mayor reflexión metálica,
  menor rugosidad y menos brillo difuso que el acabado mate anterior. Los reflejos
  anisotrópicos siguen la dirección de las fibras.
- Mapas de normales y rugosidad generados localmente como datos, con mipmaps
  y filtrado anisotrópico para evitar parpadeos en detalles pequeños.
- Oclusión de contacto precalculada con ocho rayos por vértice contra todo el
  modelo. Incluye el reverso y queda guardada en los colores de sus vértices.
- Entorno HDR de paneles de estudio generado en el dispositivo, sombras de
  2048 px, luz principal cálida, relleno tenue y luz de recorte.
- Antialiasing, mapeo tonal ACES y encuadre adaptado al ángulo de observación.

La iluminación sigue la orientación de la cámara para mantener legibles todas
las caras. Los efectos se calculan al interactuar: el objeto sigue estático,
sin bucle de animación en reposo. No se añaden desenfoque ni resplandor que
oculten la textura. `src/components/3d/quipu-studio.ts` contiene el entorno y
los mapas de superficie; no requiere descargas de HDR o texturas externas.

## Regenerar el archivo

```sh
pnpm generate:quipu
```

`scripts/generate-quipu.mjs` genera trenzas y nudos con geometría tridimensional,
agrupa las piezas por material y exporta el GLB con compresión Meshopt. El
decodificador se incluye en el paquete local de Three.js. El resultado se guarda en el
repositorio; no se genera en cada visita ni durante el build de Next.js.

Para subir este cambio al servidor, incluir el componente, el generador, el GLB,
el módulo del estudio, los cambios de la portada y del CSS, y los
archivos de dependencias. No se necesita un servicio externo de modelos 3D.
