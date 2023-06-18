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

    buyer = {
      name: "Jonny",
      age: 21,
      city: "Paris",
      CNIC: 12345678,
      email: "jonny.best@gmail.com",
      verified: false
    };

    seller = {
      name: "Kate",
      age: 25,
      city: "New York",
      CNIC: 87654321,
      email: "kate.best@gmail.com",
      verified: false
    }
  });

  describe('Constructor', () => {
    it('should initialize the contract with the correct govInspector details', async () => {
      const storedInspector = await estate.landInspector(0);
      
      expect(storedInspector.id).to.equal(deployer.address);
      expect(storedInspector.name).to.equal("Inspector Name");
      expect(storedInspector.age).to.equal(30);
      expect(storedInspector.designation).to.equal("Inspector Designation");
    });
  });

  describe('Registration and Update Functions', () => {
    it("should increase the balance of the caller in deposite function", async function () {
      const initialBalance = await estate.connect(deployer).getBalance();
      
      const balance = ethers.utils.parseEther("1.0");
      await estate.deposite({ value: balance });
  
      const newBalance = await estate.connect(deployer).getBalance();
  
      expect(newBalance.sub(initialBalance)).to.equal(balance);
    });

    it("should revert if the account is already registered as a Buyer in registSeller function", async function () {
      await estate.registBuyer(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email);

      await expect(estate.registSeller("Jonny", 21, "Paris", 12345678, "jonny.best@gmail.com")).to.be.revertedWith("You are already registered as a Buyer");
    });

    it("should add infomation in sellers mapping and emit sellerRegistered event in registSeller function", async function () {
      await estate.registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email);

      const newSeller = await estate.sellers(seller.address);
      expect(newSeller.name).to.equal(seller.name);
      expect(newSeller.age).to.equal(seller.age);
      expect(newSeller.city).to.equal(seller.city);
      expect(newSeller.CNIC).to.equal(seller.CNIC);
      expect(newSeller.email).to.equal(seller.email);

      // await estate.connect(deployer).verifySeller(seller.address, seller.CNIC);
      // expect(estate.sellers(seller.address).verified).to.be.equal(true);
    });
  });

  describe('Upload and Verify functions', () => {

    

  });

  describe('Deposite, Buy and Withdraw functions', () => {
    it("should increase the balance of the caller in deposite function", async function () {
      const initialBalance = await estate.connect(deployer).getBalance();
      
      const balance = ethers.utils.parseEther("1.0");
      await estate.deposite({ value: balance });
  
      const newBalance = await estate.connect(deployer).getBalance();
  
      expect(newBalance.sub(initialBalance)).to.equal(balance);
    });


  });
})