import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white ${className}`}>
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
