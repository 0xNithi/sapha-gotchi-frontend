import { utils } from 'ethers';
import { useEthers, useContractCall, useContractCalls } from '@usedapp/core';

import { address } from '../config/constant';
import GotchiNFTAbi from '../config/abis/GotchiNFT.json';

const gotchiNFTInterface = new utils.Interface(GotchiNFTAbi);

const useGotchiInfo = () => {
  const { account } = useEthers();

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

  return useContractCalls(gotchiInfoCalls)
    .map((gotchi, index) => {
      return gotchi && { ...gotchi[0], id: tokenId[index][0] };
    })
    .filter((gotchi) => gotchi !== undefined && !!gotchi[0]);
};

export default useGotchiInfo;
