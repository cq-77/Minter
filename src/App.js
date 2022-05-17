import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Minter from './Minter';
import {HashRouter as Router,Route,Routes} from 'react-router-dom';
import Web3 from 'web3';
import { Web3ReactProvider } from '@web3-react/core';

function getLibrary(provider){
  return new Web3(provider);
}

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  const onLogin = async (provider) => {
    // const web3 = new Web3(provider);
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    if(accounts.length === 0) {
      console.log("Please connect to MetaMask!")
    }
    else if (accounts[0] !== currentAccount) {
      setCurrentAccount(accounts[0]);
      setIsConnected(true);
    }
  };

  const onLogout = () => {
    setIsConnected(false);
  };

  return (
    <div>
      <Router>
        <Web3ReactProvider getLibrary={getLibrary}>
            <Header onLogin={onLogin} onLogout={onLogout} />
              <Routes>
                <Route path='/' element={<Minter /> } />
              </Routes>
        </Web3ReactProvider>
      </Router>
    </div>
  )
}
export default App;
