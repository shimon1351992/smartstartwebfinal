import React, { useEffect, useRef, useState } from 'react';

// ==========================================================================
// Interactive 3D WebGL LEGO Model Viewer
// Real-time 3D rendered LEGO bricks with studs, lighting, and 360° mouse rotation!
// ==========================================================================

export default function Lego3DViewer({ stepNumber, projectIndex }) {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 22, y: -35 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Mouse drag handlers for 360° rotation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setAutoRotate(false);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setRotation((prev) => ({
      x: Math.max(-60, Math.min(75, prev.x - deltaY * 0.5)),
      y: (prev.y + deltaX * 0.7) % 360,
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.6, Math.min(1.8, prev - e.deltaY * 0.0015)));
  };

  // Touch handlers for mobile/tablets
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setAutoRotate(false);
      lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastMousePos.current.x;
    const deltaY = e.touches[0].clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

    setRotation((prev) => ({
      x: Math.max(-60, Math.min(75, prev.x - deltaY * 0.5)),
      y: (prev.y + deltaX * 0.7) % 360,
    }));
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Auto rotation effect
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotation((prev) => ({ ...prev, y: (prev.y + 0.6) % 360 }));
    }, 20);
    return () => clearInterval(interval);
  }, [autoRotate]);

  // Load Three.js dynamically to render genuine 3D LEGO geometries & materials
  useEffect(() => {
    let renderer, scene, camera, animFrameId;
    let isMounted = true;

    const initThree = () => {
      const THREE = window.THREE;
      if (!THREE || !canvasRef.current) return;

      const container = canvasRef.current.parentElement;
      const width = container.clientWidth || 500;
      const height = container.clientHeight || 360;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf8fafc);

      camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
      camera.position.set(0, 18, 48);
      camera.lookAt(0, 2, 0);

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
      dirLight.position.set(25, 40, 30);
      dirLight.castShadow = true;
      scene.add(dirLight);

      const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.4);
      fillLight.position.set(-25, 20, -20);
      scene.add(fillLight);

      // Floor Shadow Plane
      const shadowPlaneGeo = new THREE.PlaneGeometry(80, 80);
      const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.15 });
      const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = -0.1;
      shadowPlane.receiveShadow = true;
      scene.add(shadowPlane);

      // Group holding the LEGO Model
      const modelGroup = new THREE.Group();
      scene.add(modelGroup);

      // Helper to build realistic 3D LEGO brick with studs
      const createLegoBrick = (w, h, d, colorHex, x = 0, y = 0, z = 0, options = {}) => {
        const brickGroup = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({
          color: colorHex,
          roughness: 0.22,
          metalness: 0.05,
        });

        // Main block
        const boxGeo = new THREE.BoxGeometry(w, h, d);
        const box = new THREE.Mesh(boxGeo, mat);
        box.castShadow = true;
        box.receiveShadow = true;
        brickGroup.add(box);

        // Cylindrical Studs on top
        if (!options.noStuds) {
          const studsX = Math.round(w / 2);
          const studsZ = Math.round(d / 2);
          const studGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.45, 18);

          for (let sx = 0; sx < studsX; sx++) {
            for (let sz = 0; sz < studsZ; sz++) {
              const stud = new THREE.Mesh(studGeo, mat);
              const posX = -w / 2 + 1 + sx * 2;
              const posZ = -d / 2 + 1 + sz * 2;
              stud.position.set(posX, h / 2 + 0.22, posZ);
              stud.castShadow = true;
              brickGroup.add(stud);
            }
          }
        }

        brickGroup.position.set(x, y, z);
        return brickGroup;
      };

      // Helper to build 3D SmartHub
      const createSmartHub = (x, y, z) => {
        const hubGroup = new THREE.Group();
        // White Body 4x8x3
        const hubMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.2 });
        const hubBody = new THREE.Mesh(new THREE.BoxGeometry(8, 4.5, 14), hubMat);
        hubBody.castShadow = true;
        hubGroup.add(hubBody);

        // Circular Green Button
        const btnMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.1 });
        const btn = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.3, 24), btnMat);
        btn.position.set(0, 2.35, 0);
        hubGroup.add(btn);

        // Ports A & B in back
        const portMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
        const portA = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 0.4), portMat);
        portA.position.set(-2, 0.5, 7.1);
        const portB = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 0.4), portMat);
        portB.position.set(2, 0.5, 7.1);
        hubGroup.add(portA);
        hubGroup.add(portB);

        hubGroup.position.set(x, y, z);
        return hubGroup;
      };

      // Helper to build Medium Motor
      const createMotor = (x, y, z) => {
        const motorGroup = new THREE.Group();
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3 });
        const motorBody = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.8, 7.5), bodyMat);
        motorBody.castShadow = true;
        motorGroup.add(motorBody);

        // Red Axle Output Socket
        const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
        const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.5, 16), redMat);
        socket.rotation.z = Math.PI / 2;
        socket.position.set(-2.4, 0, -1.8);
        motorGroup.add(socket);

        motorGroup.position.set(x, y, z);
        return motorGroup;
      };

      // ======================================================================
      // ASSEMBLE 3D MODELS STEP-BY-STEP
      // ======================================================================
      if (projectIndex === 0) {
        // --- DINOSAUR PROJECT ---
        // Step 1: Base Plate 2x16 Black + 2x4 Azure + 2x6 Orange
        modelGroup.add(createLegoBrick(4, 0.7, 32, 0x1e293b, 0, 0.35, 0)); // Plate 2x16 Black
        modelGroup.add(createLegoBrick(4, 2.4, 8, 0x0ea5e9, 0, 1.9, -6)); // Azure 2x4
        modelGroup.add(createLegoBrick(4, 2.4, 8, 0x0284c7, 0, 1.9, 2)); // Azure 2x4
        modelGroup.add(createLegoBrick(4, 0.7, 12, 0xf97316, 0, 3.45, -2)); // Orange 2x6

        if (stepNumber >= 2) {
          // Step 2: SmartHub added on top of base
          modelGroup.add(createSmartHub(0, 5.8, 4));
        }

        if (stepNumber >= 3) {
          // Step 3: Medium Motor + Pulley
          modelGroup.add(createMotor(0, 5.2, -6));
          // Pulley wheel
          const pulleyMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });
          const pulley = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.6, 24), pulleyMat);
          pulley.rotation.z = Math.PI / 2;
          pulley.position.set(-3.2, 5.2, -7.8);
          modelGroup.add(pulley);
        }

        if (stepNumber >= 4) {
          // Step 4: Technic Beam 1x4 Lime Green + Secondary Pulley & Crank
          modelGroup.add(createLegoBrick(2, 2.4, 8, 0x84cc16, 0, 8.2, -7));
          const crankMat = new THREE.MeshStandardMaterial({ color: 0x65a30d });
          const crankArm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.5, 1.2), crankMat);
          crankArm.position.set(-3.5, 8.5, -7);
          modelGroup.add(crankArm);
        }

        if (stepNumber >= 5) {
          // Step 5: Lower Jaw (Orange Plate + Teeth)
          modelGroup.add(createLegoBrick(4, 0.7, 12, 0xf97316, 0, 4.2, -14));
          // White Teeth
          for (let t = 0; t < 3; t++) {
            const toothMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.4, 4), toothMat);
            tooth.position.set(t === 1 ? 0 : t === 0 ? -1.2 : 1.2, 5.2, -18);
            modelGroup.add(tooth);
          }
        }

        if (stepNumber >= 6) {
          // Step 6: Upper Jaw hinged above
          const upperJaw = new THREE.Group();
          upperJaw.add(createLegoBrick(4, 2.4, 16, 0x84cc16, 0, 0, 0));
          // Upper teeth
          for (let t = 0; t < 3; t++) {
            const toothMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.4, 4), toothMat);
            tooth.rotation.x = Math.PI;
            tooth.position.set(t === 1 ? 0 : t === 0 ? -1.2 : 1.2, -1.8, -6 + t * 4);
            upperJaw.add(tooth);
          }
          upperJaw.position.set(0, 10.5, -12);
          upperJaw.rotation.x = -0.32; // Open jaw angle
          modelGroup.add(upperJaw);
        }

        if (stepNumber >= 7) {
          // Step 7: Detect Sensor placed in mouth
          const sensorMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
          const sensor = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), sensorMat);
          // Sensor Eyes
          const eyeLensMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
          const lens1 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16), eyeLensMat);
          lens1.rotation.x = Math.PI / 2;
          lens1.position.set(-1, 0, -2.1);
          const lens2 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16), eyeLensMat);
          lens2.rotation.x = Math.PI / 2;
          lens2.position.set(1, 0, -2.1);
          sensor.add(lens1);
          sensor.add(lens2);

          sensor.position.set(0, 5.5, -12);
          modelGroup.add(sensor);
        }

        if (stepNumber >= 8) {
          // Step 8: Big Cartoon Eyes on top of head
          const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
          const pupilMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

          const eyeL = new THREE.Mesh(new THREE.SphereGeometry(1.3, 18, 18), eyeWhiteMat);
          const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 12), pupilMat);
          pupilL.position.set(0, 0.3, -1.1);
          eyeL.add(pupilL);
          eyeL.position.set(-1.6, 12.8, -12);
          modelGroup.add(eyeL);

          const eyeR = new THREE.Mesh(new THREE.SphereGeometry(1.3, 18, 18), eyeWhiteMat);
          const pupilR = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 12), pupilMat);
          pupilR.position.set(0, 0.3, -1.1);
          eyeR.add(pupilR);
          eyeR.position.set(1.6, 12.8, -12);
          modelGroup.add(eyeR);
        }
      } else {
        // --- CAROUSEL PROJECT ---
        // Base cross
        modelGroup.add(createLegoBrick(2, 2.4, 32, 0x84cc16, 0, 1.2, 0)); // 1x16 Beam
        modelGroup.add(createLegoBrick(32, 2.4, 2, 0x84cc16, 0, 1.2, 0)); // Cross beam

        if (stepNumber >= 2) {
          modelGroup.add(createSmartHub(-8, 5, 0));
        }

        if (stepNumber >= 3) {
          // Turntable 4x4
          const ttMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
          const ttRing = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 1, 32), ttMat);
          ttRing.position.set(4, 2.8, 0);
          modelGroup.add(ttRing);
        }

        if (stepNumber >= 4) {
          // Motor + Bevel Gear + Central vertical axle
          modelGroup.add(createMotor(11, 4.5, 0));
          const gearMat = new THREE.MeshStandardMaterial({ color: 0xfacc15 });
          const bevelGear = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.8, 20), gearMat);
          bevelGear.position.set(4, 4.8, 0);
          modelGroup.add(bevelGear);

          // Vertical Axle 10M
          const axleMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
          const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 20, 12), axleMat);
          axle.position.set(4, 13, 0);
          modelGroup.add(axle);
        }

        if (stepNumber >= 5) {
          // Top Rotor Arms
          modelGroup.add(createLegoBrick(20, 1.2, 2, 0x84cc16, 4, 21, 0));
          modelGroup.add(createLegoBrick(2, 1.2, 20, 0x84cc16, 4, 21, 0));
        }

        if (stepNumber >= 6) {
          // Hanging Snowboards
          const sbMat = new THREE.MeshStandardMaterial({ color: 0xf97316 });
          const sb1 = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 2), sbMat);
          sb1.position.set(-7, 12, 0);
          sb1.rotation.z = 0.4;
          modelGroup.add(sb1);

          const sb2 = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 2), sbMat);
          sb2.position.set(15, 12, 0);
          sb2.rotation.z = -0.4;
          modelGroup.add(sb2);
        }

        if (stepNumber >= 7) {
          // Handheld Tilt Sensor
          const tiltMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
          const tiltSensor = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), tiltMat);
          tiltSensor.position.set(12, 6, 8);
          modelGroup.add(tiltSensor);
        }

        if (stepNumber >= 8) {
          // Flower on top
          const flowerMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
          const flower = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.4, 6), flowerMat);
          flower.position.set(4, 22.5, 0);
          modelGroup.add(flower);
        }
      }

      // Render loop
      const render = () => {
        if (!isMounted) return;
        animFrameId = requestAnimationFrame(render);

        // Apply mouse rotation and zoom smoothly
        modelGroup.rotation.x = (rotation.x * Math.PI) / 180;
        modelGroup.rotation.y = (rotation.y * Math.PI) / 180;
        modelGroup.scale.set(zoom, zoom, zoom);

        renderer.render(scene, camera);
      };

      render();
    };

    // If Three.js is not yet in window, load it
    if (!window.THREE) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.async = true;
      script.onload = () => {
        if (isMounted) initThree();
      };
      document.body.appendChild(script);
    } else {
      initThree();
    }

    return () => {
      isMounted = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [stepNumber, projectIndex, rotation, zoom]);

  const resetView = () => {
    setRotation({ x: 22, y: -35 });
    setZoom(1);
    setAutoRotate(false);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '380px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          maxHeight: '400px',
          outline: 'none',
          display: 'block',
        }}
      />

      {/* 3D Control Hints & Controls Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.92)',
          border: '1.5px solid #cbd5e1',
          borderRadius: '12px',
          padding: '6px 12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(6px)',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#1e293b',
          zIndex: 10,
        }}
      >
        <span>🎮 סובב 360° עם העכבר</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setAutoRotate(!autoRotate);
          }}
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: autoRotate ? '#0284c7' : '#f1f5f9',
            color: autoRotate ? '#ffffff' : '#334155',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          {autoRotate ? 'עצור סיבוב' : 'סובב אוטומטית 🔄'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            resetView();
          }}
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: '#f1f5f9',
            color: '#334155',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          אפס מבט 📐
        </button>
      </div>
    </div>
  );
}
