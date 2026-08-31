"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const FlashSaleSection = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 14,
    hours: 9,
    minutes: 6,
    seconds: 38,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timerUnits = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HRS", value: timeLeft.hours },
    { label: "MINS", value: timeLeft.minutes },
    { label: "SECS", value: timeLeft.seconds },
  ];

  return (
    <section className="bg-gray-50 py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="relative overflow-hidden rounded-2xl bg-[url('/images/flash-sale-bg.png')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

          <div className="relative flex flex-col gap-5 px-6 py-8 md:px-10 md:flex-row md:items-center md:justify-between">
            {/* Left: Label + heading */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-600/30 border border-rose-400/40 mb-3">
                <svg className="w-3.5 h-3.5 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-300">Limited Time</span>
              </div>
              <h2 className="text-2xl font-bold leading-tight md:text-3xl lg:text-4xl tracking-tight">
                Flash Sale <span className="text-rose-400">Now On!</span>
              </h2>
              <p className="mt-1.5 text-sm text-white/70 md:text-base">
                Score big savings on all your favorites
              </p>
            </div>

            {/* Right: Timer + CTA */}
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              {/* Timer */}
              <div className="flex items-center gap-2">
                {timerUnits.map(({ label, value }, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="text-center">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-xl md:text-2xl font-extrabold text-white tabular-nums">
                          {String(value).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[9px] md:text-[10px] font-bold tracking-widest text-white/60">{label}</p>
                    </div>
                    {i < timerUnits.length - 1 && (
                      <span className="text-white/40 font-bold text-lg mb-4">:</span>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={ROUTES.SALE}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-rose-500/30 transition-all"
              >
                Shop Sale
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
