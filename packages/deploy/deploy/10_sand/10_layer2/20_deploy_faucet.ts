import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {isL2, unless} from "../../../utils/deploymentSkip";
import {BigNumber} from '@ethersproject/bignumber';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  const sand = await deployments.get('PolygonSand');
  const period = 30;
  const DECIMALS_18 = BigNumber.from('1000000000000000000');
  const amountLimit = DECIMALS_18.mul(10);

  await deploy('PolygonFaucet', {
    contract: "sandbox-smart-contracts-0.0.30/src/solc_0.8/faucet/Faucet.sol:Faucet",
    from: deployer,
    log: true,
    args: [sand.address, period, amountLimit],
    skipIfAlreadyDeployed: true,
  });
};
export default func;
func.tags = ['PolygonSandFaucet', 'PolygonSandFaucet_deploy'];
func.dependencies = ['PolygonSand_deploy'];
func.skip = unless(isL2);
