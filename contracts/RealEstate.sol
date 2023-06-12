// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract RealEstate {
    // Struct details of LandInfo
    struct LandInfo{
        uint landId;
        string area;
        string state;
        string city;
        uint totalPrice;
        address propertyOwner;
        bool verified;
    }

    // Struct details of buyer
    struct buyer{
        string name; 
        uint age; 
        string city; 
        uint CNIC; 
        string email;
        bool verified;
    }

    // Struct details of seller
    struct seller{
        string name; 
        uint age; 
        string city; 
        uint CNIC; 
        string email;
        bool verified; 
    }

    // Struct details of govtInspector
    struct govtInspector{
        address id; 
        string name; 
        uint age; 
        string designation;
    }

    mapping(address => uint) balance;
    mapping(uint => govtInspector) landInspector;
    mapping(uint => LandInfo) public lands;
    mapping(address => seller) sellerMapp;
    mapping(address => buyer) buyerMapp;

    event sellerRegistered(string name, uint _age, string city, uint _CNIC, string email); 
    event buyerRegistered(string name, uint _age, string city, uint _CNIC, string email);  
    event sellerDetailsUpdated(string  _name, uint _age, string  _city, uint _CNIC, string  _email); 
    event buyerDetailsUpdated(string  _name, uint _age, string  _city, uint _CNIC, string  _email);  
    event sellerIsVerified(address addr, uint _CNIC); 
    event buyerIsVerified(address addr, uint _CNIC); 
    event landUploaded(uint _landId, string  _area, string  _state, string  _city, uint _totalPrice); 
    event landIsVerified(uint _landId); 
    event landBought(uint _landId, uint amount, address sellerAcc); 
    event ownershipTransfered(uint landId, address newOwner); 

    /*
     * @dev Constructor function to declare an Inspector.
     * Requirement:
     * - This function can be called by deployer
     * @param _name - _name 
     * @param _age -  _age 
     * @param _designaiton - _designaiton  
    
    */
    constructor(string memory _name, uint _age, string memory _designaiton){
        landInspector[0] = govtInspector({
            id: msg.sender,
            name: _name,
            age: _age,
            designation: _designaiton
        });
    }

    modifier onlyInspector(){
        require(landInspector[0].id == msg.sender, "Only Land inspector has access to this function");
        _;
    }

    /*
     * @dev deposite allows to deposite ethers.
    */
    function deposite() public payable {
        balance[msg.sender] += msg.value;
    }

    /*
     * @dev registerSeller allows to register sellers.
     * Requirement:
     * - This function can be called by anyone
     * @param _name - _name 
     * @param _age -  _age 
     * @param _city - _city  
     * @param _city -  _city
     * @param _email -  _email
     *
     * Emits a {sellerRegistered(  _name,  _age,   _city,  _CNIC,   _email)} event.
    */
    function registSeller(string memory _name, uint _age, string memory _city, uint _CNIC, string memory _email) public {
        require(buyerMapp[msg.sender].CNIC == 0, "You are already registered as a Buyer");
        sellerMapp[msg.sender] = seller({
            name: _name,
            age: _age,
            city: _city,
            CNIC: _CNIC,
            email: _email,
            verified: false
        });

        emit sellerRegistered(  _name,  _age,   _city,  _CNIC,   _email);
    }

    /*
     * @dev updateSeller allows to update seller details.
     * Requirement:
     * - This function can be called by anyone
     * @param _name - _name 
     * @param _age -  _age 
     * @param _city - _city  
     * @param _city -  _city
     * @param _email -  _email
     *
     * Emits a {sellerDetailsUpdated} event.
    */
    function updateSeller(string memory _name, uint _age, string memory _city, uint _CNIC, string memory _email) public {
        sellerMapp[msg.sender] = seller ({
            name: _name,
            age: _age,
            city: _city,
            CNIC: _CNIC,
            email: _email,
            verified: false
        });   

        emit sellerDetailsUpdated( _name, _age,  _city, _CNIC,  _email); 
    }

    /*
     * @dev registBuyer allows to register buyers.
     * Requirement:
     * - This function can be called by anyone
     * @param _name - _name 
     * @param _age -  _age 
     * @param _city - _city  
     * @param _city -  _city
     * @param _email -  _email
     *
     * Emits a {buyerRegistered} event.
    */
    function registBuyer(string memory _name, uint _age, string memory _city, uint _CNIC, string memory _email) public {
        require(sellerMapp[msg.sender].CNIC == 0, "You are already registered as a Seller");
        buyerMapp[msg.sender] = buyer({
            name: _name,
            age: _age,
            city: _city,
            CNIC: _CNIC,
            email: _email,
            verified: false
        });

        emit buyerRegistered( _name,  _age, _city, _CNIC, _email);
    }


    /*
     * @dev updateBuyer allows to update buyer details.
     * Requirement:
     * - This function can be called by anyone
     * @param _name - _name 
     * @param _age -  _age 
     * @param _city - _city  
     * @param _city -  _city
     * @param _email -  _email
     *
     * Emits a {buyerDetailsUpdated} event.
    */
    function updateBuyer(string memory _name, uint _age, string memory _city, uint _CNIC, string memory _email) public {
        require(buyerMapp[msg.sender].verified == true, "Seller is in pending status");
        buyerMapp[msg.sender] = buyer ({
            name: _name,
            age: _age,
            city: _city,
            CNIC: _CNIC,
            email: _email,
            verified: false
        });

        emit buyerDetailsUpdated(  _name, _age,  _city, _CNIC,  _email);
    }

    /**
     * @dev uploadLand allows to upload Land.
     * Requirement:
     * - This function can be called by anyone
     * @param _landId - _landId 
     * @param _area -  _area 
     * @param _state - _state  
     * @param _city -  _city
     * @param _totalPrice -  _totalPrice
     *
     * Emits a {landUploaded} event.
    */
    function uploadLand(uint _landId, string memory _area, string memory _state, string memory _city, uint _totalPrice) public {
        require(sellerMapp[msg.sender].verified == true,"You are not verified SELLER");

        lands[_landId] = LandInfo({
            landId: _landId,
            area: _area,
            state: _state,
            city: _city,
            totalPrice: _totalPrice,
            propertyOwner: msg.sender,
            verified: false
        });

        emit landUploaded( _landId,  _area,  _state,  _city, _totalPrice);
    }


    /*
     * @dev verifyLand allows to verify Land.
     * Requirement:
     * - This function can be called by onlyInspector
     * @param _landId - _landId 
     
     *
     * Emits a {landIsVerified} event.
    */
    function verifyLand(uint _landId) public onlyInspector {
        require(lands[_landId].landId == _landId, "Wrong Info");
        require(lands[_landId].verified == false, "Land is already verified!");

        lands[_landId].verified = true;

        emit landIsVerified(_landId);
    }

    /*
     * @dev buyLand allows to buy Land.
     * Requirement:
     * - This function can be called by anyone
     * @param _landId - _landId 
     * @param amount -  amount 
     * @param sellerAcc - sellerAcc  
     *
     * Emits a {landBought} event.
    */
    function buyLand(uint _landId, uint amount, address payable sellerAcc) public {
        require(lands[_landId].verified == true, "Land is not Verified");
        require(buyerMapp[msg.sender].verified == true, "You are not verified yet!");
        require(balance[msg.sender] >= amount, "Insufficient Balance");
        require(lands[_landId].totalPrice == amount, "Amount is not equal to the Land Price");
        require(lands[_landId].propertyOwner == sellerAcc,"Wrong Account");

        
        balance[msg.sender] -= amount;
        balance[sellerAcc] += amount;

        lands[_landId].propertyOwner = msg.sender;

        emit landBought(_landId, amount, sellerAcc);

    }

    /**
     * @dev transferOwnership allows to transfer the ownership of Land.
     * Requirement:
     * - This function can be called by anyone
     * @param landId - landId 
     * @param newOwner -  newOwner 
     *
     * Emits a {ownershipTransfered} event.
    */
    function transferOwnership(uint landId, address newOwner) public {
        require(lands[landId].propertyOwner == msg.sender, "You are not the owner of this land");
        require(lands[landId].verified == true, "Land is not Verified");
        
        lands[landId].propertyOwner = newOwner;

        emit ownershipTransfered(landId, newOwner);
    }

    /*
     * @dev VerifySeller allows to verify sellers.
     * Requirement:
     * - This function can be called by onlyInspector
     * @param addr - addr 
     * @param _CNIC -  _CNIC 
     *
     * Emits a {sellerIsVerified} event.
    */
    function VerifySeller(address addr, uint _CNIC) public onlyInspector {
        require(sellerMapp[addr].CNIC == _CNIC,"Wrong info");
        require(sellerMapp[addr].verified == false,"Seller is already verified");

        sellerMapp[addr].verified = true;

        emit sellerIsVerified( addr, _CNIC);
    }

    /*
     * @dev verifyBuyer allows to verify buyers.
     * Requirement:
     * - This function can be called by onlyInspector
     * @param addr - addr 
     * @param _CNIC -  _CNIC 
     *
     * Emits a {buyerIsVerified} event.
    */
    function verifyBuyer(address addr, uint _CNIC) public onlyInspector{
        require(buyerMapp[addr].CNIC == _CNIC, "Wrong Info");
        require(buyerMapp[addr].verified == false, "Buyer is already verified");

        buyerMapp[addr].verified = true;

        emit buyerIsVerified(addr, _CNIC);
    }


    /*
     * @dev landOwner allows to know the land owner.
     * Requirement:
     * - This function can be called by anyone
     * @param _landId - _landId 
     *
    */
    function landOwner(uint _landId) public view returns(address){
        return lands[_landId].propertyOwner;
    }


    /*
     * @dev landisVerified allows to know the land is verified or not.
     * Requirement:
     * - This function can be called by anyone
     * @param _landId - _landId 
     *
    */
    function landisVerified(uint _landId) public view returns(bool){
        return lands[_landId].verified;
    }


    /*
     * @dev checkSeller allows to check the seller verification.
     * Requirement:
     * - This function can be called by anyone
     * @param addr - addr 
     *
    */
    function checkSeller(address addr) public view returns(bool){
        return sellerMapp[addr].verified;
    }

    /*
     * @dev checkBuyer allows to check the buyer verification.
     * Requirement:
     * - This function can be called by anyone
     * @param addr - addr 
     *
    */
    function checkBuyer(address addr) public view returns(bool){
        return buyerMapp[addr].verified;
    }

    /*
     * @dev landInspectorr allows to get the inspector details.
    */
    function landInspectorr() public view returns(govtInspector memory){
        return landInspector[0];
    }

    /*
     * @dev getLandCity allows to check the buyer verification.
     * Requirement:
     * - This function can be called by anyone
     * @param _landId - _landId 
     *
    */
    function getLandCity(uint _landId) public view returns(string memory){
        return lands[_landId].city;
    }

    /*
     * @dev getLandPrice allows to get the price of land.
     * Requirement:
     * - This function can be called by anyone
     * @param _landId - _landId 
     *
    */
    function getLandPrice(uint _landId) public view returns(uint){
        return lands[_landId].totalPrice;
    }

    /*
     * @dev getArea allows to get the Area of land.
     * Requirement:
     * - This function can be called by anyone
     * @param _landId - _landId 
     *
    */
    function getArea(uint _landId) public view returns(string memory){
    
        return lands[_landId].area;
    }

    /*
     * @dev getArea allows to get the balance.
     *
    */
    function getBalance() public view returns(uint){
        return balance[msg.sender];
    }

     /*
     * @dev getArea allows to get the total balance of contract.
     * Requirement:
     * - This function can be called by onlyInspector
    */
    function getTotalBalance() public view onlyInspector returns(uint){
        return address(this).balance;
    }
    

    /*
     * @dev isBuyer allows to know wheather user is buyer or not.
     * Requirement:
     * - This function can be called by anyone
     * @param addr - addr 
     *
    */
    function isBuyer(address addr) public view returns(bool){
        if(buyerMapp[addr].CNIC == 0){
            return false;
        }else{
            return true;
        } 
    }

    /*
     * @dev isSeller allows to know wheather user is seller or not.
     * Requirement:
     * - This function can be called by anyone
     * @param addr - addr 
     *
    */
    function isSeller(address addr) public view returns(bool){
        if(sellerMapp[addr].CNIC == 0){
            return false;
        }else{
            return true;
        } 
    }
}