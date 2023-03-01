import hre, {deployments} from "hardhat";
import '@nomiclabs/hardhat-ethers'; // aliased to hardhat-deploy-ethers
import {TASK_DEPLOY_RUN_DEPLOY} from "hardhat-deploy";
import {loadAllDeployments} from "hardhat-deploy/dist/src/utils";
import {Deployment} from "hardhat-deploy/types";
import {HARDHAT_NETWORK_NAME} from "hardhat/plugins";
import {expect} from "chai";
import {withSnapshot} from "../utils/testUtils";

type Deployments = { [name: string]: Deployment };

async function getDeployments(chainId: number): Promise<Deployments> {
  const deployedContracts = await loadAllDeployments(
    hre,
    hre.config.paths.deployments,
    false,
    {})
  return deployedContracts[chainId][0].contracts;
}

export const setupTest = withSnapshot<{ [name: string]: Deployment }, string>([], async (hre, tagFilter): Promise<Deployments> => {
    await hre.run(TASK_DEPLOY_RUN_DEPLOY, {
      tags: "production",
      tagFilter,
      reset: true,
      write: false
    });
    return deployments.all();
  }
);

async function deploymentTest(deploymentsContracts: Deployments, compiledContracts: { [name: string]: Deployment }) {
  const names = Object.keys(deploymentsContracts);
  for (const name of names) {
    const deployment = deploymentsContracts[name];
    const compiled = compiledContracts[name];
    delete compiledContracts[name];

    // This is ok, is just a reference to external contracts like trustedForwarder, etc.
    if (!deployment.bytecode) {
      continue;
    }

    if (!compiled) {
      console.warn(`contract ${name} is not deployed`);
      continue;
    }

    // skip proxies, we will check the implementation later.
    if (names.some(x => x === name + "_Proxy") && names.some(x => x === name + "_Implementation")) {
      if (deploymentsContracts[name + "_Proxy"].address != deployment.address) {
        console.warn(`contract ${name} has a proxy that don't match ${deploymentsContracts[name + "_Proxy"].address} != ${deployment.address}`);
      }
      console.log(`contract ${name} has a proxy, skip`);
    }
  }
  expect(Object.keys(compiledContracts)).to.be.eql([])
}

describe('deployed contract should match the deployment directory', function () {
  it('ethereum', async function () {
    this.timeout(5000000);
    expect(hre.network.name).to.be.eq(HARDHAT_NETWORK_NAME)

    const compiledContracts = await setupTest("L1");
    const deploymentsContracts = await getDeployments(1);
    await deploymentTest(deploymentsContracts, compiledContracts)
  });

  it('polygon', async function () {
    this.timeout(5000000);
    expect(hre.network.name).to.be.eq(HARDHAT_NETWORK_NAME)
    const compiledContracts = await setupTest("L2");
    const deploymentsContracts = await getDeployments(137);
    await deploymentTest(deploymentsContracts, compiledContracts)
  });
})
