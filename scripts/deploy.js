const hre = require('hardhat');
const { escape } = require('querystring');

async function main() {
  let estate;
  const name = "Johny";
  const age = 25;
  const designation = "First inspector";

  const RealEstate = await ethers.deployContract("RealEstate")
  estate = RealEstate.deploy(name, age, designation)
  await estate.deployed()

  console.log("Contract deployed at ", estate.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })