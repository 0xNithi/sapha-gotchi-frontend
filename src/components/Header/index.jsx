import React from 'react';

const Header = () => (
  <div className="flex flex-row text-4xl sm:text-8xl justify-center mt-6 filter drop-shadow-xl">
    <div className="bg-clip-text text-transparent bg-gradient-to-r from-red-700 via-red-200 to-blue-700">สภา</div>
    <img src={'/images/tribune.png'} className="w-8 sm:w-24" alt="logo" />
    <div className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-red-200 to-red-700">ก๊อตจิ</div>
  </div>
);

export default Header;
