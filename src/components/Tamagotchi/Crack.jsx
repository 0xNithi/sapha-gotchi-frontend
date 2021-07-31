import React from 'react';

const Crack = () => (
  <>
    {/* Top crack */}
    <div className="w-28 h-28 absolute -top-2 -left-2 transform rotate-6 bg-white rounded" />
    <div className="w-28 h-28 absolute -top-4 left-10 transform rotate-45 bg-white rounded" />
    <div className="w-28 h-28 absolute -top-2 -right-2 transform -rotate-6 bg-white rounded" />
    {/* Bottom crack */}
    <div className="w-28 h-28 absolute -bottom-2 -left-2 transform -rotate-6 bg-white rounded" />
    <div className="w-28 h-28 absolute -bottom-4 left-10 transform rotate-12 bg-white rounded" />
    <div className="w-28 h-28 absolute -bottom-2 -right-2 transform -rotate-12 bg-white rounded" />
    {/* Left crack */}
    <div className="w-28 h-28 absolute top-1/4 -left-5 transform rotate-45 bg-white rounded">
      <div className="w-28 h-1 absolute bottom-0 -left-28 transform origin-right -rotate-45 bg-white opacity-80" />
    </div>
    {/* Right crack */}
    <div className="w-28 h-28 absolute top-1/4 -right-4 transform rotate-45 bg-white rounded">
      <div className="w-28 h-1 absolute top-0 -right-28 transform origin-left -rotate-45 bg-white opacity-80" />
    </div>
  </>
);

export default Crack;
