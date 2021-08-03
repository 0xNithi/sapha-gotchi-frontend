import { utils } from 'ethers';
import { useContractCall } from '@usedapp/core';

import { address } from '../config/constant';
import GotchiNFTAbi from '../config/abis/GotchiNFT.json';

const gotchiNFTInterface = new utils.Interface(GotchiNFTAbi);

const useTokenURI = (id) =>
  useContractCall({
    abi: gotchiNFTInterface,
    address: address,
    method: 'tokenURI',
    args: [id],
  });

export default useTokenURI;
