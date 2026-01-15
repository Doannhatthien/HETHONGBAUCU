require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const initialSupply = ethers.utils.parseEther("1000002"); // 1,000,002 tokens
  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(initialSupply);
  await myToken.deployed();
  console.log("MyToken deployed to:", myToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
