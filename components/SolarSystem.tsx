'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SolarSystem() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Pencahayaan
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xfffaed, 3.5, 300);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // 3. Bintang Lembut (Starfield)
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 3000;
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 300;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      map: createStarTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // 4. Matahari Dinamis
    // 4. Matahari Dinamis (Glow Lembut dengan Sprite & Canvas Texture)
    
    // Fungsi untuk menggambar gradien cahaya lembut
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Buat gradien melingkar dari tengah ke luar
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, 'rgba(255, 230, 150, 1)'); // Putih kekuningan di inti
        gradient.addColorStop(0.2, 'rgba(255, 150, 0, 0.8)'); // Kuning oranye panas
        gradient.addColorStop(0.5, 'rgba(200, 50, 0, 0.4)'); // Merah memudar
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Transparan di ujung
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const sunGroup = new THREE.Group();

    // Inti Matahari Padat
    const sunGeometry = new THREE.SphereGeometry(2.2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xfff5e6 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sunGroup.add(sun);

    // Material Glow (Additive Blending + tanpa menulis ke depth buffer agar tidak memotong planet)
    const glowMaterial = new THREE.SpriteMaterial({
      map: createGlowTexture(),
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false, 
    });

    // Korona Bulat (Cahaya menyebar ke segala arah)
    const sunCorona = new THREE.Sprite(glowMaterial);
    sunCorona.scale.set(12, 12, 1);
    sunGroup.add(sunCorona);

    // Flare Horizontal (Pendaran melebar seperti garis ekuator)
    const sunFlare = new THREE.Sprite(glowMaterial);
    sunFlare.scale.set(28, 4, 1);
    sunGroup.add(sunFlare);

    scene.add(sunGroup);

    // 5. Konfigurasi 8 Planet Lengkap
    const planetConfigs = [
      { name: 'Merkurius', color: 0xaaaaaa, size: 0.20, distance: 3.8, speed: 0.030 },
      { name: 'Venus', color: 0xe3bb76, size: 0.35, distance: 5.5, speed: 0.022 },
      { name: 'Bumi', color: 0x3388ff, size: 0.38, distance: 7.5, speed: 0.016 },
      { name: 'Mars', color: 0xff5522, size: 0.28, distance: 9.8, speed: 0.012 },
      { name: 'Jupiter', color: 0xd4a373, size: 0.85, distance: 13.0, speed: 0.008 },
      { name: 'Saturnus', color: 0xf4e2bb, size: 0.65, distance: 16.5, speed: 0.006, hasRings: true, ringRotation: 'horizontal' },
      { name: 'Uranus', color: 0x76c7c0, size: 0.45, distance: 19.8, speed: 0.004, hasRings: true, ringRotation: 'vertical' },
      { name: 'Neptunus', color: 0x2b65ec, size: 0.43, distance: 22.8, speed: 0.003 },
    ];

    const planets: { mesh: THREE.Group; distance: number; angle: number; speed: number }[] = [];

    planetConfigs.forEach((config) => {
      // Garis Orbit
      const orbitGeometry = new THREE.RingGeometry(config.distance - 0.02, config.distance + 0.02, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.08 });
      const orbitLine = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbitLine.rotation.x = Math.PI / 2;
      scene.add(orbitLine);

      const planetGroup = new THREE.Group();
      
      const geometry = new THREE.SphereGeometry(config.size, 32, 32);
      const material = new THREE.MeshStandardMaterial({ 
        color: config.color,
        roughness: 0.5,
        metalness: 0.2,
        emissive: config.color,
        emissiveIntensity: 0.1,
      });
      const mesh = new THREE.Mesh(geometry, material);
      planetGroup.add(mesh);

      // Cincin Saturnus & Uranus
      if (config.hasRings) {
        const ringGeo = new THREE.RingGeometry(config.size + 0.2, config.size + 0.8, 32);
        const ringMat = new THREE.MeshStandardMaterial({ 
          color: config.ringRotation === 'vertical' ? 0x76c7c0 : 0xd2b48c, 
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        
        if (config.ringRotation === 'vertical') {
          ring.rotation.y = Math.PI / 2;
        } else {
          ring.rotation.x = Math.PI / 2;
        }
        planetGroup.add(ring);
      }

      scene.add(planetGroup);

      planets.push({
        mesh: planetGroup,
        distance: config.distance,
        angle: Math.random() * Math.PI * 2,
        speed: config.speed,
      });
    });

    camera.position.set(0, 9, 22);
    camera.lookAt(0, 0, 0);

    // 6. Mouse Parallax Effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 7. Animasi Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      sun.rotation.y += 0.003;
      starField.rotation.y += 0.0002;

      planets.forEach((planet) => {
        planet.angle += planet.speed;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
        planet.mesh.rotation.y += 0.01;
      });

      targetX += (mouseX * 1.5 - targetX) * 0.05;
      targetY += (mouseY * 1.5 - targetY) * 0.05;
      
      camera.position.x = targetX;
      camera.position.y = 9 + targetY;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-10 overflow-hidden bg-black" />;
}