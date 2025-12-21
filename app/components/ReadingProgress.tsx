"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progressValue = (scrollTop / (documentHeight - windowHeight)) * 100;
      setProgress(Math.min(100, Math.max(0, progressValue)));
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress(); // Initial calculation

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-blue-200/20 dark:bg-blue-900/20">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 transition-all duration-150 ease-out shadow-lg shadow-blue-500/30"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
