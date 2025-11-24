import React from 'react';

const Logo = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: { box: 'px-1.5 py-1', text: 'text-xs', gap: 'gap-0.5' },
    md: { box: 'px-2 py-1.5', text: 'text-base', gap: 'gap-1' },
    lg: { box: 'px-2.5 py-2', text: 'text-lg', gap: 'gap-1' },
    xl: { box: 'px-4 py-2.5', text: 'text-2xl', gap: 'gap-1.5' }
  };

  const s = sizes[size];
  const letters = 'NIGERLAND'.split('');

  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      {letters.map((letter, index) => (
        <div key={index} className={`bg-blue-600 ${s.box} rounded shadow-md transform hover:scale-110 transition-transform duration-200`}>
          <span className={`text-white font-bold ${s.text}`}>{letter}</span>
        </div>
      ))}
    </div>
  );
};

export default Logo;
