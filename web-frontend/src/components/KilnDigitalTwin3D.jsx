import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Flame, Thermometer, Layers, Radio, ShieldCheck, Eye, Layers3 } from 'lucide-react';

export const KilnDigitalTwin3D = ({ theme = 'dark', showHeader = true }) => {
  const mountRef = useRef(null);

  // Multi-Kiln List Switcher
  const [selectedKilnId, setSelectedKilnId] = useState('kiln-1');
  
  const kilns = [
    { id: 'kiln-1', name: 'Kiln #1 • Plot A (Maize Cob Residue)', defaultTemp: 58.5, defaultHeight: 30.0 },
    { id: 'kiln-2', name: 'Kiln #2 • Plot B (Coffee Husk Residue)', defaultTemp: 64.0, defaultHeight: 22.0 },
    { id: 'kiln-3', name: 'Kiln #3 • Outgrower Plot (Sugarcane Bagasse)', defaultTemp: 52.0, defaultHeight: 36.0 }
  ];

  const currentKiln = kilns.find(k => k.id === selectedKilnId) || kilns[0];

  const [outerTempC, setOuterTempC] = useState(currentKiln.defaultTemp);
  const [biocharHeightCM, setBiocharHeightCM] = useState(currentKiln.defaultHeight);
  const [isBurning, setIsBurning] = useState(true);
  const [wireframe, setWireframe] = useState(false);

  const handleKilnChange = (id) => {
    setSelectedKilnId(id);
    const k = kilns.find(item => item.id === id);
    if (k) {
      setOuterTempC(k.defaultTemp);
      setBiocharHeightCM(k.defaultHeight);
    }
  };

  // Steinhart-Hart estimate equation
  const coreEstTempC = ((outerTempC * 7.85) + 112.5).toFixed(1);
  const biocharYieldKg = (((85.0 - biocharHeightCM) * 1.45)).toFixed(1);
  const creditYieldTons = (biocharYieldKg * 0.00274).toFixed(3);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme === 'dark' ? 0x120e0c : 0xfdfbf7);

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.2, 7.2);
    camera.lookAt(0, 0, 0);

    // WebGL Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Grid Floor Helper
    const gridColor = theme === 'dark' ? 0x443028 : 0xd6c7b2;
    const gridHelper = new THREE.GridHelper(12, 24, gridColor, gridColor);
    gridHelper.position.y = -1.6;
    scene.add(gridHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, theme === 'dark' ? 0.8 : 1.1);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Terracotta Fire Point Light
    const thermalPointLight = new THREE.PointLight(0xea580c, isBurning ? 4.0 : 0.2, 12);
    thermalPointLight.position.set(0, 0, 0);
    scene.add(thermalPointLight);

    // Kiln Group
    const kilnGroup = new THREE.Group();
    scene.add(kilnGroup);

    // 1. Translucent 200L Steel Drum Shell (Soil Brown / Terracotta)
    const drumGeo = new THREE.CylinderGeometry(1.2, 1.2, 3.0, 32, 1, true);
    const drumMat = new THREE.MeshPhysicalMaterial({
      color: theme === 'dark' ? 0x78350f : 0x92400e,
      transparent: true,
      opacity: 0.65,
      roughness: 0.2,
      metalness: 0.7,
      wireframe: wireframe,
      side: THREE.DoubleSide
    });
    const drum = new THREE.Mesh(drumGeo, drumMat);
    kilnGroup.add(drum);

    // Forest Green Steel Ribs
    const ribGeo = new THREE.TorusGeometry(1.21, 0.038, 16, 32);
    const ribMat = new THREE.MeshStandardMaterial({ color: 0x15803d, metalness: 0.8, roughness: 0.3 });
    
    const ribUpper = new THREE.Mesh(ribGeo, ribMat);
    ribUpper.rotation.x = Math.PI / 2;
    ribUpper.position.y = 0.65;
    kilnGroup.add(ribUpper);

    const ribLower = new THREE.Mesh(ribGeo, ribMat);
    ribLower.rotation.x = Math.PI / 2;
    ribLower.position.y = -0.65;
    kilnGroup.add(ribLower);

    // 2. Kiln Lid & Chimney
    const lidGeo = new THREE.CylinderGeometry(1.22, 1.22, 0.08, 32);
    const lidMat = new THREE.MeshStandardMaterial({ color: 0x443028, metalness: 0.8, roughness: 0.3 });
    const lid = new THREE.Mesh(lidGeo, lidMat);
    lid.position.y = 1.54;
    kilnGroup.add(lid);

    const chimneyGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.85, 24);
    const chimney = new THREE.Mesh(chimneyGeo, lidMat);
    chimney.position.y = 1.96;
    kilnGroup.add(chimney);

    // 3. Sensor Casing (Forest Green)
    const sensorCasingGeo = new THREE.BoxGeometry(0.35, 0.22, 0.45);
    const sensorCasingMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.2 });
    const sensorCasing = new THREE.Mesh(sensorCasingGeo, sensorCasingMat);
    sensorCasing.position.set(0.7, 2.14, 0);
    kilnGroup.add(sensorCasing);

    // 4. Biochar Layer inside Drum
    const charHeightScale = (biocharHeightCM / 85.0) * 2.8;
    const charGeo = new THREE.CylinderGeometry(1.15, 1.15, Math.max(0.1, charHeightScale), 32);
    const charMat = new THREE.MeshStandardMaterial({ color: 0x1c1512, roughness: 0.95 });
    const charBed = new THREE.Mesh(charGeo, charMat);
    charBed.position.y = -1.5 + (charHeightScale / 2);
    kilnGroup.add(charBed);

    // 5. Terracotta Fire Particles
    const particleCount = 140;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 1.8;
      particlePositions[i * 3 + 1] = -1.2 + Math.random() * 2.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
      particleSpeeds[i] = 0.012 + Math.random() * 0.02;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf97316,
      size: 0.085,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particlesGeo, particleMat);
    if (isBurning) {
      kilnGroup.add(particleSystem);
    }

    // Interactive Orbit Mouse Drag
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      kilnGroup.rotation.y += deltaX * 0.008;
      kilnGroup.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging) {
        kilnGroup.rotation.y += 0.003;
      }

      if (isBurning) {
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += particleSpeeds[i];
          if (positions[i * 3 + 1] > 1.4) {
            positions[i * 3 + 1] = -1.2;
          }
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [biocharHeightCM, isBurning, wireframe, theme, selectedKilnId]);

  return (
    <div className="space-y-4 animate-fadeIn font-mono text-xs">
      
      {/* Optional Top Header & Multi-Kiln Switcher */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#443028]/40 gap-3">
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="text-base font-bold text-orange-500 font-sans">
                3D Smart Kiln Representation & Sensor Telemetry
              </h3>
              <span className="bg-emerald-950/40 border border-emerald-700/60 text-emerald-500 font-mono text-[11px] px-2 py-0.5 rounded-full flex items-center space-x-1 font-bold">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>Sensors Live</span>
              </span>
            </div>
            <p className="text-stone-700 dark:text-stone-300 text-xs mt-0.5 font-bold">
              Tracks residue height levels & pyrolysis temps to accurately determine biochar production & carbon credits.
            </p>
          </div>

          {/* Multi-Kiln Dropdown Selector */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-[#1c1512] border border-[#443028] px-2.5 py-1.5 rounded-xl">
              <Layers3 className="w-4 h-4 text-orange-500" />
              <select
                value={selectedKilnId}
                onChange={(e) => handleKilnChange(e.target.value)}
                className="bg-transparent font-mono text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                {kilns.map((k) => (
                  <option key={k.id} value={k.id} className="bg-[#1c1512] text-white">
                    {k.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setWireframe(!wireframe)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-mono border border-[#443028] text-stone-800 dark:text-stone-200 hover:border-orange-500 cursor-pointer font-bold"
            >
              {wireframe ? 'Mesh' : 'Wire'}
            </button>
          </div>
        </div>
      )}

      {/* Sensor Ribbon Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-[#1c1512] border border-[#443028] flex items-center space-x-2 text-amber-400 font-bold">
          <Thermometer className="w-4 h-4" />
          <span>Skin Temp: {outerTempC}°C</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#1c1512] border border-[#443028] flex items-center space-x-2 text-orange-400 font-bold">
          <Flame className="w-4 h-4" />
          <span>Core Temp: ~{coreEstTempC}°C</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#1c1512] border border-[#443028] flex items-center space-x-2 text-emerald-400 font-bold">
          <Layers className="w-4 h-4" />
          <span>Yield: {biocharYieldKg} KG ({creditYieldTons} tCO2e)</span>
        </div>
      </div>

      {/* 3D Canvas Viewport + Sensor Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Three.js Canvas */}
        <div className="lg:col-span-2 rounded-2xl border border-[#443028] overflow-hidden relative shadow-lg min-h-[380px] h-[380px] cursor-grab active:cursor-grabbing bg-[#120e0c]">
          <div ref={mountRef} className="w-full h-full" />

          <div className="absolute bottom-3 right-3 bg-[#1c1512]/90 px-2.5 py-1 rounded-lg text-[10px] font-mono text-stone-300 pointer-events-none flex items-center space-x-1 border border-[#443028]">
            <Eye className="w-3.5 h-3.5 text-orange-500" />
            <span>Click & Drag 3D Barrel</span>
          </div>
        </div>

        {/* Sensor Calibration Controls */}
        <div className="space-y-4 font-mono text-xs">
          <div className="earthy-box p-5 space-y-3">
            <div className="flex justify-between font-bold">
              <span className="text-stone-900 dark:text-stone-100">Residue Height (Sonar)</span>
              <span className="text-emerald-500 font-bold">{biocharHeightCM} cm</span>
            </div>
            <input
              type="range"
              min="5"
              max="65"
              step="1"
              value={biocharHeightCM}
              onChange={(e) => setBiocharHeightCM(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-bold">
              <span className="text-red-500">&lt; 25% (Ash)</span>
              <span className="text-emerald-500">30% - 40% (Biochar)</span>
              <span className="text-amber-500">&gt; 50%</span>
            </div>
          </div>

          <div className="earthy-box p-5 space-y-3">
            <div className="flex justify-between font-bold">
              <span className="text-stone-900 dark:text-stone-100">Skin Thermistor (Temp)</span>
              <span className="text-orange-500 font-bold">{outerTempC}°C</span>
            </div>
            <input
              type="range"
              min="30"
              max="90"
              step="0.5"
              value={outerTempC}
              onChange={(e) => setOuterTempC(Number(e.target.value))}
              className="w-full accent-orange-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-bold">
              <span>30°C</span>
              <span className="text-emerald-500">40°C - 75°C Valid</span>
              <span className="text-red-500">90°C</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-600/40 bg-emerald-950/20 text-xs space-y-1">
            <span className="text-emerald-500 font-bold flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Biochar Credit Verification</span>
            </span>
            <p className="text-stone-700 dark:text-stone-300 text-[11px] font-bold">
              Yield calculated: {biocharYieldKg} KG biochar ({creditYieldTons} Metric Tons CO2e credits).
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
