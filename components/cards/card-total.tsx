import React, { useEffect, useState } from "react";
import "./card-item.css";

interface CardItemProps {
  loading?: boolean;
  icon: React.ReactNode;
  total: number;
  text: string;
  className?: string;
}

interface CountUpProps {
  endValue: number;
  duration: number;
}

export default function CardItem({
  loading = false,
  icon,
  total,
  text,
  className = "card-primary",
}: CardItemProps) {
  return (
    <div
      className={`card-item shadow-lg rounded-md flex items-center justify-between p-3 font-medium space-x-4 ${className} group`}
    >
      <div
        className={`flex justify-center items-center w-14 h-14 transition-all duration-300 transform group-hover:scale-110 icon`}
      >
        {icon}
      </div>
      <div className={`text-right ${loading ? "animate-pulse" : ""}`}>
        <p className={`text-xl font-bold min-w-[200px]`}>
          <span
            className={`text-4xl font-bold px-2 ${
              loading
                ? "rounded min-h-5 bg-gray-200 text-transparent min-w-[50px]"
                : ""
            }`}
          >
            <CountUp endValue={total} duration={1} />
          </span>
        </p>
        <p
          className={`px-2 ${
            loading
              ? "rounded min-h-5 bg-gray-200 min-w-[50px] text-transparent"
              : ""
          }`}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

export function CardSimple() {
  return <div className="div">CardSimple</div>;
}

export function CountUp({ endValue, duration }: CountUpProps) {
  const [currentValue, setCurrentValue] = useState(0);
  const stepValue = Math.ceil(endValue / (duration * 60)); // Menghitung nilai tambahan per langkah animasi

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentValue((prevValue) => {
        const nextValue = prevValue + stepValue;
        return nextValue > endValue ? endValue : nextValue;
      });
    }, 1000 / 60); // 60 frame per detik (durasi 1 detik)

    return () => clearInterval(interval);
  }, [endValue, stepValue]);

  return currentValue.toLocaleString("id-ID", { useGrouping: true });
}
