import { chromium } from "playwright";
import sharp from "sharp";

// Capture the actual default camera, lighting and materials without DOM overlays.
// Run against a local server after any intentional changes to the 3D scene.
const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader"],
});

try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1400 } });
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, options) {
      return getContext.call(this, type, type === "webgl" || type === "webgl2"
        ? { ...options, preserveDrawingBuffer: true }
        : options);
    };
  });

  await page.goto(process.argv[2] ?? "http://localhost:3000", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Explorar en 3D", exact: true }).click();
  await page.waitForFunction(() => document.querySelector(".quipu-viewer")?.dataset.state === "ready", { timeout: 60_000 });
  await page.addStyleTag({ content: `
    .hero-visual { width:1000px!important; height:1000px!important; aspect-ratio:auto!important; margin:0!important; }
    .quipu-viewer, .quipu-viewport { inset:0!important; }
  ` });
  await page.getByRole("button", { name: "Restablecer la vista frontal del quipu" }).click();
  await page.waitForTimeout(500);
  const png = await page.locator(".quipu-viewport canvas").evaluate((canvas) => canvas.toDataURL("image/png"));
  const output = new URL("../public/images/quipu-front.webp", import.meta.url);
  await sharp(Buffer.from(png.split(",")[1], "base64")).webp({ quality: 88 }).toFile(output.pathname);
  console.log(`Saved ${output.pathname}`);
} finally {
  await browser.close();
}
