import 'dotenv/config';
import {HardhatRuntimeEnvironment} from 'hardhat/types';

export function unless(...funcs: ((hre: HardhatRuntimeEnvironment) => boolean)[]): (hre: HardhatRuntimeEnvironment) => Promise<boolean> {
  return async (hre: HardhatRuntimeEnvironment) => !funcs.every(x => x(hre));
}

export function isL1(hre: HardhatRuntimeEnvironment): boolean {
  return isInTags(hre, 'L1');
}

export function isL2(hre: HardhatRuntimeEnvironment): boolean {
  return isInTags(hre, 'L2');
}

// This is just an extra security measure so we avoid deploying external contracts to mainnet
export function isNotMainnet(hre: HardhatRuntimeEnvironment): boolean {
  return !isInTags(hre, 'mainnet');
}

// Helper function to fix a bug in hardhat-deploy for the "hardhat" network.
export function isInTags(hre: HardhatRuntimeEnvironment, key: string): boolean {
  // Tag filter is used specifically for testing, for example to run hardhat but as L1 layer alone
  if (hre.tagFilter && hre.tagFilter.length > 0 && !hre.tagFilter.includes(key)) {
    return false;
  }
  return (
    (hre.network.tags && hre.network.tags[key]) ||
    (hre.network.config.tags && hre.network.config.tags.includes(key))
  );
}

