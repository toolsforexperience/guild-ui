import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`max-w-5xl mx-auto py-16 px-12 fade-in transition-colors duration-300 ${className}`}>
      {children}
    </div>
  );
}

