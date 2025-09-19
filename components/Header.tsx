
import React from 'react';

const LanternIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H10C6.69 2 4 4.69 4 8C4 10.38 5.19 12.47 7 13.71V18H9V15H15V18H17V13.71C18.81 12.47 20 10.38 20 8C20 4.69 17.31 2 14 2ZM12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6S15 7.34 15 9C15 10.66 13.66 12 12 12Z" />
    <path d="M12 20.5C10.8954 20.5 10 21.3954 10 22.5H14C14 21.3954 13.1046 20.5 12 20.5Z" />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10 py-4 shadow-lg shadow-red-900/20">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <LanternIcon className="w-10 h-10 text-red-500" />
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-red-500">
          Tạo Ảnh Trung Thu 2025
        </h1>
        <LanternIcon className="w-10 h-10 text-amber-400" />
      </div>
    </header>
  );
};

export default Header;