import React, { useState, useEffect } from 'react';
import { utils, Contract } from 'ethers';
import { useEthers, useContractCall, useContractFunction, shortenAddress } from '@usedapp/core';
import IPFS from 'ipfs-core';

import GotchiNFTAbi from '../../abis/GotchiNFT.json';
import Crack from './Crack';

const gotchiNFTInterface = new utils.Interface(GotchiNFTAbi);

const address = '0x38A656369d17482083Bc80946171263BaCB5AD3e';

const state = {
  GAME: 0,
  LISTGOTCHI: 1,
  ADDGOTCHI: 2,
  SHOWSTAT: 3,
};

const people = ['×', 'prawit', 'prayut', 'anutin'];

const Tamagotchi = () => {
  const { activateBrowserWallet, library, account } = useEthers();
  const [gameState, setGameState] = useState(state.GAME);
  const [gotchiSize, setGotchiSize] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(1);

  const gotchiNFTContract = new Contract(address, gotchiNFTInterface, library?.getSigner());
  const propose = useContractFunction(gotchiNFTContract, 'propose');

  const balance = useContractCall({
    abi: gotchiNFTInterface,
    address: address,
    method: 'balanceOf',
    args: [account],
  });

  useEffect(() => {
    balance && setGotchiSize(parseInt(balance[0]) + 1);
  }, [balance]);

  useEffect(() => {
    gameState !== state.GAME && setCurrentIndex(1);
  }, [gameState]);

  useEffect(() => {
    if (gameState === state.LISTGOTCHI) {
      if (currentIndex > gotchiSize) {
        setCurrentIndex(0);
      } else if (currentIndex < 0) {
        setCurrentIndex(gotchiSize);
      }
    }
  }, [currentIndex, gotchiSize, gameState]);

  return (
    <div className="w-80 h-96 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-300 rounded-egg shadow-2xl select-none overflow-hidden">
      {/* Egg Shadow */}
      <div className="w-10/12 h-4/6 absolute top-1/6 left-1/12 filter blur-sm rounded-egg shadow-egg">
        {/* Egg Highlight */}
        <div className="w-6 h-16 absolute left-1/12 transform rotate-30 bg-yellow-200 rounded-egg" />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Crack />
        {/* Screen */}
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
            {account && (
              <img
                src="/images/kfc.jpg"
                alt="character"
                className="w-20 h-20 object-cover filter grayscale animate-walk"
              />
            )}
            {account && gameState !== state.GAME && (
              <div className="w-10/12 h-1/2 absolute flex justify-center items-center text-3xl bg-gray-300 rounded">
                {gameState === state.LISTGOTCHI && (
                  <>
                    {currentIndex === 0 && '×'}
                    {currentIndex === 1 && '+'}
                    {currentIndex !== 0 && currentIndex !== 1 && (
                      <img src="/images/kfc.jpg" alt="character" className="w-16 h-16 object-cover filter grayscale" />
                    )}
                  </>
                )}
                {gameState === state.ADDGOTCHI && (
                  <>{people[Math.abs(currentIndex % people.length)].toLocaleUpperCase()}</>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full absolute bottom-6 flex justify-center space-x-4">
        <button
          type="button"
          className="w-8 h-8 border-2 border-white bg-white rounded-full shadow-lg text-sm text-center transform active:scale-95"
          onClick={() => {
            if (gameState === state.GAME) {
              setGameState(state.LISTGOTCHI);
            } else {
              setCurrentIndex(currentIndex - 1);
            }
          }}
        >
          {gameState === state.GAME ? '👶' : '👈'}
        </button>
        <button
          type="button"
          className="w-8 h-8 mt-2 border-2 border-white bg-white rounded-full shadow-lg text-sm text-center transform active:scale-95"
          onClick={(e) => {
            e.preventDefault();
            if (gameState === state.LISTGOTCHI) {
              if (currentIndex === 0) {
                setGameState(state.GAME);
              } else if (currentIndex === 1) {
                setGameState(state.ADDGOTCHI);
              }
            } else if (gameState === state.ADDGOTCHI) {
              if (Math.abs(currentIndex % people.length) === 0) {
                setGameState(state.LISTGOTCHI);
              } else {
                const input = document.createElement('INPUT');
                input.className = 'hidden';
                input.setAttribute('type', 'file');
                document.body.appendChild(input);
                propose.send(
                  utils.parseUnits((currentIndex - 1).toString(), 0),
                  `https://ipfs.infura.io/ipfs/QmYMNCRMSZTUb3sn62A9ZaJpEZyzSzWe7AozuPgCoSUxYD`,
                );

                // input.addEventListener('change', async () => {
                //   const node = await IPFS.create();
                //   const results = await node.add(input.files);
                //   const imagesUri = `https://ipfs.infura.io/ipfs/${results.path}`;
                //   console.log(imagesUri)
                //   // propose.send(utils.parseUnits((currentIndex - 1).toString(), 0), imagesUri);
                //   // input.remove();
                // });
                input.click();
              }
            } else if (gameState === state.SHOWSTAT) {
              setGameState(state.GAME);
            }
          }}
        >
          {gameState === state.GAME ? '💉' : '👊'}
        </button>
        <button
          type="button"
          className="w-8 h-8 border-2 border-white bg-white rounded-full shadow-lg text-sm text-center transform active:scale-95"
          onClick={() => {
            if (gameState === state.GAME) {
              setGameState(state.SHOWSTAT);
            } else {
              setCurrentIndex(currentIndex + 1);
            }
          }}
        >
          {gameState === state.GAME ? '💪' : '👉'}
        </button>
      </div>
    </div>
  );
};

export default Tamagotchi;
