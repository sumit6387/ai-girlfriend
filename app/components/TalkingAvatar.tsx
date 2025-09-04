"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";




// === Lip Sync Function ===
export function startLipSync(audioEl: HTMLAudioElement, avatarRef: React.RefObject<THREE.Object3D>) {
  const audioCtx = new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const src = audioCtx.createMediaElementSource(audioEl);
  const analyser = audioCtx.createAnalyser();
  src.connect(analyser);
  analyser.connect(audioCtx.destination);

  const data = new Uint8Array(analyser.frequencyBinCount);

  const updateMouth = () => {
    requestAnimationFrame(updateMouth);
    analyser.getByteFrequencyData(data);
    const volume = data.reduce((a, b) => a + b, 0) / data.length;

    if (avatarRef.current) {
      // crude lip sync: scale Y by volume
      const scale = 1 + Math.min(volume / 200, 0.3);
      avatarRef.current.scale.y = scale;
    }
  };
  updateMouth();
}

interface TalkingAvatarProps {
  onAvatarRef?: (ref: React.RefObject<THREE.Object3D>) => void;
}

export default function TalkingAvatar({ onAvatarRef }: TalkingAvatarProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<THREE.Object3D | null>(null);

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
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1, 1, 2).normalize();
    scene.add(light);

    // Load avatar (replace URL with your ReadyPlayerMe GLB)
    const loader = new GLTFLoader();
    loader.load(
      "https://models.readyplayer.me/68b9f4396462b71c488cd8ce.glb",
      (gltf) => {
        avatarRef.current = gltf.scene;
        avatarRef.current.position.set(0, -1.5, 0);
        scene.add(avatarRef.current!);
      }
    );

    camera.position.z = 2.5;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      const currentMount = mountRef.current;
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
}
