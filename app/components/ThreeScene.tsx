"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeSceneProps {
  onAvatarRef?: (ref: React.RefObject<THREE.Object3D>) => void;
}

export default function ThreeScene({ onAvatarRef }: ThreeSceneProps) {
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
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1, 1, 2).normalize();
    scene.add(light);

    // Create a simple fallback avatar
    const createFallbackAvatar = () => {
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(0, -1.5, 0);
      avatarRef.current = sphere;
      scene.add(sphere);
    };

    // Create fallback avatar immediately
    createFallbackAvatar();

    // Try to load the GLB model in the background
    const loadModel = async () => {
      try {
        // Use a more robust import method
        const GLTFLoaderModule = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const GLTFLoader = GLTFLoaderModule.GLTFLoader;
        
        if (GLTFLoader) {
          const loader = new GLTFLoader();
          
          loader.load(
            "https://models.readyplayer.me/68b9f4396462b71c488cd8ce.glb",
            (gltf) => {
              if (avatarRef.current) {
                scene.remove(avatarRef.current);
              }
              avatarRef.current = gltf.scene;
              avatarRef.current.position.set(0, -1.5, 0);
              scene.add(avatarRef.current);
            },
            undefined,
            (error) => {
              console.error('Error loading GLB model:', error);
              // Keep the fallback avatar
            }
          );
        }
      } catch (error) {
        console.error('Error loading GLTFLoader:', error);
        // Keep the fallback avatar
      }
    };

    // Load model after a short delay to ensure scene is ready
    setTimeout(loadModel, 100);

    camera.position.z = 2.5;

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
