import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {isL2, isNotMainnet, unless} from "../../../utils/deploymentSkip";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {getNamedAccounts} = hre;
  const {deployer} = await getNamedAccounts();
  const {deployments} = hre;
  await deployments.deploy('TRUSTED_FORWARDER', {
    contract: 'sandbox-smart-contracts-0.0.30/src/solc_0.8/test/TestMetaTxForwarder.sol:TestMetaTxForwarder',
    from: deployer,
    log: true,
    skipIfAlreadyDeployed: true,
  });
};

export default func;
func.tags = ['TRUSTED_FORWARDER', 'L2'];
func.skip = unless(isL2, isNotMainnet);
