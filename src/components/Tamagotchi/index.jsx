import React, { useState, useEffect } from 'react';
import { utils, Contract } from 'ethers';
import { useEthers, useContractCall, useContractCalls } from '@usedapp/core';
import IPFS from 'ipfs-core';

import useTokenURI from '../../hooks/useTokenURI';
import GotchiNFTAbi from '../../abis/GotchiNFT.json';
import Crack from './Crack';
import Screen from './Screen';

const gotchiNFTInterface = new utils.Interface(GotchiNFTAbi);

const address = '0x38A656369d17482083Bc80946171263BaCB5AD3e';

const state = {
  GAME: 0,
  LISTGOTCHI: 1,
  ADDGOTCHI: 2,
  SHOWSTAT: 3,
};

const people = ['×', 'prawit', 'prayut', 'anutin'];
const eggColor = [
  'bg-gradient-to-tl from-yellow-400 to-gray-100',
  'bg-gradient-to-tl from-green-800 to-gray-300',
  'bg-gradient-to-tl from-gray-800 to-gray-300',
];

const Tamagotchi = () => {
  const { library, account } = useEthers();
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

  const stat = gotchiStat && gotchiInfo?.find((gotchi) => gotchi?.id.eq(gotchiStat.id));

  useEffect(() => {
    gotchiInfo && setGotchiSize(gotchiInfo.length + 1);
  }, [gotchiInfo]);

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

  const propsScreen = {
    gameState,
    gotchiUri,
    currentIndex,
    tokenURI,
    stat,
  };

  return (
    <div>
      <div className="flex flex-row text-8xl justify-center mt-6 filter drop-shadow-xl">
        <div className="bg-clip-text text-transparent bg-gradient-to-r from-red-700 via-red-200 to-blue-700">สภา</div>
        <img src={'/images/tribune.png'} className="w-24" alt="" />
        <div className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-red-200 to-red-700">
          ก๊อตจิ
        </div>
      </div>
      <div
        className={`w-80 h-96 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
          eggColor[gotchiStat?.rarity | 0]
        } rounded-egg shadow-2xl select-none overflow-hidden`}
      >
        {/* Egg Shadow */}
        <div className="w-10/12 h-4/6 absolute top-1/6 left-1/12 filter blur-sm rounded-egg shadow-egg">
          {/* Egg Highlight */}
          <div className="w-6 h-16 absolute left-1/12 transform rotate-30 bg-white opacity-40 rounded-egg" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Crack />
          <Screen {...propsScreen} />
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
                gotchiStat?.id && handleInjectGotchi(gotchiStat.id);
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
                  input.setAttribute('accept', 'image/*');
                  document.body.appendChild(input);

                  input.addEventListener('change', async () => {
                    try {
                      const node = await IPFS.create();
                      const results = await node.add(input.files);
                      const imagesUri = `https://ipfs.infura.io/ipfs/${results.path}`;
                      handleProposeGotchi((currentIndex - 1).toString(), imagesUri);
                    } catch (error) {
                      console.log(error);
                      alert('ใช้รูปซ้ำไม่ได้นะจ๊ะ');
                    }
                    setGameState(state.LISTGOTCHI);
                    input.remove();
                  });
                  input.click();
                }
              } else {
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
    </div>
  );
};

export default Tamagotchi;
