import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying YourContract with account:", deployer);

  const deployment = await deploy("YourContract", {
    from: deployer,
    args: [["Alice", "Bob", "Charlie"], 60],
    log: true,
  });

  // ✅ Получаем типизированный экземпляр контракта
  const yourContract = (await ethers.getContractAt(
    "YourContract",
    deployment.address
  )) as YourContract;

  // ✅ Теперь TypeScript знает про функции контракта
  const owner = await yourContract.owner();
  const count = await yourContract.getCandidatesCount();
  const remaining = await yourContract.getRemainingTime();

  console.log("Owner:", owner);
  console.log("Candidates count:", count.toString());
  console.log("Remaining time (seconds):", remaining.toString());

  const all = await yourContract.getAllCandidates();
  console.log("All candidates:", all);
};

export default deployYourContract;
deployYourContract.tags = ["YourContract"];
