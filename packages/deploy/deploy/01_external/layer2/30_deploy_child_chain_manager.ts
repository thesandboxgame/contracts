import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {isL2, isNotMainnet, unless} from "../../../utils/deploymentSkip";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();
  await deploy('CHILD_CHAIN_MANAGER', {
    contract: 'sandbox-smart-contracts-0.0.30/src/solc_0.8/test/FakeChildChainManager.sol:FakeChildChainManager',
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: true
  });
};
export default func;
func.tags = ['CHILD_CHAIN_MANAGER', 'L2'];
func.skip = unless(isL2, isNotMainnet);
