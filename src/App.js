import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import './App.css';
import ProductMarketplace from './abis/ProductMarketplace.json';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    async function loadBlockchainData() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3Instance.eth.net.getId();
        const networkData = ProductMarketplace.networks[networkId];

        if (networkData) {
          const contractInstance = new web3Instance.eth.Contract(
            ProductMarketplace.abi,
            networkData.address
          );
          setContract(contractInstance);

          const productCount = await contractInstance.methods.productCount().call();
          const loadedProducts = [];
          for (let i = 1; i <= productCount; i++) {
            const product = await contractInstance.methods.products(i).call();
            loadedProducts.push(product);
          }
          setProducts(loadedProducts);
        } else {
          alert('Smart contract not deployed to detected network.');
        }
      } else {
        alert('Please install MetaMask!');
      }
    }

    loadBlockchainData();
  }, []);

  const createProduct = async () => {
    if (!name || !description || !price) {
      alert('Please fill all the fields.');
      return;
    }

    await contract.methods.createProduct(name, description, Web3.utils.toWei(price, 'ether'))
      .send({ from: account })
      .then(async () => {
        const productCount = await contract.methods.productCount().call();
        const newProduct = await contract.methods.products(productCount).call();
        setProducts([...products, newProduct]);
      });
  };

  return (
    <div className="container">
      <h1>Marketplace DApp</h1>
      <p>Connected account: {account}</p>

      <div>
        <h2>Create Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Product Price (in ETH)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={createProduct} className="button">Add Product</button>
      </div>

      <div>
        <h2>Available Products</h2>
        <ul className="product-list">
          {products.map((product) => (
            <li key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: {Web3.utils.fromWei(product.price, 'ether')} ETH</p>
              <button
                className="button"
                onClick={() => {
                  contract.methods.buyProduct(product.id).send({ from: account, value: product.price });
                }}
              >
                Buy
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
