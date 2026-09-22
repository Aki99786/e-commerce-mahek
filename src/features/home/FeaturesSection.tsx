import { Infinity, Truck, Scissors, Headset } from "lucide-react";

const features = [
  {
    icon: Infinity,
    title: "100% HANDCRAFTED ASSURANCE",
    desc: "Original artisan signatures",
  },
  {
    icon: Truck,
    title: "INSURED GLOBAL TRANSIT",
    desc: "Full transit value security",
  },
  {
    icon: Scissors,
    title: "CUSTOM MADE-TO-MEASURE",
    desc: "Blouse & lehenga alterations",
  },
  {
    icon: Headset,
    title: "GLOBAL ATELIER SUPPORT",
    desc: "Direct stylist concierge",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-8 sm:py-10 md:py-12 bg-[#f8f8f8] border-t border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-center gap-3.5 sm:gap-4 group cursor-default"
            >
              {/* Luxury White Rounded Squircle Icon Badge */}
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center text-gray-900 group-hover:scale-105 group-hover:shadow-md group-hover:border-gray-300 transition-all duration-300">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 stroke-[1.8]" />
              </div>

              {/* Text Info */}
              <div className="min-w-0">
                <h3 className="text-xs sm:text-[13px] font-bold text-gray-900 uppercase tracking-[0.05em] leading-snug">
                  {title}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-500 font-normal mt-0.5 leading-snug">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
