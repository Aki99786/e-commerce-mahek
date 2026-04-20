"use client";

import { useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";
import { OTP_LENGTH } from "../constants";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function OtpInput({ value, onChange, error, disabled }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, inputValue: string) => {
    if (!/^\d*$/.test(inputValue)) return;

    const newOtp = value.split("");
    newOtp[index] = inputValue;
    const updatedOtp = newOtp.join("");

    onChange(updatedOtp);

    if (inputValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, OTP_LENGTH);
    
    if (!/^\d+$/.test(pastedData)) return;

    onChange(pastedData.padEnd(OTP_LENGTH, ""));
    
    const nextIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-poppins font-semibold uppercase tracking-widest text-gray-400 text-center">
        Enter 6-digit OTP
      </label>
      <div className="flex gap-2.5 justify-center">
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-poppins border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-500 ${
              error
                ? "border-red-400 bg-red-50 text-red-600"
                : value[index]
                ? "border-rose-400 bg-rose-50 text-rose-700"
                : "border-gray-200 bg-gray-50 hover:border-rose-300"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>
      {error && (
        <p className="text-xs font-poppins text-red-500 text-center mt-1">{error}</p>
      )}
    </div>
  );
}
