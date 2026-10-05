import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { meshopt } from "@gltf-transform/functions";
import { MeshoptEncoder } from "meshoptimizer";
import { MeshBVH } from "three-mesh-bvh";

// A reproducible, genuinely volumetric reconstruction of the supplied front view.
// The photograph does not describe the reverse: its braids and knots are modeled.
const TAU = Math.PI * 2;
const v = (x, y, z = 0) => new THREE.Vector3(x, y, z);
const fromImage = (x, y, z = 0) => v((x - 627) / 100, (627 - y) / 100, z);
const materials = [
  new THREE.MeshPhysicalMaterial({ name: "Graphite textile", color: "#666968", metalness: 0.68, roughness: 0.29, sheen: 0.08, sheenColor: "#b1b5b3", sheenRoughness: 0.4, anisotropy: 0.35, vertexColors: true }),
  new THREE.MeshPhysicalMaterial({ name: "Silver textile", color: "#b2aea6", metalness: 0.66, roughness: 0.28, sheen: 0.06, sheenColor: "#e7e3dc", sheenRoughness: 0.4, anisotropy: 0.35, vertexColors: true }),
  new THREE.MeshPhysicalMaterial({ name: "Turquoise textile", color: "#2f798b", metalness: 0.65, roughness: 0.28, sheen: 0.08, sheenColor: "#73b7c4", sheenRoughness: 0.4, anisotropy: 0.4, vertexColors: true }),
];
const parts = materials.map(() => []);
const curve = (points) => new THREE.CatmullRomCurve3(points, false, "centripetal");

function finishGeometry(geometry, length, shade = 1) {
  const uv = geometry.getAttribute("uv");
  const colors = new Float32Array(uv.count * 3);
  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i);
    const variation = shade * (0.97 + 0.02 * Math.sin(u * length * 12) + 0.01 * Math.sin(u * length * 37));
    colors.fill(variation, i * 3, i * 3 + 3);
    // Keep a consistent physical grain size along every strand.
    uv.setXY(i, u * length * 3 / 128, uv.getY(i));
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function tube(path, radius, material, segments, sides = 8, shade = 1, taper = false) {
  const geometry = new THREE.TubeGeometry(path, segments, radius, sides, false);
  if (taper) {
    const positions = geometry.attributes.position;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const center = path.getPointAt(t);
      const scale = 1 - 0.8 * t ** 2;
      for (let j = 0; j <= sides; j++) {
        const index = i * (sides + 1) + j;
        const point = v().fromBufferAttribute(positions, index).sub(center).multiplyScalar(scale).add(center);
        positions.setXYZ(index, point.x, point.y, point.z);
      }
    }
    geometry.computeVertexNormals();
  }
  parts[material].push(finishGeometry(geometry, path.getLength(), shade));
}

// Align the broad face of the plait with the reference's image plane, then
// parallel-transport that orientation through the curves of the tied knots.
function braidFrames(path, segments) {
  const frames = path.computeFrenetFrames(segments, false);
  const preferred = v().crossVectors(v(0, 0, 1), frames.tangents[0]);
  if (preferred.lengthSq() < 0.001) preferred.set(1, 0, 0);
  preferred.normalize();
  const angle = Math.atan2(preferred.dot(frames.binormals[0]), preferred.dot(frames.normals[0]));
  for (let i = 0; i <= segments; i++) {
    const normal = frames.normals[i].clone();
    frames.normals[i].multiplyScalar(Math.cos(angle)).addScaledVector(frames.binormals[i], Math.sin(angle));
    frames.binormals[i].multiplyScalar(Math.cos(angle)).addScaledVector(normal, -Math.sin(angle));
  }
  return frames;
}

