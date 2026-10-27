import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js';

export default function MapViewer3D({ robotPose, zoomLevel = 1, isThumbnail = false }) {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const robotGroupRef = useRef(null);
  const poseRef = useRef(robotPose);

  useEffect(() => {
    poseRef.current = robotPose;
  }, [robotPose]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdce0e6); // Soft warehouse ambient grey

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 200;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const initialDist = isThumbnail ? 42 : 34;
    camera.position.set(16, initialDist * 0.8, initialDist);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; // Fixed deprecation ts(6385)
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.minDistance = 6;
    controls.maxDistance = 85;
    controlsRef.current = controls;

    // Lights with 3D Depth Shading
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(25, 40, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const secondaryLight = new THREE.DirectionalLight(0xbfdbfe, 0.35);
    secondaryLight.position.set(-20, 25, -20);
    scene.add(secondaryLight);

    // Ground Floor Plan & Grid
    const floorGeo = new THREE.PlaneGeometry(36, 44);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.05,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const grid = new THREE.GridHelper(44, 22, 0xc8ced9, 0xe2e6ee);
    grid.position.y = 0.01;
    scene.add(grid);

    // Outer Perimeter Wall Base
    const wallGeo = new THREE.BoxGeometry(36, 0.4, 44);
    const wallEdges = new THREE.EdgesGeometry(wallGeo);
    const wallLines = new THREE.LineSegments(
      wallEdges,
      new THREE.LineBasicMaterial({ color: 0x1e293b, linewidth: 2 })
    );
    wallLines.position.y = 0.2;
    scene.add(wallLines);

    // Volumetric 3D Obstacle Boxes
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0xf5cfcf,
      roughness: 0.35,
      metalness: 0.05,
    });
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xd98a96, linewidth: 2 });

    const obstacleZones = [
      { w: 5.5, h: 2.2, d: 7.5, x: -5.5, z: -8 },
      { w: 6.0, h: 2.2, d: 7.0, x: 5.5, z: -8 },
      { w: 6.5, h: 2.5, d: 11.5, x: 5.5, z: 7.5 },
      { w: 5.5, h: 2.0, d: 5.5, x: -5.0, z: 8.5 },
      { w: 9.0, h: 2.0, d: 3.5, x: 0, z: -14.5 },
    ];

    obstacleZones.forEach(({ w, h, d, x, z }) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, boxMat);
      mesh.position.set(x, h / 2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      const edges = new THREE.EdgesGeometry(geo);
      const wire = new THREE.LineSegments(edges, edgeMat);
      wire.position.copy(mesh.position);
      scene.add(wire);
    });

    // Sanitized PCD LiDAR Loader
    const originalComputeSphere = THREE.BufferGeometry.prototype.computeBoundingSphere;
    THREE.BufferGeometry.prototype.computeBoundingSphere = function () {
      if (this.attributes.position) {
        const pos = this.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          if (Number.isNaN(pos.getX(i))) return;
        }
      }
      return originalComputeSphere.call(this);
    };

    const pcdLoader = new PCDLoader();
    pcdLoader.load(
      `${import.meta.env.BASE_URL}sample.pcd`,
      (points) => {
        const positions = points.geometry.attributes.position;
        const cleanCoords = [];

        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const y = positions.getY(i);
          const z = positions.getZ(i);

          if (!Number.isNaN(x) && !Number.isNaN(y) && !Number.isNaN(z)) {
            cleanCoords.push(x, y, z);
          }
        }

        const cleanGeo = new THREE.BufferGeometry();
        cleanGeo.setAttribute('position', new THREE.Float32BufferAttribute(cleanCoords, 3));
        cleanGeo.computeBoundingBox();
        cleanGeo.computeBoundingSphere();
        cleanGeo.center();

        const pcdMaterial = new THREE.PointsMaterial({
          color: 0x991b1b,
          size: 0.02,
          transparent: true,
          opacity: 0.75,
        });

        const cleanPointsMesh = new THREE.Points(cleanGeo, pcdMaterial);
        cleanPointsMesh.scale.set(1.8, 1.8, 1.8);
        cleanPointsMesh.rotation.x = -Math.PI / 2;
        cleanPointsMesh.position.set(0, 0.05, 0);

        scene.add(cleanPointsMesh);
        console.log(`✅ [PCD SUCCESS] Cleaned & loaded ${cleanCoords.length / 3} valid LiDAR points.`);
      },
      undefined,
      (err) => {
        console.warn('Fallback to perimeter points:', err);
      }
    );

    // 3D AMR Mobile Robot Marker
    const robotGroup = new THREE.Group();

    // Robot Main Chassis
    const chassisGeo = new THREE.BoxGeometry(1.4, 0.5, 1.8);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.3,
      metalness: 0.6,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 0.35;
    chassis.castShadow = true;
    robotGroup.add(chassis);

    // Cyan LiDAR Sensor Dome
    const puckGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.25, 16);
    const puckMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x0099b8,
      roughness: 0.2,
    });
    const puck = new THREE.Mesh(puckGeo, puckMat);
    puck.position.y = 0.72;
    robotGroup.add(puck);

    // Active LiDAR Scan Sweep Ring
    const scanRingGeo = new THREE.RingGeometry(0.6, 3.8, 32);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });
    const scanRing = new THREE.Mesh(scanRingGeo, scanRingMat);
    scanRing.rotation.x = -Math.PI / 2;
    scanRing.position.y = 0.05;
    robotGroup.add(scanRing);

    // Heading Arrow
    const arrowGeo = new THREE.ConeGeometry(0.25, 0.5, 8);
    const arrowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15 });
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    arrow.rotation.x = -Math.PI / 2;
    arrow.position.set(0, 0.4, -1.1);
    robotGroup.add(arrow);

    // Wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.9 });
    const wheelGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.18, 12);
    [
      [-0.8, 0.2, -0.55],
      [0.8, 0.2, -0.55],
      [-0.8, 0.2, 0.55],
      [0.8, 0.2, 0.55],
    ].forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      robotGroup.add(wheel);
    });

    scene.add(robotGroup);
    robotGroupRef.current = robotGroup;

    // Animation & Render Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (robotGroupRef.current && poseRef.current) {
        robotGroupRef.current.position.x = poseRef.current.x;
        robotGroupRef.current.position.z = poseRef.current.y;
        robotGroupRef.current.rotation.y = poseRef.current.heading;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      THREE.BufferGeometry.prototype.computeBoundingSphere = originalComputeSphere;
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [isThumbnail]);

  // Sync with Zoom Slider
  useEffect(() => {
    if (cameraRef.current && controlsRef.current) {
      const baseDist = isThumbnail ? 42 : 34;
      const targetDist = baseDist / zoomLevel;
      cameraRef.current.position.setLength(targetDist);
      controlsRef.current.update();
    }
  }, [zoomLevel, isThumbnail]);

  return <div ref={mountRef} className="w-full h-full relative cursor-grab active:cursor-grabbing" tabIndex={0} />;
}