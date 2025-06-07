import { getWeb3 } from './web3';
import ProductMarketplaceArtifact from '../build/contracts/ProductMarketplace.json'; 

export const getContract = async () => {
  const web3 = await getWeb3();

  const networkId = await web3.eth.net.getId();
  const deployedNetwork = ProductMarketplaceArtifact.networks[networkId];

  if (!deployedNetwork) {
    throw new Error(`Contract not deployed on network with ID ${networkId}`);
  }

  const contract = new web3.eth.Contract(
    ProductMarketplaceArtifact.abi,
    deployedNetwork.address
  );
  return contract;
};
