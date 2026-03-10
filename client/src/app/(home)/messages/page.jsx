'use client'
import { useEffect, useState } from "react";

export default function Page() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div
        className={`p-8 rounded-3xl shadow-xl bg-white text-center transform transition-all duration-700 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700 animate-bounce">
          Please select a conversation
        </h1>
        <p className="mt-2 text-blue-400">Your chats will appear here once selected.</p>
      </div>
    </div>
  );
}