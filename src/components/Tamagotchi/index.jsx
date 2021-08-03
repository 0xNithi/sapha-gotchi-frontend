import React, { useState, useEffect } from 'react';

import useGotchiInfo from '../../hooks/useGotchiInfo';
import useTokenURI from '../../hooks/useTokenURI';
import { eggColor, gamestate as state } from '../../config/constant';
import Crack from './Crack';
import Screen from './Screen';
import Buttons from './Buttons';

const Tamagotchi = () => {
  const [gameState, setGameState] = useState(state.GAME);
  const [gotchiSize, setGotchiSize] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [gotchiStat, setGotchiStat] = useState();
  const [gotchiUri, setGotchiUri] = useState();

  const gotchiInfo = useGotchiInfo();
  const tokenURI = useTokenURI(gotchiInfo[currentIndex - 2]?.id);

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

  return (
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
        <Screen
          gameState={gameState}
          currentIndex={currentIndex}
          gotchiUri={gotchiUri}
          tokenURI={tokenURI}
          stat={stat}
        />
      </div>
      <Buttons
        gameState={gameState}
        currentIndex={currentIndex}
        gotchiStat={gotchiStat}
        gotchiInfo={gotchiInfo}
        setGameState={setGameState}
        setCurrentIndex={setCurrentIndex}
        setGotchiStat={setGotchiStat}
      />
    </div>
  );
};

export default Tamagotchi;