// Tightly laid, rounded plies: the earlier figure-eight cross section produced
// open chain-like gaps and exaggerated lumps compared with the supplied image.
function rope(path, radius, material, pitch = radius * 6, detail = true) {
  const length = path.getLength();
  const segments = Math.max(28, Math.ceil(length / pitch * 22));
  const frames = braidFrames(path, segments);
  const centers = path.getSpacedPoints(segments);
  for (let ply = 0; ply < 3; ply++) {
    const points = centers.map((point, i) => {
      const t = i / segments;
      const a = t * length / pitch * TAU + ply * TAU / 3 + 0.025 * Math.sin(t * length * 8);
      const fullness = 1 + 0.012 * Math.sin(t * length * 19 + ply);
      return point.clone()
        .addScaledVector(frames.normals[i], Math.cos(a) * radius * 0.44 * fullness)
        .addScaledVector(frames.binormals[i], Math.sin(a) * radius * 0.44 * fullness);
    });
    const plyPath = curve(points);
    tube(plyPath, radius * 0.55, material, segments, 12, [1, 0.94, 0.98][ply]);
    if (!detail) continue;
    const yarnSegments = segments;
    const yarnFrames = plyPath.computeFrenetFrames(yarnSegments, false);
    const yarnCenters = plyPath.getSpacedPoints(yarnSegments);
    for (let yarn = 0; yarn < 1; yarn++) {
      const yarnPoints = yarnCenters.map((point, i) => {
        const a = i / yarnSegments * length / (pitch * 0.45) * TAU + yarn * Math.PI;
        return point.clone()
          .addScaledVector(yarnFrames.normals[i], Math.cos(a) * radius * 0.548)
          .addScaledVector(yarnFrames.binormals[i], Math.sin(a) * radius * 0.548);
      });
      tube(curve(yarnPoints), radius * 0.018, material, yarnSegments, 4, 1.02);
    }
  }
  if (detail) {
    // Sparse, short loose filaments catch the rim light without a fuzzy silhouette.
    for (let i = 0; i < Math.floor(length * 2); i++) {
      const t = (i + 0.5) / Math.floor(length * 2);
      const frame = Math.min(segments, Math.floor(t * segments));
      const a = i * 2.399963;
      const normal = frames.normals[frame].clone().multiplyScalar(Math.cos(a)).addScaledVector(frames.binormals[frame], Math.sin(a));
      const base = centers[frame].clone().addScaledVector(normal, radius * 0.83);
      tube(curve([base, base.clone().addScaledVector(normal, 0.01).addScaledVector(frames.tangents[frame], 0.025),
        base.clone().addScaledVector(normal, 0.012).addScaledVector(frames.tangents[frame], 0.035)]),
      0.0015, material, 6, 3, 1.02, true);
    }
  }
}

function collar(center, radius, material, axis = v(0, 1, 0)) {
  const rotation = new THREE.Quaternion().setFromUnitVectors(v(0, 1, 0), axis.clone().normalize());
  for (let i = 0; i < 3; i++) {
    const geometry = new THREE.TorusGeometry(radius, 0.019, 6, 32);
    geometry.rotateX(Math.PI / 2);
    geometry.translate(0, (i - 1) * 0.052, 0);
    geometry.applyQuaternion(rotation);
    geometry.translate(center.x, center.y, center.z);
    parts[material].push(finishGeometry(geometry, TAU * radius, 0.85));
  }
}

function tassel(center, direction, material, seed, length = 0.85, spread = 0.36) {
  const rotation = new THREE.Quaternion().setFromUnitVectors(v(0, -1, 0), direction.clone().normalize());
  for (let i = 0; i < 42; i++) {
    const a = i * 2.399963 + seed;
    const reach = spread * (0.5 + 0.5 * Math.sin(i * 7.13 + seed) ** 2);
    const strandLength = length * (0.91 + 0.09 * Math.sin(i * 2.3) ** 2);
    const points = Array.from({ length: 10 }, (_, j) => {
      const t = j / 9;
      const r = 0.065 + reach * t ** 1.4;
      return v(Math.cos(a) * r + Math.sin(t * 12 + a) * 0.028 * t,
        -strandLength * t + Math.sin(t * 10 + a) * 0.018 * t, Math.sin(a) * r * 0.72)
        .applyQuaternion(rotation).add(center);
    });
    tube(curve(points), 0.007 + 0.003 * (i % 4), material, 28, 6, 0.9 + (i % 5) * 0.025, true);
  }
  collar(center, 0.112, material, direction);
}

