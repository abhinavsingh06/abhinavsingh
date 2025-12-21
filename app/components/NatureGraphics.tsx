"use client";

export default function NatureGraphics() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Animated Waves */}
      <svg
        className="absolute left-[10%] top-[20%] h-16 w-16 text-blue-400/30 animate-wave-float"
        style={{ animationDelay: "0s" }}
        viewBox="0 0 24 24"
        fill="none">
        <path
          d="M2 12c0 0 3-4 10-4s10 4 10 4M2 16c0 0 3-4 10-4s10 4 10 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </svg>
      <svg
        className="absolute right-[15%] top-[30%] h-12 w-12 text-cyan-400/30 animate-wave-float"
        style={{ animationDelay: "2s" }}
        viewBox="0 0 24 24"
        fill="none">
        <path
          d="M2 12c0 0 3-4 10-4s10 4 10 4M2 16c0 0 3-4 10-4s10 4 10 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>
      <svg
        className="absolute left-[20%] bottom-[25%] h-14 w-14 text-teal-400/30 animate-wave-float"
        style={{ animationDelay: "4s" }}
        viewBox="0 0 24 24"
        fill="none">
        <path
          d="M2 12c0 0 3-4 10-4s10 4 10 4M2 16c0 0 3-4 10-4s10 4 10 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />
      </svg>

      {/* Ocean Bubbles */}
      <div className="absolute left-[30%] top-[60%] h-3 w-3 rounded-full bg-cyan-400/40 animate-bubble-rise"></div>
      <div
        className="absolute right-[35%] top-[45%] h-2 w-2 rounded-full bg-blue-400/40 animate-bubble-rise"
        style={{ animationDelay: "1.5s" }}></div>
      <div
        className="absolute left-[45%] top-[70%] h-2.5 w-2.5 rounded-full bg-teal-400/40 animate-bubble-rise"
        style={{ animationDelay: "3s" }}></div>
      <div
        className="absolute right-[20%] top-[65%] h-2 w-2 rounded-full bg-cyan-500/35 animate-bubble-rise"
        style={{ animationDelay: "2s" }}></div>
      <div
        className="absolute left-[60%] top-[50%] h-1.5 w-1.5 rounded-full bg-aqua-400/40 animate-bubble-rise"
        style={{ animationDelay: "1s" }}></div>
      <div
        className="absolute right-[50%] top-[55%] h-2 w-2 rounded-full bg-blue-500/35 animate-bubble-rise"
        style={{ animationDelay: "2.5s" }}></div>

      {/* Coral/Seaweed Graphics */}
      <svg
        className="absolute left-[5%] top-[40%] h-20 w-20 text-teal-600/20 animate-wave-sway"
        style={{ animationDelay: "0.5s" }}
        viewBox="0 0 24 24"
        fill="none">
        <path
          d="M12 2 L12 20 M12 8 Q8 6 6 10 M12 14 Q16 12 18 16 M12 10 Q10 8 8 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
      <svg
        className="absolute right-[8%] top-[50%] h-24 w-24 text-cyan-600/20 animate-wave-sway"
        style={{ animationDelay: "2.5s" }}
        viewBox="0 0 24 24"
        fill="none">
        <path
          d="M12 2 L12 20 M12 8 Q8 6 6 10 M12 14 Q16 12 18 16 M12 10 Q10 8 8 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>

      {/* Ocean Particles */}
      <div className="absolute left-[25%] top-[75%] h-1.5 w-1.5 rounded-full bg-blue-400/40 animate-ocean-pulse"></div>
      <div
        className="absolute right-[30%] top-[60%] h-1 w-1 rounded-full bg-cyan-400/40 animate-ocean-pulse"
        style={{ animationDelay: "1.5s" }}></div>
      <div
        className="absolute left-[50%] top-[80%] h-2 w-2 rounded-full bg-teal-400/40 animate-ocean-pulse"
        style={{ animationDelay: "3s" }}></div>
      <div
        className="absolute right-[15%] top-[70%] h-1.5 w-1.5 rounded-full bg-blue-500/35 animate-ocean-pulse"
        style={{ animationDelay: "2s" }}></div>
    </div>
  );
}
