import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6 bg-[#FAFAFA] min-h-[calc(100vh-120px)]">
      {children}
    </div>
  );
}
