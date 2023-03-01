import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {isL2, unless} from "../../../utils/deploymentSkip";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer, sandAdmin, sandExecutionAdmin} = await getNamedAccounts();

  const TRUSTED_FORWARDER_V2 = await deployments.getOrNull(
    'TRUSTED_FORWARDER_V2'
  );
  const CHILD_CHAIN_MANAGER = await deployments.get('CHILD_CHAIN_MANAGER');
  await deploy('PolygonSand', {
    contract: 'sandbox-smart-contracts-0.0.30/src/solc_0.8/polygon/child/sand/PolygonSand.sol:PolygonSand',
    from: deployer,
    args: [
      CHILD_CHAIN_MANAGER.address,
      TRUSTED_FORWARDER_V2?.address,
      sandAdmin,
      sandExecutionAdmin,
    ],
    log: true,
    skipIfAlreadyDeployed: true,
  });
};

export default func;
func.tags = ['PolygonSand', 'PolygonSand_deploy'];
func.dependencies = ['CHILD_CHAIN_MANAGER', 'TRUSTED_FORWARDER_V2'];
func.skip = unless(isL2);
