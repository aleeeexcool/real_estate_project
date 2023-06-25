const ethers = require ('hardhat');

async function main() {
  const RealEstate = await ethers.getContractFactory('RealEstate');
  const estate = await RealEstate.deploy('Inspector Name', 30, 'Inspector Designation');
  await estate.deployed();

  console.log("Contract deployed at ", estate.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
})