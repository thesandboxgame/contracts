import '@nomicfoundation/hardhat-toolbox';

const compilers = ['0.8.2', '0.5.9']
  .map(version => ({
    version: version,
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
      },
    },
  }))

const config = {
  solidity: {compilers}
};

export default config;
