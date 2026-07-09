"use client";

import { useEffect, useState } from "react";

export default function IntroLoader() {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 1. Simulate the progress bar filling up (takes ~2.2 seconds)
    const duration = 2200; // total duration in ms
    const intervalTime = 25; // update every 25ms
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Add subtle randomized speed to make the loader feel organic and active
        const rand = Math.random() * 0.8 + 0.6; // multiplier between 0.6 and 1.4
        return Math.min(prev + step * rand, 100);
      });
    }, intervalTime);

    // 2. Start fading out slightly before full progress is reached
    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 350);

    // 3. Unmount the loader completely from the DOM
    const unmountTimer = setTimeout(() => {
      setVisible(false);
    }, duration + 350); // allow fadeout transition to finish

    return () => {
      clearInterval(timer);
      clearTimeout(fadeOutTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#101415] transition-all duration-700 ease-out ${fadeOut ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
        }`}
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="flex flex-col items-center select-none text-center">
        {/* Glowing Logo Circle */}
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/5 shadow-[0_0_40px_rgba(59,130,246,0.12)]">
          {/* Animated pulsing outer ring */}
          <div className="absolute inset-0 rounded-full border border-blue-400/20 animate-ping opacity-60" style={{ animationDuration: '2s' }} />

          {/* Train Front Logo (Futuristic Silhouette) */}
          <svg
            viewBox="0 0 100 100"
            className="h-12 w-12 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Moving Tracks Effect */}
            <path
              d="M30 85 L10 100 M70 85 L90 100"
              stroke="rgba(59, 130, 246, 0.25)"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="animate-track-slide"
            />
            {/* Rails */}
            <path d="M35 85 L25 100 M65 85 L75 100" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />

            {/* Train Face */}
            <path
              d="M35 80 C35 80 32 75 32 60 C32 42 40 32 50 32 C60 32 68 42 68 60 C68 75 65 80 65 80 Z"
              fill="#101415"
              stroke="#3b82f6"
              strokeWidth="2.5"
            />

            {/* Windshield */}
            <path
              d="M38 52 C38 52 42 44 50 44 C58 44 62 52 62 52 Z"
              fill="rgba(59, 130, 246, 0.15)"
              stroke="#60a5fa"
              strokeWidth="1.5"
            />

            {/* Accent V-line */}
            <path d="M45 68 L50 71 L55 68" stroke="#3b82f6" strokeWidth="1.5" />

            {/* Glowing Headlights */}
            <circle cx="41" cy="73" r="2.5" fill="#60a5fa" className="animate-pulse" />
            <circle cx="59" cy="73" r="2.5" fill="#60a5fa" className="animate-pulse" />

            {/* Top Spotlight */}
            <circle cx="50" cy="38" r="2" fill="#ffffff" />
          </svg>
        </div>

        {/* Text Container with letter-reveal animation style */}
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-[0.25em] md:tracking-[0.35em] text-white uppercase transition-all duration-1000">
            EDU<span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(59,130,246,0.35)]">RAIL</span>
          </h1>
          <p className="text-[10px] md:text-xs font-medium tracking-[0.2em] md:tracking-[0.25em] text-gray-500 uppercase">
            Sentra Edukasi Perkeretaapian
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="relative mt-8 w-44 md:w-56 h-[3px] rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Tracker */}
        <span className="mt-2 text-[9px] font-mono tracking-widest text-blue-500/70">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
