import sharp from "sharp";

// Compose a static social card from the actual frontal render. No runtime image API.
const root = new URL("../", import.meta.url);
const image = await sharp(new URL("public/images/quipu-front.webp", root).pathname)
  .resize(515, 515).png().toBuffer();
const logo = await sharp(new URL("public/logos/isotipo_quipu_nobg.png", root).pathname)
  .resize(42, 52, { fit: "contain" }).png().toBuffer();
const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#080c0f"/>
  <path d="M60 142H1140M60 563H1140" stroke="#ffffff" stroke-opacity=".12"/>
  <text x="120" y="104" fill="#f1f3f3" font-family="DejaVu Sans,Arial,sans-serif" font-size="32">quipu systems<tspan fill="#6ce6cd">.</tspan></text>
  <text x="60" y="206" fill="#a5b6b3" font-family="DejaVu Sans,Arial,sans-serif" font-size="15" letter-spacing="1">NUESTRA NUEVA WEB ESTÁ EN CAMINO</text>
  <g fill="#f1f3f3" font-family="DejaVu Sans,Arial,sans-serif" font-size="47" font-weight="bold">
    <text x="60" y="289">El futuro se</text>
    <text x="60" y="354">construye</text>
    <text x="60" y="419" fill="#6ce6cd">conectando.</text>
  </g>
  <text x="60" y="493" fill="#929fa5" font-family="DejaVu Sans,Arial,sans-serif" font-size="19">Software · Datos · Inteligencia artificial</text>
  <text x="60" y="603" fill="#a5b6b3" font-family="DejaVu Sans,Arial,sans-serif" font-size="18">quipusystems.dev</text>
</svg>`);
const output = new URL("public/og-image.jpg", root);
await sharp(svg).composite([{ input: logo, left: 60, top: 63 }, { input: image, left: 654, top: 34 }])
  .jpeg({ quality: 86, mozjpeg: true }).toFile(output.pathname);
console.log(`Saved ${output.pathname}`);
