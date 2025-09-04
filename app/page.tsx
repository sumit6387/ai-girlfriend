"use client"
import Image from "next/image";
import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime';
import axios from "axios";



export default function Home() {
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
    console.log("Started calling agent")
  }
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
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
            Start Agent
          </button>
        </div>
      </main>
    </div>
  );
}
