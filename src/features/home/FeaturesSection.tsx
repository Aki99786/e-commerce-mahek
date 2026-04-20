const features = [
  {
    title: "Free Shipping",
    desc: "For orders over ₹500",
    color: "bg-blue-50 text-blue-600",
    path: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
  },
  {
    title: "No Exchange",
    desc: "No Return / No Refunds",
    color: "bg-rose-50 text-rose-600",
    path: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
  },
  {
    title: "Secure Payment",
    desc: "Cards & UPI accepted",
    color: "bg-green-50 text-green-600",
    path: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
  {
    title: "Worldwide Shipping",
    desc: "No Cash on Delivery",
    color: "bg-purple-50 text-purple-600",
    path: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-8 md:py-10 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map(({ title, desc, color, path }) => (
            <div key={title} className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path} />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 font-playfair leading-tight">{title}</h3>
                <p className="text-xs text-gray-500 font-poppins mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
