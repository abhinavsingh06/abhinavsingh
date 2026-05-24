"use client";

import { useEffect, useState } from "react";

export default function LiveClock({
  timezone = "Asia/Kolkata",
  label = "IST",
}: {
  timezone?: string;
  label?: string;
}) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setTime(formatter.format(now));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  return (
    <span className="font-mono-sm tabular-nums">
      {time || "--:--:--"} {label}
    </span>
  );
}
