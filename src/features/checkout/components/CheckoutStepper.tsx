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
    <div className="flex items-center justify-center gap-0 font-poppins text-xs tracking-widest select-none">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isClickable = index < currentIndex;

        const labelEl = (
          <span
            className={`flex items-center gap-1.5 font-semibold ${
              isActive
                ? "text-secondary"
                : isCompleted
                  ? "text-gray-500"
                  : "text-gray-400"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 size={14} className="text-green-500" />
            ) : (
              step.icon
            )}
            {step.label}
          </span>
        );

        return (
          <div key={step.id} className="flex items-center">
            {isClickable ? (
              <Link href={step.href} className="hover:opacity-80 transition-opacity">
                {labelEl}
              </Link>
            ) : (
              labelEl
            )}

            {index < STEPS.length - 1 && (
              <span className="mx-3 flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((dot) => (
                  <span
                    key={dot}
                    className={`w-1 h-1 rounded-full ${
                      index < currentIndex ? "bg-gray-400" : "bg-gray-300"
                    }`}
                  />
                ))}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
