// A hack to set the FQN for the contracts to latest
import {task} from "hardhat/config";

task("printFQN", async function (args, hre, runSuper) {
  const fqns = await hre.artifacts.getAllFullyQualifiedNames();
  console.log(fqns.filter(x => x.startsWith("sandbox")).join("\n"))
});
