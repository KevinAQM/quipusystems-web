"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Three.js Scene Configuration Constants
 */
const SCENE_CONFIG = {
  bgColor: 0x030305,
  fogDensity: 0.035,
  camera: {
    fov: 55,
    near: 0.1,
    far: 1000,
    initialZ: 7.5,
  },
  grid: {
    size: 90,
    divisions: 90,
    floorY: -2.8,
    ceilingY: 3.8,
    floorColor: 0x00f2fe,
    ceilingColor: 0x8b5cf6,
    lineColor: 0x1e293b,
    speed: 2.2,
  },
  particles: {
    count: 950,
    size: 0.055,
    opacity: 0.85,
    rangeX: 35,
    rangeY: 18,
    rangeZ: 28,
    colors: {
      cyan: 0x00f2fe,
      violet: 0xa855f7,
      emerald: 0x00ffcc,
    },
  },
  mouseLag: {
    x: 0.045,
    y: 0.045,
  },
} as const;

export default function CodeMatrixScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Fog Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(SCENE_CONFIG.bgColor, SCENE_CONFIG.fogDensity);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      SCENE_CONFIG.camera.fov,
      container.clientWidth / container.clientHeight,
      SCENE_CONFIG.camera.near,
      SCENE_CONFIG.camera.far
    );
    camera.position.set(0, 0, SCENE_CONFIG.camera.initialZ);

    // 3. Renderer Setup with High-Performance Settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Scene Illumination
    const ambientLight = new THREE.AmbientLight(0x0a1020, 2.0);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x00f2fe, 9, 40);
    cyanPointLight.position.set(0, 3, 5);
    scene.add(cyanPointLight);

    const magentaPointLight = new THREE.PointLight(0xa855f7, 7, 35);
    magentaPointLight.position.set(0, -3, 3);
    scene.add(magentaPointLight);

    // 5. Infinite Cyber Grid Planes (Floor & Ceiling)
    const gridFloor = new THREE.GridHelper(
      SCENE_CONFIG.grid.size,
      SCENE_CONFIG.grid.divisions,
      SCENE_CONFIG.grid.floorColor,
      SCENE_CONFIG.grid.lineColor
    );
    gridFloor.position.y = SCENE_CONFIG.grid.floorY;
    scene.add(gridFloor);

    const gridCeiling = new THREE.GridHelper(
      SCENE_CONFIG.grid.size,
      SCENE_CONFIG.grid.divisions,
      SCENE_CONFIG.grid.ceilingColor,
      0x0f172a
    );
    gridCeiling.position.y = SCENE_CONFIG.grid.ceilingY;
    scene.add(gridCeiling);

    // 6. Ambient Matrix Particle Cloud
    const { count, rangeX, rangeY, rangeZ, colors } = SCENE_CONFIG.particles;
    const positions = new Float32Array(count * 3);
    const particleColors = new Float32Array(count * 3);

    const colCyan = new THREE.Color(colors.cyan);
    const colViolet = new THREE.Color(colors.violet);
    const colEmerald = new THREE.Color(colors.emerald);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * rangeX;
      positions[idx + 1] = (Math.random() - 0.5) * rangeY;
      positions[idx + 2] = (Math.random() - 0.5) * rangeZ;

      const randomVal = Math.random();
      const chosenColor =
        randomVal < 0.45 ? colCyan : randomVal < 0.75 ? colViolet : colEmerald;

      particleColors[idx] = chosenColor.r;
      particleColors[idx + 1] = chosenColor.g;
      particleColors[idx + 2] = chosenColor.b;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(particleColors, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: SCENE_CONFIG.particles.size,
      vertexColors: true,
      transparent: true,
      opacity: SCENE_CONFIG.particles.opacity,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // 7. Mouse & Touch Interaction Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let gridOffset = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const rect = container.getBoundingClientRect();
        mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // 8. Dynamic Resize Observer
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // 9. Smooth Animation Loop with Tab Visibility Optimization
    let animationFrameId: number;
    let lastTime = performance.now();
    let isTabActive = true;

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive) {
        lastTime = performance.now();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isTabActive) return; // Save GPU/battery when inactive

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth mouse interpolation (Lerp)
      targetX += (mouseX * 0.8 - targetX) * SCENE_CONFIG.mouseLag.x;
      targetY += (mouseY * 0.5 - targetY) * SCENE_CONFIG.mouseLag.y;

      // Steady, elegant infinite forward grid motion
      gridOffset = (gridOffset + delta * SCENE_CONFIG.grid.speed) % 1;
      gridFloor.position.z = gridOffset;
      gridCeiling.position.z = gridOffset;

      // Light tracking
      cyanPointLight.position.x = targetX * 4;
      cyanPointLight.position.y = 3 + targetY * 3;

      // Subtle camera tilt
      camera.position.x = targetX * 0.75;
      camera.position.y = targetY * 0.5;
      camera.lookAt(0, 0, 0);

      // Particle subtle rotation
      particleSystem.rotation.y += delta * 0.025;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 10. Clean Component Teardown & Resource Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      gridFloor.geometry.dispose();
      gridCeiling.geometry.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden"
      aria-hidden="true"
    />
  );
}
