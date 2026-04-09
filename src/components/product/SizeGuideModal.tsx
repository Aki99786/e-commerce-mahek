"use client";

import { useState, useEffect } from "react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZE_CHART_DATA = {
  title: "Ready to Wear Clothing",
  sizes: ["XXS-XS", "XS-S", "S-M", "M-L", "L-XL", "XL-XXL"],
  measurements: [
    { label: "UK", values: ["6", "8", "10", "12", "14", "16"] },
    { label: "US", values: ["2", "4", "6", "8", "10", "12"] },
    { label: "Italy (IT)", values: ["38", "40", "42", "44", "46", "48"] },
    { label: "France (FR/EU)", values: ["34", "36", "38", "40", "42", "44"] },
    { label: "Denmark", values: ["32", "34", "36", "38", "40", "42"] },
    { label: "Russia", values: ["40", "42", "44", "46", "48", "50"] },
    { label: "Germany", values: ["32", "34", "36", "38", "40", "42"] },
    { label: "Japan", values: ["5", "7", "9", "11", "13", "15"] },
    { label: "Australia", values: ["6", "8", "10", "12", "14", "16"] },
    { label: "Korea", values: ["33", "44", "55", "66", "77", "88"] },
    { label: "China", values: ["160/84", "165/86", "170/88", "175/90", "180/92", "185/94"] },
    { label: "Jeans", values: ["24-25", "26-27", "27-28", "29-30", "31-32", "32-33"] },
  ],
};

export const SizeGuideModal = ({ isOpen, onClose }: SizeGuideModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setTimeout(() => setIsVisible(false), 300);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className={`relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 font-playfair">Size Guide</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <p className="text-sm text-gray-600 mb-6 font-poppins">
            This is a standardised guide to give you an idea of what size you will need, however some brands may vary from these conversions.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">{SIZE_CHART_DATA.title}</h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-900">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider font-poppins border border-gray-700">
                    SIZE
                  </th>
                  {SIZE_CHART_DATA.sizes.map((size, index) => (
                    <th
                      key={index}
                      className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider font-poppins border border-gray-700"
                    >
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART_DATA.measurements.map((measurement, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 font-poppins border border-gray-200">
                      {measurement.label}
                    </td>
                    {measurement.values.map((value, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-4 py-3 text-sm text-gray-700 text-center font-poppins border border-gray-200"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
