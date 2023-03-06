import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {ethers} from "hardhat";
import {expect} from "chai";
import {constants} from "ethers";
import {parseEther} from "ethers/lib/utils";

async function deployContractsFixture() {
  const Sand = await ethers.getContractFactory("Sand");
  const [sandAdmin, executionAdmin, beneficiary] = await ethers.getSigners();
  const sand = await Sand.deploy(sandAdmin.address, executionAdmin.address, beneficiary.address);
  return {sand, sandAdmin, executionAdmin, beneficiary};
}

describe('Sand.sol', function () {
  it('test', async function () {
    const {sand} = await loadFixture(deployContractsFixture);
    await expect(sand.transfer(constants.AddressZero, parseEther("1.0"))).to.revertedWith("Cannot send to 0x0")
  });
});