const main = curve([
  fromImage(174, 103), fromImage(315, 170), fromImage(455, 205),
  fromImage(625, 220), fromImage(788, 208), fromImage(943, 164), fromImage(1086, 99),
]);
rope(main, 0.185, 0, 0.78);
tassel(main.getPoint(0), v(-1, 0.32, 0), 1, 3, 0.72, 0.28);
tassel(main.getPoint(1), v(1, 0.32, 0), 1, 7, 0.72, 0.28);

const cords = [
  { letter: "Q", value: 18, x: 313, attachY: 172, endX: 297, endY: 1047, tens: [355], unitsY: 772, units: 8, material: 0 },
  { letter: "U", value: 22, x: 456, attachY: 207, endX: 451, endY: 1040, tens: [405, 480], unitsY: 877, units: 2, material: 1 },
  { letter: "I", value: 9, x: 624, attachY: 220, endX: 623, endY: 1060, tens: [], unitsY: 772, units: 9, material: 2 },
  { letter: "P", value: 17, x: 788, attachY: 208, endX: 791, endY: 1043, tens: [402], unitsY: 786, units: 7, material: 0 },
  { letter: "U", value: 22, x: 944, attachY: 164, endX: 960, endY: 1040, tens: [320, 402], unitsY: 885, units: 2, material: 1 },
];

for (const [index, cord] of cords.entries()) {
  const { x, attachY, endX, endY, material } = cord;
  const at = (imageY) => {
    const t = (imageY - attachY) / (endY - attachY);
    return fromImage(THREE.MathUtils.lerp(x, endX, t) + Math.sin(t * Math.PI) * (index % 2 ? 2 : -3), imageY,
      Math.sin(t * Math.PI * 1.4) * 0.035);
  };
  const pendant = curve(Array.from({ length: 15 }, (_, i) => at(attachY + (endY - attachY) * i / 14)));
  rope(pendant, 0.102, material, 0.49);

  // Doubled hitch passing in front of and behind the main support rope.
  for (const side of [-1, 1]) {
    const hitch = curve(Array.from({ length: 49 }, (_, i) => {
      const a = i / 48 * TAU;
      return fromImage(x, attachY).add(v(side * 0.069 + 0.045 * Math.sin(a), Math.cos(a) * 0.33 - 0.01, Math.sin(a) * 0.245));
    }));
    rope(hitch, 0.085, material, 0.5, false);
  }
  collar(at(attachY + 30), 0.145, material);

  // Overhand-like crossings: closed 3D woven paths with visible under/over passes.
  for (const y of cord.tens) {
    const center = at(y);
    const points = Array.from({ length: 121 }, (_, i) => {
      const t = i / 120 * TAU;
      return center.clone().add(v(
        0.086 * (2 + Math.cos(3 * t)) * Math.cos(2 * t),
        0.076 * (2 + Math.cos(3 * t)) * Math.sin(2 * t),
        0.115 * Math.sin(3 * t),
      ));
    });
    rope(curve(points), 0.115, material, 0.6);
  }

  // Each lower group is a continuous helix; one revolution = one visible unit.
  const turns = cord.units;
  const knotPoints = Array.from({ length: turns * 40 + 1 }, (_, i) => {
    const t = i / (turns * 40);
    const a = t * turns * TAU + Math.PI / 2;
    const radius = 0.215 + 0.006 * Math.sin(a * 2 + index) + 0.003 * Math.cos(t * 17);
    return at(cord.unitsY + t * turns * 25).add(v(Math.cos(a) * radius,
      0.008 * Math.sin(a * 2 + 0.4), Math.sin(a) * radius * 0.94));
  });
  rope(curve(knotPoints), 0.12, material, 0.73);
  // The returning segment closes the long knot on its reverse side.
  rope(curve([
    knotPoints.at(-1), at(cord.unitsY + turns * 25 + 6).add(v(0, 0, -0.19)),
    at(cord.unitsY - 7).add(v(0, 0, -0.19)), knotPoints[0],
  ]), 0.059, material, 0.3, false);
  tassel(at(endY), v(0, -1, 0), material, index * 5, index === 2 ? 1.04 : 0.92);
}

