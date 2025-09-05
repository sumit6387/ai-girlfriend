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
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-pink-600 font-medium">Loading your girlfriend...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 relative overflow-hidden">
      <img
        ref={imageRef}
        src={currentImage}
        alt="Random Indian Girl"
        className="w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[28rem] lg:w-72 lg:h-96 xl:w-80 xl:h-[28rem] object-cover rounded-3xl shadow-2xl border-4 border-white transition-all duration-300 hover:scale-105"
        onError={() => {
          // Fallback to a different image if current one fails
          const randomIndex = Math.floor(Math.random() * indianGirlImages.length);
          setCurrentImage(indianGirlImages[randomIndex]);
        }}
      />
      
      {/* Change Image Button */}
      <button
        onClick={changeImage}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none rounded-lg cursor-pointer text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 z-10"
      >
        <span className="hidden sm:inline">Change Image</span>
        <span className="sm:hidden">🔄</span>
      </button>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-4 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-8 w-1.5 h-1.5 bg-pink-300 rounded-full animate-pulse delay-500"></div>
    </div>
  );
}
