const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("RealEstate", function () {
  let estate;
  let govInspector;
  let deployer;
  let seller;
  let buyer;

  beforeEach(async () => {
    [deployer, seller, buyer] = await ethers.getSigners();

    const RealEstate = await ethers.deployContract('RealEstate');
    estate = await RealEstate.deploy('Inspector Name', 30, 'Inspector Designation');
    await estate.deployed();

    govInspector = {
        id: deployer.address,
        name: 'Inspector Name',
        age: 30,
        designation: 'Inspector Designation',
    };
  });

  describe('Constructor', () => {
    it('should initialize the contract with the correct govInspector details', async () => {
      const storedInspector = await estate.landInspector(0);
      
      expect(storedInspector).to.deep.equal(govInspector);
    });
  });

  // describe('Seller', () => {
  //   it('should register a seller', async () => {
  //     const name = 'Seller Name';
  //     const age = 25;
  //     const city = 'Seller City';
  //     const CNIC = 1234567890;
  //     const email = 'seller@example.com';

  //     await landContract.registerSeller(name, age, city, CNIC, email);

  //     const storedSeller = await landContract.sellerMapp(seller.address);
  //     expect(storedSeller).to.deep.equal({
  //       name,
  //       age,
  //       city,
  //       CNIC,
  //       email,
  //       verified: false,
  //     });
  //   });
  // });
})