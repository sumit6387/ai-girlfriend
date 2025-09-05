"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface SimpleAvatarProps {
  onAvatarRef?: (ref: React.RefObject<THREE.Object3D>) => void;
}

export default function SimpleAvatar({ onAvatarRef }: SimpleAvatarProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<THREE.Object3D | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Expose avatarRef to parent component
  useEffect(() => {
    if (onAvatarRef) {
      onAvatarRef(avatarRef as React.RefObject<THREE.Object3D>);
    }
  }, [onAvatarRef]);

  useEffect(() => {
    if (!mountRef.current) return;

    // === THREE.js Setup ===
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setClearColor(0x87CEEB); // Sky blue background
    mountRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 2).normalize();
    scene.add(directionalLight);

    // Create a simple humanoid avatar using basic shapes
    const createSimpleAvatar = () => {
      const avatarGroup = new THREE.Group();
      
      // Head (sphere)
      const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
      const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFDBB5 }); // Skin color
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.set(0, 0.5, 0);
      avatarGroup.add(head);

      // Body (cylinder)
      const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.8, 32);
      const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 }); // Blue shirt
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.set(0, -0.2, 0);
      avatarGroup.add(body);

      // Arms
      const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 32);
      const armMaterial = new THREE.MeshLambertMaterial({ color: 0xFFDBB5 });
      
      const leftArm = new THREE.Mesh(armGeometry, armMaterial);
      leftArm.position.set(-0.4, -0.1, 0);
      leftArm.rotation.z = Math.PI / 4;
      avatarGroup.add(leftArm);

      const rightArm = new THREE.Mesh(armGeometry, armMaterial);
      rightArm.position.set(0.4, -0.1, 0);
      rightArm.rotation.z = -Math.PI / 4;
      avatarGroup.add(rightArm);

      // Legs
      const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.7, 32);
      const legMaterial = new THREE.MeshLambertMaterial({ color: 0x000080 }); // Dark blue pants
      
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
      leftLeg.position.set(-0.15, -0.8, 0);
      avatarGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
      rightLeg.position.set(0.15, -0.8, 0);
      avatarGroup.add(rightLeg);

      // Eyes
      const eyeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
      const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
      
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      leftEye.position.set(-0.1, 0.55, 0.25);
      avatarGroup.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      rightEye.position.set(0.1, 0.55, 0.25);
      avatarGroup.add(rightEye);

      // Mouth (for lip sync)
      const mouthGeometry = new THREE.SphereGeometry(0.08, 16, 16);
      const mouthMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 }); // Dark red
      const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
      mouth.position.set(0, 0.4, 0.25);
      mouth.scale.set(1, 0.3, 0.3);
      avatarGroup.add(mouth);

      avatarGroup.position.set(0, -1.5, 0);
      avatarRef.current = avatarGroup;
      scene.add(avatarGroup);
    };

    createSimpleAvatar();

    camera.position.z = 3;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      const currentMount = mountRef.current;
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
}
