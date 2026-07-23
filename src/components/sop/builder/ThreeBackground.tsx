"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 25);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // -------------------------------------------------------------
    // SOP Flowchart Nodes (Representing SOP Process Steps)
    // -------------------------------------------------------------
    const nodes = [
      { x: -9, y: 5, z: 0, label: "Start", type: "pill" },
      { x: -3, y: 5, z: 0, label: "Input Dokumen", type: "box" },
      { x: 4, y: 2, z: 0, label: "Verifikasi & Review", type: "diamond" },
      { x: -2, y: -4, z: 0, label: "Persetujuan SOP", type: "box" },
      { x: 6, y: -5, z: 0, label: "Arsip / Selesai", type: "pill" },
    ];

    const emeraldMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const goldMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });

    const boxGeo = new THREE.BoxGeometry(3.6, 1.8, 0.4);
    const pillGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.4, 16);
    pillGeo.rotateX(Math.PI / 2);

    const diamondGeo = new THREE.OctahedronGeometry(1.6, 0);

    nodes.forEach((n, idx) => {
      let mesh: THREE.Mesh;
      if (n.type === "box") {
        mesh = new THREE.Mesh(boxGeo, idx % 2 === 0 ? emeraldMat : goldMat);
      } else if (n.type === "diamond") {
        mesh = new THREE.Mesh(diamondGeo, goldMat);
      } else {
        mesh = new THREE.Mesh(pillGeo, emeraldMat);
      }
      mesh.position.set(n.x, n.y, n.z);
      mainGroup.add(mesh);
    });

    // -------------------------------------------------------------
    // Flowchart Connector Lines (Connecting SOP steps)
    // -------------------------------------------------------------
    const connections = [
      [0, 1], // Start -> Input Dokumen
      [1, 2], // Input Dokumen -> Verifikasi
      [2, 3], // Verifikasi -> Persetujuan
      [3, 4], // Persetujuan -> Selesai
    ];

    const lineMat = new THREE.LineDashedMaterial({
      color: 0x059669,
      dashSize: 0.4,
      gapSize: 0.2,
      transparent: true,
      opacity: 0.4,
    });

    connections.forEach(([fromIdx, toIdx]) => {
      const fromNode = nodes[fromIdx];
      const toNode = nodes[toIdx];

      const points = [
        new THREE.Vector3(fromNode.x, fromNode.y, fromNode.z),
        new THREE.Vector3(toNode.x, toNode.y, toNode.z),
      ];

      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeo, lineMat);
      line.computeLineDistances();
      mainGroup.add(line);
    });

    // -------------------------------------------------------------
    // Moving Flow Pulses (Simulating active SOP data transmission)
    // -------------------------------------------------------------
    const pulseCount = 6;
    const pulsesGeo = new THREE.BufferGeometry();
    const pulsePositions = new Float32Array(pulseCount * 3);
    pulsesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(pulsePositions, 3)
    );

    const pulseMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.6,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const pulsePoints = new THREE.Points(pulsesGeo, pulseMat);
    mainGroup.add(pulsePoints);

    // Subtle Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.25;
      mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.25;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Move pulse points along connector paths
      const attr = pulsesGeo.attributes.position;
      connections.forEach(([fIdx, tIdx], cIdx) => {
        const f = nodes[fIdx];
        const t = nodes[toIdxRef(tIdx)];
        const progress = (time * 0.4 + cIdx * 0.25) % 1;

        const px = f.x + (t.x - f.x) * progress;
        const py = f.y + (t.y - f.y) * progress;
        const pz = f.z + (t.z - f.z) * progress;

        attr.setXYZ(cIdx, px, py, pz);
      });
      attr.needsUpdate = true;

      // Gentle floating animation
      mainGroup.rotation.y = Math.sin(time * 0.2) * 0.08 + mouseX;
      mainGroup.rotation.x = Math.cos(time * 0.25) * 0.05 + mouseY;

      renderer.render(scene, camera);
    };

    function toIdxRef(index: number) {
      return index;
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      boxGeo.dispose();
      pillGeo.dispose();
      diamondGeo.dispose();
      emeraldMat.dispose();
      goldMat.dispose();
      lineMat.dispose();
      pulsesGeo.dispose();
      pulseMat.dispose();
      renderer.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  );
}
