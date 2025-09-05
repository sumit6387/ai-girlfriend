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
      // Find the mouth in the avatar group and scale it for lip sync
      const mouth = avatarRef.current.children.find(child => 
        child.position.y > 0.3 && child.position.z > 0.2
      );
      
      if (mouth) {
        // Scale the mouth based on volume for lip sync effect
        const scale = 1 + Math.min(volume / 100, 0.5);
        mouth.scale.y = scale;
        mouth.scale.x = scale;
      } else {
        // Fallback: scale the entire avatar group
        const scale = 1 + Math.min(volume / 200, 0.1);
        avatarRef.current.scale.y = scale;
      }
    }
  };
  updateMouth();
}

// Dynamically import SimpleAvatar to avoid SSR issues
const SimpleAvatar = dynamic(() => import('./SimpleAvatar'), {
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
  return <SimpleAvatar onAvatarRef={onAvatarRef} />;
}
