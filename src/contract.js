import { getWeb3 } from './web3';
import ProductMarketplaceABI from './ProductMarketplace.json'; // Import the ABI

const contractAddress = "0xa567a73571ecf2c9f7Cdcb542013a8e28aE1f7AD"; 
export const getContract = async () => {
  const web3 = await getWeb3();
  const contract = new web3.eth.Contract(ProductMarketplaceABI.abi, contractAddress);
  return contract;
};
