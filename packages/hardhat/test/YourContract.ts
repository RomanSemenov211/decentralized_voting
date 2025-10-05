import { expect } from "chai";
import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";

describe("YourContract (Voting)", function () {
  let yourContract: YourContract;
  let deployer: any;
  let voter1: any;
  let voter2: any;

  before(async () => {
    [deployer, voter1, voter2] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("YourContract");
    // Длительность — 60 минут, 4 кандидата
    yourContract = (await factory.deploy(["Mark", "Mike", "Henry", "Rock"], 60)) as YourContract;
    await yourContract.waitForDeployment();
  });

  it("sets the right owner", async function () {
    expect(await yourContract.owner()).to.equal(deployer.address);
  });

  it("has initial candidates", async function () {
    const candidates = await yourContract.getAllCandidates();
    expect(candidates.length).to.equal(4);
    expect(candidates[0].name).to.equal("Mark");
  });

  it("allows voting and prevents double votes", async function () {
    // voter1 голосует за кандидата 0
    await yourContract.connect(voter1).vote(0);

    const candidates = await yourContract.getAllCandidates();
    // сравниваем строковое представление счётчика
    expect(candidates[0].voteCount.toString()).to.equal("1");

    // повторный голос от того же адреса должен откатиться
    await expect(yourContract.connect(voter1).vote(0)).to.be.revertedWith("You have already voted.");
  });

  it("owner can add candidate", async function () {
    await yourContract.connect(deployer).addCandidate("NewCandidate");
    const candidates = await yourContract.getAllCandidates();
    expect(candidates.length).to.equal(5);
    expect(candidates[4].name).to.equal("NewCandidate");
  });

  it("rejects invalid candidate index", async function () {
    await expect(yourContract.connect(voter2).vote(999)).to.be.revertedWith("Invalid candidate index.");
  });
});
