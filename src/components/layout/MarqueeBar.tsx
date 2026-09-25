import { ANNOUNCEMENT_MESSAGES } from "@/constants/site";

export const MarqueeBar = () => {
  return (
    <div className="bg-rose-900 py-2 md:py-2.5 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...ANNOUNCEMENT_MESSAGES, ...ANNOUNCEMENT_MESSAGES].map((message, index) => (
          <div key={index} className="flex items-center px-4 md:px-6">
            <a href="#" className="text-white text-[10px] md:text-xs lg:text-sm font-normal">
              {message}
            </a>
            {index < ANNOUNCEMENT_MESSAGES.length * 2 - 1 && (
              <span className="mx-4 md:mx-6">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
