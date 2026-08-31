"use client";

import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  name: string;
}

export const FormInput = ({
  label,
  error,
  name,
  className = "",
  ...props
}: FormInputProps) => {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-text-primary mb-2.5"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={`w-full px-4 py-3.5 border-2 rounded-lg text-base transition-all duration-300 focus:outline-none focus:ring-4 placeholder:text-text-light bg-white ${
          error
            ? "border-error focus:ring-error/10 focus:border-error"
            : "border-border focus:border-secondary focus:ring-secondary/10 hover:border-border-dark"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-error flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};
