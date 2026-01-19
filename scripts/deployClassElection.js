require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying ClassElection with the account:", deployer.address);

  const ClassElection = await ethers.getContractFactory("ClassElection");
  const classElection = await ClassElection.deploy();
  await classElection.deployed();

  console.log("ClassElection deployed to:", classElection.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });