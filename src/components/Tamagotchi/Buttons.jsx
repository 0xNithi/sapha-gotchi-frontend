import React, { useEffect, useState } from 'react';
import { utils, Contract } from 'ethers';
import { useEthers } from '@usedapp/core';
import { create } from 'ipfs-core';

import GotchiNFTAbi from '../../config/abis/GotchiNFT.json';
import { address, people, gamestate as state } from '../../config/constant';

const gotchiNFTInterface = new utils.Interface(GotchiNFTAbi);

const Buttons = (props) => {
  const { library } = useEthers();
  const [node, setNode] = useState();

  const gotchiNFTContract = new Contract(address, gotchiNFTInterface, library?.getSigner());

  const handleProposeGotchi = (role, ipfsEndpoint) => {
    gotchiNFTContract.connect(library?.getSigner()).propose(role, ipfsEndpoint, { gasLimit: 446044 });
  };

  const handleInjectGotchi = (id) => {
    gotchiNFTContract.connect(library?.getSigner()).inject(id);
  };

  useEffect(() => {
    const initNode = async () => setNode(await create());
    initNode();
  }, []);

  return (
    <div className="w-full absolute bottom-6 flex justify-center space-x-4">
      <button
        type="button"
        className="w-8 h-8 border-2 border-white bg-white rounded-full shadow-lg text-sm text-center transform active:scale-95"
        onClick={() => {
          if (props.gameState === state.GAME) {
            props.setGameState(state.LISTGOTCHI);
          } else if (props.gameState === state.SHOWSTAT) {
            props.setGameState(state.GAME);
          } else {
            props.setCurrentIndex(props.currentIndex - 1);
          }
        }}
      >
        {props.gameState === state.GAME ? '👶' : '👈'}
      </button>
      <button
        type="button"
        className="w-8 h-8 mt-2 border-2 border-white bg-white rounded-full shadow-lg text-sm text-center transform active:scale-95"
        onClick={() => {
          if (props.gameState === state.GAME) {
            props.gotchiStat?.id && handleInjectGotchi(props.gotchiStat.id);
          } else if (props.gameState === state.LISTGOTCHI) {
            if (props.currentIndex === 0) {
              props.setGameState(state.GAME);
            } else if (props.currentIndex === 1) {
              props.setGameState(state.ADDGOTCHI);
            } else {
              props.setGotchiStat(props.gotchiInfo[props.currentIndex - 2]);
              props.setGameState(state.GAME);
            }
          } else if (props.gameState === state.ADDGOTCHI) {
            if (Math.abs(props.currentIndex % people.length) === 0) {
              props.setGameState(state.LISTGOTCHI);
            } else {
              const input = document.createElement('INPUT');
              input.className = 'hidden';
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              input.addEventListener('change', async () => {
                const results = await node.add(input.files);
                handleProposeGotchi((props.currentIndex - 1).toString(), `https://ipfs.infura.io/ipfs/${results.path}`);
                props.setGameState(state.LISTGOTCHI);
              });
              input.click();
            }
          } else {
            props.setGameState(state.GAME);
          }
        }}
      >
        {props.gameState === state.GAME ? '💉' : '👊'}
      </button>
      <button
        type="button"
        className="w-8 h-8 border-2 border-white bg-white rounded-full shadow-lg text-sm text-center transform active:scale-95"
        onClick={() => {
          if (props.gameState === state.GAME) {
            props.setGameState(state.SHOWSTAT);
          } else if (props.gameState === state.SHOWSTAT) {
            props.setGameState(state.GAME);
          } else {
            props.setCurrentIndex(props.currentIndex + 1);
          }
        }}
      >
        {props.gameState === state.GAME ? '💪' : '👉'}
      </button>
    </div>
  );
};

export default Buttons;
