"use client";
import React, { useEffect, useState } from "react";

export default function TimeNow() {
  const [timeNow, setTimeNow] = useState("");
  const [time, setTime] = useState("00:00:00");
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      const day = today.toLocaleDateString("id-ID", { weekday: "long" });
      const date = today.toLocaleDateString("id-ID", { day: "numeric" });
      const month = today.toLocaleDateString("id-ID", { month: "long" });
      const year = today.toLocaleDateString("id-ID", { year: "numeric" });
      const time = today.toLocaleTimeString("id-ID", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      setTimeNow(`${day}, ${date} ${month} ${year} `);
      setTime(time.replaceAll(".", ":"));
    });
    return () => {
      clearInterval(interval);
    };
  }, []);

  const Time = (
    <div className="badge badge-secondary badge-outline">{time}</div>
  );

  return (
    <div className="text-gray-500 text-sm py-1">
      {timeNow} {Time}
    </div>
  );
}
