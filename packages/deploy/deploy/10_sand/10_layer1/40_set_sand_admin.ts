import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {isL1, unless} from "../../../utils/deploymentSkip";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, ethers, getNamedAccounts} = hre;
  const {log, execute, read} = deployments;

  const {sandAdmin, sandExecutionAdmin} = await getNamedAccounts();

  const currentAdmin = await read('Sand', 'getAdmin');
  if (currentAdmin.toLowerCase() !== sandAdmin.toLowerCase()) {
    await execute(
      'Sand',
      {from: currentAdmin, log: true},
      'changeAdmin',
      sandAdmin
    );
  }

  const sand = await ethers.getContract('Sand');
  // skip for SAND contract without `changeExecutionAdmin` (rinkeby)
  const currentExecutionAdmin = await read('Sand', 'getExecutionAdmin');
  if (
    currentExecutionAdmin.toLowerCase() !== sandExecutionAdmin.toLowerCase()
  ) {
    log('setting Sand Execution Admin');
    await execute(
      'Sand',
      {from: currentExecutionAdmin, log: true},
      'changeExecutionAdmin',
      sandExecutionAdmin
    );
  }
};
export default func;
func.runAtTheEnd = true;
func.tags = ['Sand', 'Sand_setup'];
func.dependencies = ['Sand_deploy'];
func.skip = unless(isL1);
