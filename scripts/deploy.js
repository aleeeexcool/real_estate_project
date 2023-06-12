const hre = require('hardhat');

async function main() {
  const name = "Johny";
  const age = 25;
  const designation = "First inspector";

  const RealEstate = await ethers.getContractFactory("RealEstate", deployer)
  const estate = await RealEstate.deploy(name, age, designation)
  await estate.deployed()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })