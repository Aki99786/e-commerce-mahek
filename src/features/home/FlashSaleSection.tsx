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
    days: 2,
    hours: 14,
    minutes: 48,
    seconds: 25,
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
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINS", value: timeLeft.minutes },
    { label: "SECS", value: timeLeft.seconds },
  ];

  return (
    <section className="bg-[#F4F3F3] py-3 md:py-5">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 lg:px-16">
        <div className="bg-[#111212] rounded-xl md:rounded-2xl px-5 py-7 md:px-14 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          {/* Left text */}
          <div className="text-center md:text-left">
            <h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-1.5 md:mb-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              THE CURATED VAULT
            </h2>
            <p className="text-xs md:text-sm text-white/45 tracking-wide">
              Up to 40% off bespoke bridal silhouettes.
            </p>
          </div>

          {/* Right: Timer + CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 flex-wrap justify-center">
            {/* Countdown */}
            <div className="flex items-center gap-1.5 md:gap-2">
              {timerUnits.map(({ label, value }, i) => (
                <div key={label} className="flex items-center gap-1 md:gap-2">
                  <div className="text-center">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#1E1E1E] border border-white/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white tabular-nums" style={{ fontFamily: "var(--font-serif)" }}>
                        {String(value).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="text-[7px] sm:text-[8px] tracking-[0.2em] text-white/30 uppercase mt-1 md:mt-1.5 font-medium">
                      {label}
                    </p>
                  </div>
                  {i < timerUnits.length - 1 && (
                    <span className="text-white/20 font-light text-lg md:text-xl mb-4">:</span>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href={ROUTES.SALE}
              className="inline-flex items-center gap-2.5 bg-white text-[#111212] text-[11px] tracking-[0.2em] font-bold px-6 py-3.5 hover:bg-[#F4F3F3] transition-colors whitespace-nowrap"
            >
              ACCESS VAULT
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
