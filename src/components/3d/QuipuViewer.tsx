"use client";

import { useEffect, useRef, useState } from "react";

type ViewerActions = { reset: () => void; rotate: (horizontal: number, vertical: number) => void };

export default function QuipuViewer() {
  const viewport = useRef<HTMLDivElement>(null);
  const actions = useRef<ViewerActions | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    const container = viewport.current;
    if (!container) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const abort = new AbortController();

    async function initialize() {
      const [THREE, { OrbitControls }, { GLTFLoader }, { MeshoptDecoder }, { createQuipuStudio }] = await Promise.all([
        import("three"),
        import("three/addons/controls/OrbitControls.js"),
        import("three/addons/loaders/GLTFLoader.js"),
        import("three/addons/libs/meshopt_decoder.module.js"),
        import("./quipu-studio"),
      ]);
      if (disposed || !container) return;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x080c0f, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      const canvas = renderer.domElement;
      canvas.setAttribute("aria-hidden", "true");
      container.appendChild(canvas);
      cleanup = () => { renderer.dispose(); canvas.remove(); };

      const scene = new THREE.Scene();
      const studio = createQuipuStudio(renderer);
      scene.environment = studio.environment;
      scene.environmentIntensity = 1.15;
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      scene.add(camera);
      scene.add(new THREE.HemisphereLight(0xd9eeef, 0x121318, 0.22));
      const lightRig = new THREE.Group();
      scene.add(lightRig);
      const key = new THREE.DirectionalLight(0xfff4e6, 1.6);
      key.position.set(-5, 7, 7);
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 28 });
      key.shadow.camera.updateProjectionMatrix();
      key.shadow.bias = -0.00008;
      key.shadow.normalBias = 0.006;
      key.shadow.radius = 2;
      const fill = new THREE.DirectionalLight(0xcddfea, 0.45);
      fill.position.set(6, 1, 4);
      const rim = new THREE.DirectionalLight(0xd8f2f5, 1.8);
      rim.position.set(3, 4, -6);
      lightRig.add(key, fill, rim, key.target, fill.target, rim.target);

      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = false;
      controls.autoRotate = false;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.rotateSpeed = 0.65;
      controls.minPolarAngle = 0.001;
      controls.maxPolarAngle = Math.PI - 0.001;
      controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: null, RIGHT: null };
      controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: null };

      let radius = 7.5;
      let model: import("three").Group | undefined;
      let contextLost = false;
      let renderFrame = 0;
      const framingCorners: import("three").Vector3[] = [];
      const projected = new THREE.Vector3();
      const draw = () => {
        renderFrame = 0;
        if (disposed || contextLost) return;
        lightRig.quaternion.copy(camera.quaternion);
        scene.environmentRotation.setFromQuaternion(camera.quaternion);
        // Fill the frame while keeping the complete object visible at every angle.
        // Projection changes only in response to a user action or container resize.
        camera.zoom = 1;
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
        let extent = 0;
        for (const corner of framingCorners) {
          projected.copy(corner).project(camera);
          extent = Math.max(extent, Math.abs(projected.x), Math.abs(projected.y));
        }
        camera.zoom = extent > 0 ? Math.min(1.35, 0.93 / extent) : 1;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };
      const render = () => {
        // Coalesce pointer/resize events into one frame; never run an idle loop.
        if (!renderFrame && !disposed) renderFrame = requestAnimationFrame(draw);
      };
      const resize = () => {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;
        camera.aspect = width / height;
        // A bounding sphere keeps every side in frame, including after resizing.
        const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
        const limitingFov = Math.min(halfFov, Math.atan(Math.tan(halfFov) * camera.aspect));
        const distance = radius * 1.04 / Math.sin(limitingFov);
        camera.position.copy(camera.position.clone().sub(controls.target).normalize().multiplyScalar(distance).add(controls.target));
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        controls.update();
        render();
      };
      camera.position.set(0, 0, 24);
      const observer = new ResizeObserver(resize);
      observer.observe(container);
      controls.addEventListener("change", render);

      const loseContext = (event: Event) => {
        event.preventDefault();
        contextLost = true;
        controls.enabled = false;
        setStatus("unavailable");
      };
      const restoreContext = () => {
        contextLost = false;
        controls.enabled = true;
        if (model) {
          resize();
          setStatus("ready");
        }
      };
      canvas.addEventListener("webglcontextlost", loseContext);
      canvas.addEventListener("webglcontextrestored", restoreContext);

      const disposeModel = (object: import("three").Group) => {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material: import("three").Material) => material.dispose());
          }
        });
      };
      cleanup = () => {
        cancelAnimationFrame(renderFrame);
        actions.current = null;
        observer.disconnect();
        controls.removeEventListener("change", render);
        controls.dispose();
        canvas.removeEventListener("webglcontextlost", loseContext);
        canvas.removeEventListener("webglcontextrestored", restoreContext);
        if (model) {
          disposeModel(model);
          model = undefined;
        }
        key.shadow.dispose();
        studio.dispose();
        renderer.dispose();
        canvas.remove();
      };

      const response = await fetch("/models/quipu-spanish-alphabet.glb?v=reference-3", { signal: abort.signal });
      if (!response.ok) throw new Error("Could not load the quipu model");
      const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(await response.arrayBuffer(), "");
      if (disposed) {
        disposeModel(gltf.scene);
        return;
      }
      model = gltf.scene;
      scene.add(model);
      const bounds = new THREE.Box3().setFromObject(model);
      for (const x of [bounds.min.x, bounds.max.x]) {
        for (const y of [bounds.min.y, bounds.max.y]) {
          for (const z of [bounds.min.z, bounds.max.z]) framingCorners.push(new THREE.Vector3(x, y, z));
        }
      }
      // Use actual vertices, not empty corners of the model's bounding box.
      radius = 0;
      model.updateMatrixWorld(true);
      const vertex = new THREE.Vector3();
      model.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.castShadow = true;
        child.receiveShadow = true;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        for (const material of materials) {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.normalMap = studio.normalMap;
            material.normalScale.set(0.12, 0.12);
            material.roughnessMap = studio.roughnessMap;
            material.needsUpdate = true;
          }
        }
        const positions = child.geometry.getAttribute("position");
        for (let i = 0; i < positions.count; i++) {
          vertex.fromBufferAttribute(positions, i).applyMatrix4(child.matrixWorld);
          radius = Math.max(radius, vertex.length());
        }
      });
      await renderer.compileAsync(scene, camera);
      if (disposed) return;
      actions.current = {
        reset: () => {
          camera.position.set(0, 0, camera.position.length());
          camera.up.set(0, 1, 0);
          controls.target.set(0, 0, 0);
          controls.update();
          render();
        },
        rotate: (horizontal, vertical) => {
          const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
          spherical.theta += horizontal;
          spherical.phi = THREE.MathUtils.clamp(spherical.phi + vertical, controls.minPolarAngle, controls.maxPolarAngle);
          camera.position.setFromSpherical(spherical).add(controls.target);
          controls.update();
          render();
        },
      };
      resize();
      // Reveal only a completed 3D frame, never a different reference photograph.
      cancelAnimationFrame(renderFrame);
      draw();
      if (!contextLost) setStatus("ready");
    }

    void initialize().catch(() => {
      if (!disposed) {
        cleanup?.();
        cleanup = undefined;
        setStatus("unavailable");
      }
    });
    return () => {
      disposed = true;
      abort.abort();
      cleanup?.();
    };
  }, []);

  return (
    <div className="quipu-viewer" data-state={status} aria-busy={status === "loading"}>
      <div
        ref={viewport}
        className="quipu-viewport"
        role="group"
        aria-label="Quipu tridimensional de cinco cuerdas, con la cuerda central turquesa"
        aria-describedby="quipu-instructions"
        tabIndex={status === "ready" ? 0 : -1}
        onKeyDown={(event) => {
          const step = Math.PI / 12;
          const directions: Record<string, [number, number]> = {
            ArrowLeft: [-step, 0], ArrowRight: [step, 0],
            ArrowUp: [0, -step], ArrowDown: [0, step],
          };
          if (directions[event.key]) {
            event.preventDefault();
            actions.current?.rotate(...directions[event.key]);
          } else if (event.key === "Home") {
            event.preventDefault();
            actions.current?.reset();
          }
        }}
      />
      <div className="quipu-controls">
        <p id="quipu-instructions" aria-live="polite">
          {status === "ready" ? <>Arrastra para girar <span aria-hidden="true">· 360°</span><span className="sr-only">. También puedes usar las flechas del teclado e Inicio para volver a la vista frontal.</span></> : status === "loading" ? "Preparando vista 3D…" : "Vista 3D no disponible en este dispositivo."}
        </p>
        {status === "ready" && (
          <button type="button" onClick={() => actions.current?.reset()} aria-label="Restablecer la vista frontal del quipu">Vista frontal <span aria-hidden="true">↺</span></button>
        )}
      </div>
    </div>
  );
}
