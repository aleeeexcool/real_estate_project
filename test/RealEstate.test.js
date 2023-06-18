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

    const RealEstate = await ethers.getContractFactory('RealEstate');
    estate = await RealEstate.deploy('Inspector Name', 30, 'Inspector Designation');
    await estate.deployed();

    govInspector = {
        id: deployer.address,
        name: 'Inspector Name',
        age: 30,
        designation: 'Inspector Designation',
    };
  });

  // describe('Constructor', () => {
  //   it('should initialize the contract with the correct govInspector details', async () => {
  //     const storedInspector = await estate.landInspector(0);
      
  //     expect(storedInspector.id).to.equal(deployer.address);
  //     expect(storedInspector.name).to.equal("Inspector Name");
  //     expect(storedInspector.age).to.equal(30);
  //     expect(storedInspector.designation).to.equal("Inspector Designation");
  //   });
  // });

  describe('Functions', () => {
    it("should increase the balance of the caller", async function () {
      const initialBalance = await estate.connect(deployer).getBalance();
      
      const balance = ethers.utils.parseEther("1.0");
      await estate.deposite({ value: balance });
  
      const newBalance = await estate.connect(deployer).getBalance();
  
      expect(newBalance.sub(initialBalance)).to.equal(balance);
    });

    it("should increase the balance of the caller", async function () {
      const initialBalance = await estate.connect(deployer).getBalance();
      
      const balance = ethers.utils.parseEther("1.0");
      await estate.deposite({ value: balance });
  
      const newBalance = await estate.connect(deployer).getBalance();
  
      expect(newBalance.sub(initialBalance)).to.equal(balance);
    });
  });
})