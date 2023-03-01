import {FixtureFunc} from "hardhat-deploy/dist/types";
import {deployments} from "hardhat";
import {HardhatRuntimeEnvironment} from "hardhat/types";

export function withSnapshot<T, O>(
  tags: string | string[] = [],
  func: FixtureFunc<T, O> = async () => {
    return <T>{};
  }
): (options?: O) => Promise<T> {
  return deployments.createFixture(
    async (env: HardhatRuntimeEnvironment, options?: O) => {
      // TODO: This has problems with solidity-coverage, when the fix that we can use it
      // TODO: We need a way to revert to initial state!!!
      //  await evmRevertToInitialState();
      await deployments.fixture(tags, {
        fallbackToGlobal: false,
        keepExistingDeployments: false,
      });
      return func(env, options);
    }
  );
}


