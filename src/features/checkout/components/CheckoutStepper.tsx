"use client";

import { CheckCircle2, ShoppingCart, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export type CheckoutStep = "bag" | "address" | "payment";

interface StepConfig {
  id: CheckoutStep;
  label: string;
  href: string;
  icon: React.ReactNode;
}

const STEPS: StepConfig[] = [
  {
    id: "bag",
    label: "BAG",
    href: ROUTES.CART,
    icon: <ShoppingCart size={16} />,
  },
  {
    id: "address",
    label: "ADDRESS",
    href: ROUTES.CHECKOUT_ADDRESS,
    icon: <MapPin size={16} />,
  },
  {
    id: "payment",
    label: "PAYMENT",
    href: ROUTES.CHECKOUT_PAYMENT,
    icon: <CreditCard size={16} />,
  },
];

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="select-none">
      {/* Row 1: circles + connector lines, all vertically centered */}
      <div className="flex items-center justify-center">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isClickable = index < currentIndex;

          const circleEl = (
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 flex-shrink-0 ${
                isCompleted
                  ? "bg-green-500 border-green-500"
                  : isActive
                  ? "bg-rose-600 border-rose-600"
                  : "bg-white border-gray-300"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 size={16} className="text-white" />
              ) : (
                <span className={isActive ? "text-white" : "text-gray-400"}>
                  {step.icon}
                </span>
              )}
            </div>
          );

          return (
            <div key={step.id} className="flex items-center">
              {isClickable ? (
                <Link href={step.href} className="hover:opacity-80 transition-opacity">
                  {circleEl}
                </Link>
              ) : (
                circleEl
              )}

              {index < STEPS.length - 1 && (
                <div className={`w-16 sm:w-24 h-0.5 mx-1 transition-colors duration-500 ${
                  index < currentIndex ? "bg-green-400" : "bg-gray-200"
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Row 2: labels below circles, spaced to match */}
      <div className="flex items-start justify-center mt-2">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <div key={step.id} className="flex items-start">
              <span
                className={`w-9 text-center text-[9px] sm:text-[10px] font-poppins font-semibold tracking-widest uppercase leading-tight ${
                  isActive ? "text-rose-600" : isCompleted ? "text-green-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
              {index < STEPS.length - 1 && (
                <div className="w-16 sm:w-24 mx-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
