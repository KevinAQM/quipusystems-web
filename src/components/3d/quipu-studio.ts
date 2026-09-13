import * as THREE from "three";

/** Studio light cards captured as a floating-point reflection environment. */
export function createQuipuStudio(renderer: THREE.WebGLRenderer) {
  const studio = new THREE.Scene();
  studio.background = new THREE.Color("#07090b");
  const cards: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];
  const card = (position: [number, number, number], width: number, height: number, color: string, intensity: number) => {
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }),
    );
    panel.position.set(...position);
    panel.lookAt(0, 0, 0);
    studio.add(panel);
    cards.push(panel);
  };
  card([-4, 5, 5], 4, 7, "#fff0dc", 5);
  card([5, 1, 3], 1.8, 6, "#d5e5ef", 2.8);
  card([2, 4, -4], 2, 7, "#eef8ff", 4.5);
  card([-3, -4, 2], 4, 2, "#c2d7dc", 0.75);
  const generator = new THREE.PMREMGenerator(renderer);
  const environment = generator.fromScene(studio, 0.025, 0.1, 50, { size: 256 });
  generator.dispose();
  cards.forEach((panel) => { panel.geometry.dispose(); panel.material.dispose(); });

  // These are data maps, not a painted color texture: the actual surface normals
  // and roughness vary across longitudinal silk-like filaments.
  const size = 256;
  const normalPixels = new Uint8Array(size * size * 4);
  const roughnessPixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size * Math.PI * 2;
      const v = y / size * Math.PI * 2;
      const wave = v * 28 + 0.65 * Math.sin(u * 2) + 0.18 * Math.sin(u * 7 + v * 3);
      const grain = Math.sin(u * 37 + v * 71) * Math.sin(u * 53 - v * 43);
      const nx = 0.055 * Math.cos(u * 2) * Math.cos(wave) + grain * 0.025;
      const ny = 0.5 * Math.cos(wave) + 0.13 * Math.cos(v * 57 + u * 2);
      const length = Math.sqrt(nx * nx + ny * ny + 1);
      const index = (y * size + x) * 4;
      normalPixels[index] = Math.round((nx / length * 0.5 + 0.5) * 255);
      normalPixels[index + 1] = Math.round((ny / length * 0.5 + 0.5) * 255);
      normalPixels[index + 2] = Math.round((1 / length * 0.5 + 0.5) * 255);
      normalPixels[index + 3] = 255;
      const roughness = Math.round(205 + 26 * Math.sin(wave) + grain * 12);
      roughnessPixels[index] = roughness;
      roughnessPixels[index + 1] = roughness;
      roughnessPixels[index + 2] = roughness;
      roughnessPixels[index + 3] = 255;
    }
  }
  const normalMap = new THREE.DataTexture(normalPixels, size, size);
  const roughnessMap = new THREE.DataTexture(roughnessPixels, size, size);
  for (const texture of [normalMap, roughnessMap]) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(128, 1);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
  }
  return {
    environment: environment.texture,
    normalMap,
    roughnessMap,
    dispose() {
      environment.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
    },
  };
}
