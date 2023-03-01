import 'dotenv/config';
import '@nomiclabs/hardhat-ethers'; // aliased to hardhat-deploy-ethers
import 'hardhat-deploy';
import 'hardhat-dependency-compiler';
import {accounts, addSourceFiles, nodeUrl} from "./utils/hardhatConfig";
import "./tasks/printFQN";
import "./tasks/extendDeployTask";

const networks = {
  /**
   * TAGS:
   *  - mainnet -> production networks (you must pay for gas!!!)
   *  - L1      -> Layer 1 networks
   *  - L2      -> Layer 2 networks
   */
  hardhat: {
    accounts: accounts(process.env.HARDHAT_FORK),
    tags: ['L1', 'L2'],
    companionNetworks: {
      l1: 'hardhat',
      l2: 'hardhat',
    },
    blockGasLimit:
      parseInt(process.env.HARDHAT_BLOCK_GAS_LIMIT || '0') || 30000000,
  },
  goerli: {
    url: nodeUrl('goerli'),
    accounts: accounts('goerli'),
    tags: ['L1'],
    // gasPrice: 600000000000, // Uncomment in case of pending txs, and adjust gas
    companionNetworks: {
      l2: 'mumbai',
    },
  },
  mainnet: {
    url: nodeUrl('mainnet'),
    accounts: accounts('mainnet'),
    tags: ['mainnet', 'L1'],
    companionNetworks: {
      l2: 'polygon',
    },
  },
  mumbai: {
    url: nodeUrl('mumbai'),
    accounts: accounts('mumbai'),
    tags: ['L2'],
    //gasPrice: 600000000000, // TODO: this fixes invalid sender issue
    companionNetworks: {
      l1: 'goerli',
    },
  },
  polygon: {
    url: nodeUrl('polygon'),
    accounts: accounts('polygon'),
    tags: ['mainnet', 'L2'],
    companionNetworks: {
      l1: 'mainnet',
    },
  },
};
const compilers = ['0.8.15', '0.8.2', '0.7.5', '0.6.5', '0.5.9',].map(version => (
  {
    version,
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
      },
    },
  }));
const config = {
  mocha: {
    timeout: 0,
    ...(!process.env.CI ? {} : {invert: true, grep: '@skip-on-ci'}),
  },
  solidity: {
    compilers
  },
  networks,
  namedAccounts: {
    deployer: {
      default: 1,
      ethereum: '0xe19ae8F9B36Ca43D12741288D0e311396140DF6F',
      polygon: '0x7074BB056C53ACC0b6091dd3FAe591aa3A4acC88',
      goerli: '0xA796AE911621E00809E0E7C8f0AD6BF118E5139e',
      mumbai: '0x5F890c9522dCE5670d741D4277BFCC2d9cA8Af02',
    }, // deploy contracts and make sure they are set up correctly
    sandAdmin: {
      default: 2,
      ethereum: '0xeaa0993e1d21c2103e4f172a20d29371fbaf6d06',
      polygon: '0xfD30a48Bc6c56E24B0ebF1B0117d750e2CFf7531',
      goerli: '0x39D01ecc951C2c1f20ba0549e62212659c4d1e06',
      mumbai: '0x49c4D4C94829B9c44052C5f5Cb164Fc612181165',
    }, // can add super operators and change admin
    upgradeAdmin: 'sandAdmin',
    sandBeneficiary: 'sandAdmin', // will be the owner of all initial SAND
    sandExecutionAdmin: 'sandAdmin', // can add execution extension to SAND (used for Native metatx support)
  },
};

export default addSourceFiles(config);
