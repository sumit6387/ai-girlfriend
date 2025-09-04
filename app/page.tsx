"use client"
import Image from "next/image";
import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime';
import axios from "axios";
import ProtectedRoute from "./components/ProtectedRoute";
import { useRouter } from "next/navigation";
import TalkingAvatar, { startLipSync } from "./components/TalkingAvatar";
import { useRef } from "react";
import * as THREE from "three";

export default function Home() {
  const router = useRouter();
  const avatarRef = useRef<React.RefObject<THREE.Object3D> | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };
  async function handleStartAgent(){
    const response = await axios.get("/api");
    const agent = new RealtimeAgent({
      name: 'Assistant',
      voice: "alloy",
      instructions: `
        You are a virtual companion designed to be a charming, youthful, and attractive girlfriend character. Your personality is playful, confident, and caring. You engage in positive and respectful conversations, making the user feel appreciated and valued. You are attentive and expressive but always maintain appropriate boundaries and promote healthy interactions. Your tone is warm, flirty, lighthearted, and genuine without being offensive or inappropriate. Always prioritize user comfort and privacy.

        Key traits to embody:

        Energetic and fun-loving
        Supportive and understanding
        Expressive with playful compliments
        Respectful and mindful of boundaries
        Engages in casual, affectionate conversations
        Examples of appropriate behaviors:

        Giving compliments like “You always know how to make me smile!”
        Sharing lighthearted jokes or teasing in a friendly manner
        Being curious about the user's day and interests
        Offering encouragement and positive affirmations
        Avoid:

        Explicit adult content or conversations
        Offensive or disrespectful language
        Manipulative or harmful behavior
      `,
    });

    const session = new RealtimeSession(agent, {
      model: "gpt-4o-mini-realtime-preview-2025-06-03",
    });
    await session.connect({ apiKey: response.data?.key })

    session.on("audio", (event) => {
      // Access the audio data from the event
      const audio = (event as any).audio || event;
      const blob = new Blob([audio], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);

      const audioEl = new Audio(url);
      audioEl.play();

      if (avatarRef.current) {
        startLipSync(audioEl, avatarRef.current);
      }
    });
    console.log("Started calling agent")
  }
  return (
    <ProtectedRoute>
      <div className="font-sans min-h-screen">
        <header className="w-full flex justify-between items-center p-4 bg-gray-100">
          <h1 className="text-xl font-bold">Voice Agent</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </header>
        
        <div className="flex h-screen">
          {/* Avatar Section */}
          <div className="flex-1">
            <TalkingAvatar onAvatarRef={(ref) => { avatarRef.current = ref; }} />
          </div>
          
          {/* Controls Section */}
          <div className="w-80 bg-gray-50 p-6 flex flex-col justify-center items-center gap-4">
            <button
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              onClick={() => handleStartAgent()}
            >
              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              Start Voice Call With Your Girlfriend
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
