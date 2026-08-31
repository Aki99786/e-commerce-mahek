import { ReactNode } from "react";

interface AuthContainerProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthContainer = ({
  children,
  title,
  subtitle,
}: AuthContainerProps) => {
  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-rose-600 to-pink-600 shadow-md mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">Mahek Sarees</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600" />
          <div className="p-7 sm:p-8">
            <div className="text-center mb-7">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
