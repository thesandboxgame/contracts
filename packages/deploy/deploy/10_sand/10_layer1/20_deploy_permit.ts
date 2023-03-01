import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {isL1, unless} from "../../../utils/deploymentSkip";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  const sand = await deployments.get('Sand');

  await deploy('Permit', {
    contract: 'sandbox-smart-contracts-0.0.30/src/solc_0.8/permit/Permit.sol:Permit',
    from: deployer,
    log: true,
    args: [sand.address],
    skipIfAlreadyDeployed: true,
  });
};
export default func;
func.tags = ['SandPermit', 'SandPermit_deploy'];
func.dependencies = ['Sand_deploy'];
func.skip = unless(isL1);
