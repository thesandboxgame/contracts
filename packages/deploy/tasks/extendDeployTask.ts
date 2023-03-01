import {extendEnvironment, task} from "hardhat/config";
import {TASK_DEPLOY_RUN_DEPLOY} from "hardhat-deploy";
import {isInTags} from "../utils/deploymentSkip";

declare module 'hardhat/types/runtime' {
  interface HardhatRuntimeEnvironment {
    tagFilter: string[];
  }
}

extendEnvironment(hre => {
  // Used to specifically skip some deployments if needed
  hre.tagFilter = [];
});

task(TASK_DEPLOY_RUN_DEPLOY, 'Deploy contracts')
  .addOptionalParam("tagFilter", "skip deployment script that don't have this tag")
  .setAction(async (args, hre, runSuper) => {
    if (!args.tags && isInTags(hre, "mainnet")) {
      throw new Error('on mainnet use some tag, maybe production is the right one')
    }
    if (args.tagFilter) {
      hre.tagFilter = args.tagFilter.split(",")
    }
    await runSuper(args);
    hre.tagFilter = [];
  });

