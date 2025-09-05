"use client";

import React, { useState, useEffect } from "react";

interface RandomGirlImageProps {
  onImageRef?: (ref: React.RefObject<HTMLImageElement | null>) => void;
}

// Array of random Indian girl images from Unsplash - moved outside component to prevent recreation
const indianGirlImages = [
  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=600&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=600&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&crop=face"
];

export default function RandomGirlImage({ onImageRef }: RandomGirlImageProps) {
  const [currentImage, setCurrentImage] = useState<string>("");
  const imageRef = React.useRef<HTMLImageElement | null>(null);

  // Expose imageRef to parent component
  useEffect(() => {
    if (onImageRef) {
      onImageRef(imageRef);
    }
  }, [onImageRef]);

  // Pick a random image on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * indianGirlImages.length);
    setCurrentImage(indianGirlImages[randomIndex]);
  }, []); // Empty dependency array - only run once on mount

  // Function to change to a different random image
  const changeImage = () => {
    const randomIndex = Math.floor(Math.random() * indianGirlImages.length);
    setCurrentImage(indianGirlImages[randomIndex]);
  };

  if (!currentImage) {
    return (
      <div style={{ 
        width: "100%", 
        height: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "#f0f0f0"
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: "100%", 
      height: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: "#f8f9fa",
      position: "relative"
    }}>
      <img
        ref={imageRef}
        src={currentImage}
        alt="Random Indian Girl"
        style={{
          width: "300px",
          height: "400px",
          objectFit: "cover",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          border: "3px solid #fff"
        }}
        onError={() => {
          // Fallback to a different image if current one fails
          const randomIndex = Math.floor(Math.random() * indianGirlImages.length);
          setCurrentImage(indianGirlImages[randomIndex]);
        }}
      />
      
      {/* Change Image Button */}
      <button
        onClick={changeImage}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 15px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "bold"
        }}
      >
        Change Image
      </button>
    </div>
  );
}
