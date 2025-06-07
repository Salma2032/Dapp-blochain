import Web3 from 'web3';

let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
} else {
  // Fallback to Alchemy Sepolia provider if Metamask is not available
  web3 = new Web3(new Web3.providers.HttpProvider('https://eth-sepolia.g.alchemy.com/v2/1ywJ3dQuo1SZDQlTH_rNAZs2ii1H2MX6'));
}

export const getWeb3 = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return web3;
    } catch (error) {
      console.error('User denied account access');
      throw error;
    }
  } else {
    console.warn('No Ethereum provider detected, using fallback provider.');
    return web3;
  }
};
