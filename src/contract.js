import { getWeb3 } from './web3';
import ProductMarketplaceABI from './ProductMarketplace.json'; // Import the ABI

const contractAddress = "0x821F79c5240d47764100B0a7DADA81eeE5A2aBC8"; 
export const getContract = async () => {
  const web3 = await getWeb3();
  const contract = new web3.eth.Contract(ProductMarketplaceABI.abi, contractAddress);
  return contract;
};
