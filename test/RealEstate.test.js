const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("RealEstate", function () {
  let estate;
  let govInspector;
  let deployer;
  let seller;
  let buyer;

  beforeEach(async () => {
    [deployer, user1, user2] = await ethers.getSigners();

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
    };
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
    it("should revert if the account is already registered as a Buyer", async () => {
      await estate.connect(user1).registBuyer(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email);

      await expect(estate.connect(user1).registSeller(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email)).to.be.revertedWith("You are already registered as a Buyer");
    });

    it("should add infomation in sellers mapping and emit sellerRegistered event", async () => {
      await expect(estate.connect(user1).registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email))
      .to.emit(estate, "sellerRegistered")
      .withArgs(seller.name, seller.age, seller.city, seller.CNIC, seller.email);
    });

    it("should update infomation in sellers mapping and emit sellerDetailsUpdated event", async () => {
      await estate.connect(user1).registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email);
      await estate.connect(deployer).verifySeller(user1.address, seller.CNIC);

      const newName = "Max";
      const newAge = 32;
      const newCity = "London";
      const newCNIC = 13245768;
      const newEmail = "max.best@gmail.com";
      
      await expect(estate.connect(user1).updateSeller(newName, newAge, newCity, newCNIC, newEmail))
      .to.emit(estate, "sellerDetailsUpdated")
      .withArgs(newName, newAge, newCity, newCNIC, newEmail);
    });

    it("should revert if the account is already registered as a Seller", async () => {
      await estate.connect(user2).registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email);

      await expect(estate.connect(user2).registBuyer(seller.name, seller.age, seller.city, seller.CNIC, seller.email)).to.be.revertedWith("You are already registered as a Seller");
    });

    it("should add infomation in buyers mapping and emit buyerRegistered event", async () => {
      await expect(estate.connect(user2).registBuyer(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email))
      .to.emit(estate, "buyerRegistered")
      .withArgs(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email);
    });

    it("should update infomation in buyers mapping and emit buyerDetailsUpdated event", async () => {
      await estate.connect(user2).registBuyer(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email);
      await estate.connect(deployer).verifyBuyer(user2.address, buyer.CNIC);

      const newName = "Tony";
      const newAge = 45;
      const newCity = "Dublin";
      const newCNIC = 12563478;
      const newEmail = "tony.best@gmail.com";
      
      await expect(estate.connect(user2).updateBuyer(newName, newAge, newCity, newCNIC, newEmail))
      .to.emit(estate, "buyerDetailsUpdated")
      .withArgs(newName, newAge, newCity, newCNIC, newEmail);
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