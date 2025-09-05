"use client"
import Image from "next/image";
import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime';
import axios from "axios";
import ProtectedRoute from "./components/ProtectedRoute";
import { useRouter } from "next/navigation";
import RandomGirlImage from "./components/RandomGirlImage";
import { useRef } from "react";

export default function Home() {
  const router = useRouter();
  const imageRef = useRef<HTMLImageElement | null>(null);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const audio = (event as any).audio || event;
      const blob = new Blob([audio], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);

      const audioEl = new Audio(url);
      audioEl.play();
      
      // No lip sync needed for static image
      console.log("Audio playing with static image");
    });
    console.log("Started calling agent")
  }
  return (
    <ProtectedRoute>
      <div className="font-sans min-h-screen">
        {/* Header */}
        <header className="w-full flex justify-between items-center p-3 sm:p-4 bg-gray-100 shadow-sm">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Voice Agent</h1>
          <button
            onClick={handleLogout}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            Logout
          </button>
        </header>
        
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
          {/* Image Section */}
          <div className="flex-1 min-h-[50vh] lg:min-h-full">
            <RandomGirlImage onImageRef={(ref) => { imageRef.current = ref.current; }} />
          </div>
          
          {/* Controls Section */}
          <div className="w-full lg:w-80 bg-gray-50 p-4 sm:p-6 flex flex-col justify-center items-center gap-4 lg:gap-6 border-t lg:border-t-0 lg:border-l border-gray-200">
            <div className="text-center mb-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                AI Girlfriend Chat
              </h2>
              <p className="text-sm text-gray-600 hidden sm:block">
                Start a voice conversation with your AI girlfriend
              </p>
            </div>
            
            <button
              className="w-full max-w-sm rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white gap-2 hover:from-pink-600 hover:to-purple-700 font-medium text-sm sm:text-base h-12 sm:h-14 px-4 sm:px-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              onClick={() => handleStartAgent()}
            >
              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Voice call icon"
                width={20}
                height={20}
              />
              <span className="text-center">
                Start Voice Call With Your Girlfriend
              </span>
            </button>
            
            {/* Additional Info */}
            <div className="text-center text-xs text-gray-500 mt-2 hidden sm:block">
              <p>Click the button above to start your conversation</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
