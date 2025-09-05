"use client";

import React from "react";
import * as THREE from "three";
import dynamic from "next/dynamic";

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

// Dynamically import ThreeScene to avoid SSR issues
const ThreeScene = dynamic(() => import('./ThreeScene'), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      Loading Avatar...
    </div>
  )
});

interface TalkingAvatarProps {
  onAvatarRef?: (ref: React.RefObject<THREE.Object3D>) => void;
}

export default function TalkingAvatar({ onAvatarRef }: TalkingAvatarProps) {
  return <ThreeScene onAvatarRef={onAvatarRef} />;
}
