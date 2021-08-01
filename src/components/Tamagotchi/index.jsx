import React, { useState, useEffect } from 'react';
import { utils, Contract } from 'ethers';
import { useEthers, useContractCall, useContractCalls, shortenAddress } from '@usedapp/core';
import IPFS from 'ipfs-core';

import useTokenURI from '../../hooks/useTokenURI';
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

const rarity = ['common', 'rare', 'epic'];

const Tamagotchi = () => {
  const { activateBrowserWallet, library, account } = useEthers();
  const [gameState, setGameState] = useState(state.GAME);
  const [gotchiSize, setGotchiSize] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [gotchiStat, setGotchiStat] = useState(undefined);
  const [gotchiUri, setGotchiUri] = useState(undefined);

  const gotchiNFTContract = new Contract(address, gotchiNFTInterface, library?.getSigner());

  const balance = useContractCall({
    abi: gotchiNFTInterface,
    address: address,
    method: 'balanceOf',
    args: [account],
  });

  let tokenIdCalls = [];
  for (let i = 0; balance && i < balance[0]; i++) {
    tokenIdCalls.push({
      abi: gotchiNFTInterface,
      address: address,
      method: 'tokenOfOwnerByIndex',
      args: [account, i],
    });
  }

  const tokenId = useContractCalls(tokenIdCalls);

  let gotchiInfoCalls = [];
  for (let i = 0; tokenId && i < tokenId.length; i++) {
    tokenId[i] &&
      gotchiInfoCalls.push({
        abi: gotchiNFTInterface,
        address: address,
        method: 'getGotchiInfo',
        args: [tokenId[i][0]],
      });
  }
  // [[mintingStatus, rarity, untilAbleToInject, sinovacTaked, power]]
  const gotchiInfo = useContractCalls(gotchiInfoCalls)
    .map((gotchi, index) => {
      return gotchi && { ...gotchi[0], id: tokenId[index][0] };
    })
    .filter((gotchi) => gotchi !== undefined && !!gotchi[0]);

  const tokenURI = useTokenURI(gotchiInfo[currentIndex - 2]?.id);

  const handleProposeGotchi = (role, ipfsEndpoint) => {
    gotchiNFTContract.connect(library?.getSigner()).propose(role, ipfsEndpoint, { gasLimit: 446044 });
  };

  const handleInjectGotchi = (id) => {
    gotchiNFTContract.connect(library?.getSigner()).inject(id, { gasLimit: 446044 });
  };

  useEffect(() => {
    balance && setGotchiSize(gotchiInfo.length + 1);
  }, [balance]);

  useEffect(() => {
    gameState !== state.GAME && setCurrentIndex(1);
  }, [gameState]);

  useEffect(() => {
    tokenURI && setGotchiUri(tokenURI[0]);
  }, [tokenURI]);

  useEffect(() => {
    if (gameState === state.LISTGOTCHI) {
      if (currentIndex > gotchiSize) {
        setCurrentIndex(0);
      } else if (currentIndex < 0) {
        setCurrentIndex(gotchiSize);
      }
    }
  }, [currentIndex, gotchiSize, gameState]);

  useEffect(() => {
    // gotchiStat?.id && setGotchiStat(gotchiInfo.find((gotchi) => gotchi?.id === gotchiStat?.id));
    console.log(gotchiInfo, gotchiStat);
  }, [gotchiInfo]);

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
            {account && gameState === state.GAME && gotchiUri && (
              <img src={gotchiUri} alt="character" className="w-20 h-20 object-cover filter grayscale animate-walk" />
            )}
            {account && gameState !== state.GAME && (
              <div className="w-10/12 h-1/2 absolute flex flex-col justify-center items-center text-3xl bg-gray-300 rounded">
                {gameState === state.LISTGOTCHI && (
                  <>
                    {currentIndex === 0 && '×'}
                    {currentIndex === 1 && '+'}
                    {currentIndex !== 0 && currentIndex !== 1 && tokenURI && (
                      <img src={tokenURI[0]} alt="character" className="w-16 h-16 object-cover filter grayscale" />
                    )}
                  </>
                )}
                {gameState === state.ADDGOTCHI && (
                  <>{people[Math.abs(currentIndex % people.length)].toLocaleUpperCase()}</>
                )}
                {gameState === state.SHOWSTAT && (
                  <>
                    <div className="w-10/12 flex flex-row justify-between text-xs">
                      <div>Power: </div>
                      <div>{gotchiStat?.power.toString()}</div>
                    </div>
                    <div className="w-10/12 flex flex-row justify-between text-xs">
                      <div>Sinovac taked:</div>
                      <div>{gotchiStat?.sinovacTaked.toString()}</div>
                    </div>
                    <div className="w-10/12 flex flex-row justify-between text-xs mt-4">
                      <div>Rarity:</div>
                      <div>{rarity[gotchiStat?.rarity]}</div>
                    </div>
                  </>
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
            } else if (gameState === state.SHOWSTAT) {
              setGameState(state.GAME);
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
          onClick={() => {
            if (gameState === state.GAME) {
              handleInjectGotchi(gotchiStat?.id);
            } else if (gameState === state.LISTGOTCHI) {
              if (currentIndex === 0) {
                setGameState(state.GAME);
              } else if (currentIndex === 1) {
                setGameState(state.ADDGOTCHI);
              } else {
                setGotchiStat(gotchiInfo[currentIndex - 2]);
                setGameState(state.GAME);
              }
            } else if (gameState === state.ADDGOTCHI) {
              if (Math.abs(currentIndex % people.length) === 0) {
                setGameState(state.LISTGOTCHI);
              } else {
                const input = document.createElement('INPUT');
                input.className = 'hidden';
                input.setAttribute('type', 'file');
                document.body.appendChild(input);

                input.addEventListener('change', async () => {
                  try {
                    const node = await IPFS.create();
                    const results = await node.add(input.files);
                    const imagesUri = `https://ipfs.infura.io/ipfs/${results.path}`;
                    handleProposeGotchi((currentIndex - 1).toString(), imagesUri);
                  } catch (error) {
                    alert('ใช้รูปซ้ำไม่ได้นะจ๊ะ');
                  }
                  input.remove();
                });
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
            } else if (gameState === state.SHOWSTAT) {
              setGameState(state.GAME);
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
