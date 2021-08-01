import React from 'react';
import { utils } from 'ethers';
import { useContractCall } from '@usedapp/core';

import GotchiNFTAbi from '../abis/GotchiNFT.json';

const gotchiNFTInterface = new utils.Interface(GotchiNFTAbi);
const address = '0x38A656369d17482083Bc80946171263BaCB5AD3e';

const useTokenURI = (id) =>
  useContractCall({
    abi: gotchiNFTInterface,
    address: address,
    method: 'tokenURI',
    args: [id],
  });

export default useTokenURI;
