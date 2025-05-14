import { getWeb3 } from './web3';
import ProductMarketplaceABI from './ProductMarketplace.json'; // Import the ABI

const contractAddress = "0xfde29f4f7e1379bAfb1a2250558b4e8c4217846F"; 
export const getContract = async () => {
  const web3 = await getWeb3();
  const contract = new web3.eth.Contract(ProductMarketplaceABI.abi, contractAddress);
  return contract;
};