const model = new THREE.Group();
model.name = "Quipu — Spanish alphabet — 18,22,9,17,22";
model.userData = {
  reference: "quipu-spanish-alphabet.png",
  description: "Static volumetric reconstruction; reverse geometry is interpreted from the front reference.",
  cords: cords.map(({ letter, value, tens, units }) => ({ letter, value, tens: tens.length, units })),
};
let triangles = 0;
for (let i = 0; i < materials.length; i++) {
  const geometry = mergeGeometries(parts[i]);
  const mesh = new THREE.Mesh(geometry, materials[i]);
  mesh.name = materials[i].name;
  model.add(mesh);
  triangles += geometry.index.count / 3;
  parts[i].forEach((part) => part.dispose());
}
const center = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
model.children.forEach((mesh) => mesh.geometry.translate(-center.x, -center.y, -center.z));

// Bake near-field occlusion against the complete model, including the reverse.
// This preserves contact shadows between filaments without a screen-space halo
// or a continuous GPU postprocessing loop on the page.
const collisionParts = model.children.map((mesh) => {
  const geometry = mesh.geometry.clone();
  for (const name of Object.keys(geometry.attributes)) {
    if (name !== "position") geometry.deleteAttribute(name);
  }
  return geometry;
});
const collision = mergeGeometries(collisionParts);
const bvh = new MeshBVH(collision, { targetLeafSize: 8 });
collisionParts.forEach((geometry) => geometry.dispose());
const normal = v();
const tangent = v();
const bitangent = v();
const ray = new THREE.Ray();
const aoSamples = 8;
for (const mesh of model.children) {
  console.log(`Baking fiber contact shadows: ${mesh.name}`);
  const positions = mesh.geometry.attributes.position;
  const normals = mesh.geometry.attributes.normal;
  const colors = mesh.geometry.attributes.color;
  for (let i = 0; i < positions.count; i++) {
    normal.fromBufferAttribute(normals, i).normalize();
    tangent.crossVectors(normal, Math.abs(normal.y) > 0.9 ? v(1, 0, 0) : v(0, 1, 0)).normalize();
    bitangent.crossVectors(normal, tangent);
    ray.origin.fromBufferAttribute(positions, i).addScaledVector(normal, 0.0035);
    let occlusion = 0;
    for (let sample = 0; sample < aoSamples; sample++) {
      const r = Math.sqrt((sample + 0.5) / aoSamples);
      const angle = sample * 2.399963;
      ray.direction.copy(normal).multiplyScalar(Math.sqrt(1 - r * r))
        .addScaledVector(tangent, Math.cos(angle) * r)
        .addScaledVector(bitangent, Math.sin(angle) * r);
      const hit = bvh.raycastFirst(ray, THREE.DoubleSide, 0, 0.24);
      if (hit) occlusion += (1 - hit.distance / 0.24) ** 0.65;
    }
    const shade = 1 - occlusion / aoSamples * 0.72;
    colors.setXYZ(i, colors.getX(i) * shade, colors.getY(i) * shade, colors.getZ(i) * shade);
  }
}
collision.dispose();
model.userData.surface = "Woven plies, satin fiber PBR, baked 8-ray contact occlusion, tapered loose filaments";
model.userData.surfaceTextureRepeat = [128, 1];

// GLTFExporter uses this browser API only for its binary Blob in this texture-free asset.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = result;
      this.onloadend?.();
    });
  }
};
const data = await new GLTFExporter().parseAsync(model, { binary: true });
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "meshopt.encoder": MeshoptEncoder });
const document = await io.readBinary(new Uint8Array(data));
await document.transform(meshopt({ encoder: MeshoptEncoder, level: "high", quantizePosition: 16 }));
const compressed = await io.writeBinary(document);
const output = new URL("../public/models/quipu-spanish-alphabet.glb", import.meta.url);
await mkdir(new URL(".", output), { recursive: true });
await writeFile(output, compressed);
console.log(JSON.stringify({ file: fileURLToPath(output), bytes: compressed.byteLength, triangles, meshes: model.children.length, cords: model.userData.cords }, null, 2));
