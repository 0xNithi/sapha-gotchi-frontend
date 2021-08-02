import React from 'react';
import { shortenAddress, useEthers } from '@usedapp/core';

const state = {
  GAME: 0,
  LISTGOTCHI: 1,
  ADDGOTCHI: 2,
  SHOWSTAT: 3,
};

const people = ['×', 'prawit', 'prayut', 'anutin'];

const rarity = ['common', 'rare', 'epic'];

const Screen = (props) => {
  const { activateBrowserWallet, account } = useEthers();

  return (
    <div className="w-48 h-44 flex flex-col relative bg-gray-100 rounded-2xl shadow border-y-2">
      <div className="h-16 flex justify-center items-center text-base text-center bg-gray-200">
        {account ? (
          shortenAddress(account)
        ) : (
          <button
            type="button"
            className="bg-gray-500 text-white font-bold p-1 rounded transform active:scale-95"
            onClick={() => {
              activateBrowserWallet();
            }}
          >
            Connect Wallet
          </button>
        )}
      </div>
      <div className="w-full h-full flex justify-center items-center">
        {account && props.gotchiUri && (
          <img src={props.gotchiUri} alt="character" className="w-20 h-20 object-cover filter grayscale animate-walk" />
        )}
        {account && props.gameState !== state.GAME && (
          <div className="w-10/12 h-1/2 absolute flex flex-col justify-center items-center text-3xl bg-gray-300 rounded">
            {props.gameState === state.LISTGOTCHI && (
              <>
                {props.currentIndex === 0 && '×'}
                {props.currentIndex === 1 && '+'}
                {props.currentIndex !== 0 && props.currentIndex !== 1 && props.tokenURI && (
                  <img src={props.tokenURI[0]} alt="character" className="w-16 h-16 object-cover filter grayscale" />
                )}
              </>
            )}
            {props.gameState === state.ADDGOTCHI && (
              <>{people[Math.abs(props.currentIndex % people.length)].toLocaleUpperCase()}</>
            )}
            {props.gameState === state.SHOWSTAT && (
              <>
                <div className="w-10/12 flex flex-row justify-between text-xs">
                  <div>Power: </div>
                  <div>{props.stat?.power.toString()}</div>
                </div>
                <div className="w-10/12 flex flex-row justify-between text-xs">
                  <div>Sinovac taked:</div>
                  <div>{props.stat?.sinovacTaked.toString()}</div>
                </div>
                <div className="w-10/12 flex flex-row justify-between text-xs mt-4">
                  <div>Rarity:</div>
                  <div>{rarity[props.stat?.rarity]}</div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Screen;
