const HDWalletProvider = require('@truffle/hdwallet-provider');
// const provider = new HDWalletProvider({
//   privateKeys: ['ef8d7fb539cd75284a336f6394304051eba35a7e8c6e7293415a4bf43d53966e'],
//   providerOrUrl: 'ws://127.0.0.1:7545',
// });

module.exports = {

  networks: {
    development: {
      provider: () => new HDWalletProvider({
        privateKeys: ['ef8d7fb539cd75284a336f6394304051eba35a7e8c6e7293415a4bf43d53966e'],
        providerOrUrl: 'ws://127.0.0.1:7545',
      }),
      network_id: "*"
    },
    // mainnet: {
    //   provider: function() {
    //     return new HDWalletProvider({
    //       privateKeys: ['0bcaf5dc87a451230b0d6bbb9b4fdd5abc117359db980c07b059dccd0e44c8ec'],
    //       providerOrUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    //     });
    //   },
    //   network_id: 1
    // },
    rinkeby: {
      provider: () => new HDWalletProvider({
          privateKeys: ['0bcaf5dc87a451230b0d6bbb9b4fdd5abc117359db980c07b059dccd0e44c8ec'],
          providerOrUrl: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        }),
      network_id: 4,
      timeoutBlocks: 80000,
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider({
          privateKeys: ['0bcaf5dc87a451230b0d6bbb9b4fdd5abc117359db980c07b059dccd0e44c8ec'],
          providerOrUrl: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        });
      },
      network_id: 3
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider({
          privateKeys: ['0bcaf5dc87a451230b0d6bbb9b4fdd5abc117359db980c07b059dccd0e44c8ec'],
          providerOrUrl: 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        });
      },
      network_id: 42
    },
    goerli: {
      provider: function() {
        return new HDWalletProvider({
          privateKeys: ['0bcaf5dc87a451230b0d6bbb9b4fdd5abc117359db980c07b059dccd0e44c8ec'],
          providerOrUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        });
      },
      network_id: 5
    },
    // bscMain: {
    //   provider: function() {
    //     return new HDWalletProvider({
    //       privateKeys: ['0bcaf5dc87a451230b0d6bbb9b4fdd5abc117359db980c07b059dccd0e44c8ec'],
    //       providerOrUrl: 'https://bsc-dataseed.binance.org/',
    //     });
    //   },
    //   network_id: 56
    // },
    bscTest: {
      provider: function() {
        return new HDWalletProvider({
          privateKeys: ['0bcaf5dc87a451230b0d6bbb9b4fdd5abc117359db980c07b059dccd0e44c8ec'],
          providerOrUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        });
      },
      network_id: 97
    },
    matic: {
      provider: function() {
        return new HDWalletProvider({
          privateKeys: ['0bcaf5dc87a451230b0d6bbb9b4fdd5abc117359db980c07b059dccd0e44c8ec'],
          // providerOrUrl: 'https://rpc-mumbai.maticvigil.com/',
          providerOrUrl: 'https://matic-mumbai.chainstacklabs.com/',
          
        });
      },
      network_id: 80001
    },
  },

  contracts_directory: './src/contracts',
  contracts_build_directory: './src/abis',

  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer:{
        enabled:'true',
        runs: 200
      } 
    }
  },
};
