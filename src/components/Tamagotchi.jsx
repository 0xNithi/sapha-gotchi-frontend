import React from 'react';

const Tamagotchi = () => {
  return (
    <div className="w-80 h-96 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-300 rounded-egg shadow-2xl select-none overflow-hidden">
      {/* Egg Shadow */}
      <div className="w-10/12 h-4/6 absolute top-1/6 left-1/12 filter blur-sm rounded-egg shadow-egg">
        {/* Egg Highlight */}
        <div className="w-6 h-16 absolute left-1/12 transform rotate-30 bg-yellow-250 rounded-egg" />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
        <div className="w-48 h-44 flex flex-row justify-center items-center relative bg-yellow-100 rounded-2xl shadow border-y-2">
          <img src="/images/kfc.jpg" alt="character" className="w-20 h-20 object-cover filter grayscale animate-walk" />
        </div>
      </div>
      <div className="w-full absolute bottom-6 flex justify-center space-x-4">
        <button
          type="button"
          className="w-8 h-8 border-2 border-white bg-white rounded-full shadow-lg text-sm text-center transform active:scale-95"
        >
          👶
        </button>
        <button
          type="button"
          className="w-8 h-8 mt-2 border-2 border-white bg-white rounded-full shadow-lg text-sm text-center transform active:scale-95"
        >
          💉
        </button>
        <button
          type="button"
          className="w-8 h-8 border-2 border-white bg-white rounded-full shadow-lg text-sm text-center transform active:scale-95"
        >
          💪
        </button>
      </div>
    </div>
  );
};

export default Tamagotchi;
