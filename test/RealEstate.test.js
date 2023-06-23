const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("RealEstate", function () {
  let estate;
  let govInspector;
  let deployer;
  let seller;
  let buyer;

  beforeEach(async () => {
    [deployer, user1, user2, user3] = await ethers.getSigners();

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

    land = {
      id: 1,
      area: "Asia",
      state: "UAE",
      city: "Dubai",
      totalPrice: 1,
      propertyOwner: user1.address,
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

  describe('Registration and Update functions', () => {
    it("should revert if the account is already registered as a Buyer", async () => {
      await estate.connect(user1).registBuyer(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email);

      expect(estate.connect(user1).registSeller(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email))
      .to.be.revertedWith("You are already registered as a Buyer");
    });

    it("should add info in sellers mapping and emit sellerRegistered event", async () => {
      await expect(estate.connect(user1).registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email))
      .to.emit(estate, "sellerRegistered")
      .withArgs(seller.name, seller.age, seller.city, seller.CNIC, seller.email);
    });

    it("should revert if the seller is already verified", async () => {
      await estate.connect(user1).registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email);
      await estate.connect(deployer).verifySeller(user1.address, seller.CNIC);

      expect(estate.connect(deployer).verifySeller(user1.address, seller.CNIC)).to.be.revertedWith("Seller is already verified")
    });

    it("should update verified status of seller", async () => {
      await estate.connect(user1).registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email);
      await estate.connect(deployer).verifySeller(user1.address, seller.CNIC);
      const newStatus = await estate.sellers(user1.address);

      expect(newStatus.verified).to.be.equal(true);
    });

    it("should revert if the buyer is already verified", async () => {
      await estate.connect(user2).registBuyer(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email);
      await estate.connect(deployer).verifyBuyer(user2.address, buyer.CNIC);
      
      expect(estate.connect(deployer).verifyBuyer(user2.address, buyer.CNIC));
    });

    it("should update verified status of buyer", async () => {
      await estate.connect(user2).registBuyer(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email);
      await estate.connect(deployer).verifyBuyer(user2.address, buyer.CNIC);
      const newStatus = await estate.buyers(user2.address);

      expect(newStatus.verified).to.be.equal(true);
    });

    it("should update info in sellers mapping and emit sellerDetailsUpdated event", async () => {
      await estate.connect(user1).registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email);
      await estate.connect(deployer).verifySeller(user1.address, seller.CNIC);

      const newName = "Max";
      const newAge = 32;
      const newCity = "London";
      const newCNIC = 13245768;
      const newEmail = "max.best@gmail.com";
      
      expect(estate.connect(user1).updateSeller(newName, newAge, newCity, newCNIC, newEmail))
      .to.emit(estate, "sellerDetailsUpdated")
      .withArgs(newName, newAge, newCity, newCNIC, newEmail);
    });

    it("should revert if the account is already registered as a Seller", async () => {
      await estate.connect(user2).registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email);

      expect(estate.connect(user2).registBuyer(seller.name, seller.age, seller.city, seller.CNIC, seller.email))
      .to.be.revertedWith("You are already registered as a Seller");
    });

    it("should add info in buyers mapping and emit buyerRegistered event", async () => {
      await expect(estate.connect(user2).registBuyer(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email))
      .to.emit(estate, "buyerRegistered")
      .withArgs(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email);
    });

    it("should update info in buyers mapping and emit buyerDetailsUpdated event", async () => {
      await estate.connect(user2).registBuyer(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email);
      await estate.connect(deployer).verifyBuyer(user2.address, buyer.CNIC);

      const newName = "Tony";
      const newAge = 45;
      const newCity = "Dublin";
      const newCNIC = 12563478;
      const newEmail = "tony.best@gmail.com";
      
      expect(estate.connect(user2).updateBuyer(newName, newAge, newCity, newCNIC, newEmail))
      .to.emit(estate, "buyerDetailsUpdated")
      .withArgs(newName, newAge, newCity, newCNIC, newEmail);
    });
  });

  describe('Upload, Verify and TransferOwnership functions', () => {
    it("should revert if the seller is not verified", async () => {
      await estate.connect(user1).registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email);
      
      expect(estate.connect(user1).uploadLand(land.id, land.area, land.state, land.city, land.totalPrice))
      .to.be.revertedWith("You are not verified SELLER");
    });
    
    it("should add info in lands mapping and emit landUploaded event", async () => {
      await estate.connect(user1).registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email);
      await estate.connect(deployer).verifySeller(user1.address, seller.CNIC);

      expect(estate.connect(user1).uploadLand(land.id, land.area, land.state, land.city, land.totalPrice))
      .to.emit(estate, "landUploaded")
      .withArgs(land.id, land.area, land.state, land.city, land.totalPrice);
    });
    
    it("should revert if not Land inspector try to verify the land", async () => {
      await expect(estate.connect(user2).verifyLand(0)).to.be.rejectedWith("Only Land inspector has access!");
    });

    it("should revert if the land is already verified", async () => {
      await estate.connect(user1).registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email);
      await estate.connect(deployer).verifySeller(user1.address, seller.CNIC);
      await estate.connect(user1).uploadLand(land.id, land.area, land.state, land.city, land.totalPrice);
      await estate.connect(deployer).verifyLand(land.id);
      
      expect(estate.connect(deployer).verifyLand(land.id)).to.be.revertedWith("Land is already verified");
    });

    it("should verify the land and emit landIsVerified event", async () => {
      await estate.connect(user1).registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email);
      await estate.connect(deployer).verifySeller(user1.address, seller.CNIC);
      await estate.connect(user1).uploadLand(land.id, land.area, land.state, land.city, land.totalPrice);
      
      expect(estate.connect(deployer).verifyLand(land.id))
      .to.emit(estate, "landIsVerified")
      .withArgs(land.id);
    });
  });

  describe('Deposite, Buy and Withdraw functions', () => {
    it("should increase the balance of the caller in deposite function", async () => {
      const initialBalance = await estate.connect(deployer).getBalance();
      
      const balance = ethers.utils.parseEther("1.0");
      await estate.deposite({ value: balance });
  
      const newBalance = await estate.connect(deployer).getBalance();
  
      expect(newBalance.sub(initialBalance)).to.equal(balance);
    });

    it("should revert if the buyer has not enough amount in the balance", async () => {
      const amount = 100;
      await estate.connect(user1).registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email);
      await estate.connect(deployer).verifySeller(user1.address, seller.CNIC);
      await estate.connect(user1).uploadLand(land.id, land.area, land.state, land.city, land.totalPrice);
      await estate.connect(deployer).verifyLand(land.id);
      await estate.connect(user2).registBuyer(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email);
      await estate.connect(deployer).verifyBuyer(user2.address, buyer.CNIC);
      
      await expect(estate.connect(user2).buyLand(land.id, amount, user1.address)).to.be.rejectedWith("Insufficient Balance");
    });

    it("should revert if the buyer has less amount than totalPrice of land", async () => {
      const amount = 75;
      await estate.connect(user1).registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email);
      await estate.connect(deployer).verifySeller(user1.address, seller.CNIC);
      await estate.connect(user1).uploadLand(land.id, land.area, land.state, land.city, land.totalPrice);
      await estate.connect(deployer).verifyLand(land.id);
      await estate.connect(user2).registBuyer(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email);
      await estate.connect(deployer).verifyBuyer(user2.address, buyer.CNIC);

      expect(estate.connect(user2).buyLand(land.id, amount, user1.address)).to.be.revertedWith("Amount is not equal to the Land Price");
    });

    it("should revert if the buyer want to buy land with another owner", async () => {
      const amount = 75;
      await estate.connect(user1).registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email);
      await estate.connect(deployer).verifySeller(user1.address, seller.CNIC);
      await estate.connect(user1).uploadLand(land.id, land.area, land.state, land.city, land.totalPrice);
      await estate.connect(deployer).verifyLand(land.id);
      await estate.connect(user2).registBuyer(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email);
      await estate.connect(deployer).verifyBuyer(user2.address, buyer.CNIC);

      expect(estate.connect(user2).buyLand(1, amount, user3.address)).to.be.revertedWith("Wrong Account");
    });

    it("should allow to buy land and emit landBought event", async () => {
      const amount = 100;
      await estate.connect(user1).registSeller(seller.name, seller.age, seller.city, seller.CNIC, seller.email);
      await estate.connect(deployer).verifySeller(user1.address, seller.CNIC);
      await estate.connect(user1).uploadLand(land.id, land.area, land.state, land.city, land.totalPrice);
      await estate.connect(deployer).verifyLand(land.id);
      await estate.connect(user2).registBuyer(buyer.name, buyer.age, buyer.city, buyer.CNIC, buyer.email);
      await estate.connect(deployer).verifyBuyer(user2.address, buyer.CNIC);

      expect(estate.connect(user2).buyLand(land.id, amount, user1.address))
      .to.emit(estate, "landBought")
      .withArgs(land.id, amount, user1.address);
    });
  });
})