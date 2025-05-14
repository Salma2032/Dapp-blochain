// App.js (Main entry for React front-end)
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import ProductMarketplace from './abis/ProductMarketplace.json';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else {
      alert('Please install MetaMask.');
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();
    const networkData = ProductMarketplace.networks[networkId];

    if (networkData) {
      const marketplace = new web3.eth.Contract(ProductMarketplace.abi, networkData.address);
      setContract(marketplace);

      const productCount = await marketplace.methods.productCount().call();
      const loadedProducts = [];
      for (let i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call();
        loadedProducts.push(product);
      }
      const availableProducts = loadedProducts.filter(p => !p.isSold);
      setProducts(availableProducts);
    } else {
      alert('Smart contract not deployed to detected network.');
    }
    setLoading(false);
  };

  const createProduct = async (e) => {
    e.preventDefault();
    const weiPrice = window.web3.utils.toWei(price, 'ether');
    await contract.methods.createProduct(title, description, weiPrice)
      .send({ from: account });
    window.location.reload();
  };

  const purchaseProduct = async (id, productPrice) => {
    await contract.methods.purchaseProduct(id)
      .send({ from: account, value: productPrice })
      .on('transactionHash', hash => console.log('Tx Hash:', hash))
      .on('receipt', receipt => window.location.reload())
      .on('error', err => console.error('Transaction Error:', err.message));
  };

  return (
    <div className="app-container">
      <header className="topbar">
        <h1>🛒 DApp Marketplace</h1>
        <p>Connected: {account}</p>
      </header>

      <form onSubmit={createProduct} className="form-card">
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
        <input placeholder="Price in ETH" value={price} onChange={e => setPrice(e.target.value)} required />
        <button type="submit">Add Product</button>
      </form>

      <div className="product-list">
        {loading ? <p>Loading...</p> : products.map(p => (
          <div key={p.id} className="product-card">
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p><strong>{window.web3.utils.fromWei(p.price, 'ether')} ETH</strong></p>
            <p>Status: {p.isSold ? 'Sold' : 'Available'}</p>
            {!p.isSold && (
              <button onClick={() => purchaseProduct(p.id, p.price)}>Buy</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
