import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {isNotMainnet, unless} from "../utils/deploymentSkip";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
};

export default func;
func.tags = ["develop"];
func.skip = unless(isNotMainnet);
func.dependencies = [
  "CHILD_CHAIN_MANAGER",
  "Sand",
  "PolygonSand",
  "SandPermit", // Strange Permit support in a separated contract ?
  "SandFaucet" // Sand faucet
]
