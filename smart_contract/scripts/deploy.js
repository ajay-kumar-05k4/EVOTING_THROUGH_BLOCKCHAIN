const { ethers } = require("hardhat");

async function main() {
  const Voting = await ethers.getContractFactory("Voting"); // Ensure this matches your contract name
  const voting = await Voting.deploy(['Candidate A', 'Candidate B', 'Candidate C']);
  await voting.waitForDeployment();

  console.log("Voting contract deployed to:", await voting.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
