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

    // Struct details of govInspector
    struct govInspector{
        address id; 
        string name; 
        uint age; 
        string designation;
    }

    govInspector private landInspector;

    mapping(address => uint) private balance;
    mapping(uint => LandInfo) private lands;
    mapping(address => seller) private sellers;
    mapping(address => buyer) private buyers;

    event sellerRegistered(string name, uint _age, string city, uint _CNIC, string email); 
    event buyerRegistered(string name, uint _age, string city, uint _CNIC, string email);  
    event sellerDetailsUpdated(string  _name, uint _age, string  _city, uint _CNIC, string  _email); 
    event buyerDetailsUpdated(string  _name, uint _age, string  _city, uint _CNIC, string  _email);  
    event sellerIsVerified(address _address, uint _CNIC); 
    event buyerIsVerified(address _address, uint _CNIC); 
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
     * @param _designation - _designation  
    
    */
    constructor(string memory _name, uint _age, string memory _designation){
        landInspector = govInspector({
            id: msg.sender,
            name: _name,
            age: _age,
            designation: _designation
        });
    }

    modifier onlyInspector(){
        require(landInspector.id == msg.sender, "Only Land inspector has access!");
        _;
    }

    /*
     * @dev deposite allows to deposite ethers.
    */
    function deposite() public payable {
        balance[msg.sender] += msg.value;
    }
    
    /*
     * @dev withdraw allows to withdraw ethers.
    */
    function withdraw() external {
        require(balance[msg.sender] >= 0, "Insufficient Balance");
        uint value = balance[msg.sender];
        balance[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: value}("");
        require(success, "Failed! Ethers not sent!");
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
        require(buyers[msg.sender].CNIC == 0, "You are already registered as a Buyer");
        sellers[msg.sender] = seller({
            name: _name,
            age: _age,
            city: _city,
            CNIC: _CNIC,
            email: _email,
            verified: false
        });

        emit sellerRegistered(_name, _age, _city, _CNIC, _email);
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
        require(sellers[msg.sender].verified == true, "Seller is in pending status");
        sellers[msg.sender] = seller({
            name: _name,
            age: _age,
            city: _city,
            CNIC: _CNIC,
            email: _email,
            verified: false
        });   

        emit sellerDetailsUpdated(_name, _age, _city, _CNIC, _email); 
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
        require(sellers[msg.sender].CNIC == 0, "You are already registered as a Seller");
        buyers[msg.sender] = buyer({
            name: _name,
            age: _age,
            city: _city,
            CNIC: _CNIC,
            email: _email,
            verified: false
        });

        emit buyerRegistered(_name, _age, _city, _CNIC, _email);
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
        require(buyers[msg.sender].verified == true, "Buyer is in pending status");
        buyers[msg.sender] = buyer({
            name: _name,
            age: _age,
            city: _city,
            CNIC: _CNIC,
            email: _email,
            verified: false
        });

        emit buyerDetailsUpdated(_name, _age, _city, _CNIC, _email);
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
        require(sellers[msg.sender].verified == true,"You are not verified SELLER");

        lands[_landId] = LandInfo({
            landId: _landId,
            area: _area,
            state: _state,
            city: _city,
            totalPrice: _totalPrice,
            propertyOwner: msg.sender,
            verified: false
        });

        emit landUploaded(_landId, _area, _state, _city, _totalPrice);
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
        require(lands[_landId].verified == false, "Land is already verified");

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
        require(buyers[msg.sender].verified == true, "You are not verified yet!");
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
     * @param _address - _address 
     * @param _CNIC -  _CNIC 
     *
     * Emits a {sellerIsVerified} event.
    */
    function verifySeller(address _address, uint _CNIC) public onlyInspector {
        require(sellers[_address].CNIC == _CNIC,"Wrong info");
        require(sellers[_address].verified == false,"Seller is already verified");

        sellers[_address].verified = true;

        emit sellerIsVerified(_address, _CNIC);
    }

    /*
     * @dev verifyBuyer allows to verify buyers.
     * Requirement:
     * - This function can be called by onlyInspector
     * @param _address - _address 
     * @param _CNIC -  _CNIC 
     *
     * Emits a {buyerIsVerified} event.
    */
    function verifyBuyer(address _address, uint _CNIC) public onlyInspector {
        require(buyers[_address].CNIC == _CNIC, "Wrong Info");
        require(buyers[_address].verified == false, "Buyer is already verified");

        buyers[_address].verified = true;

        emit buyerIsVerified(_address, _CNIC);
    }

    function landOwner(uint _landId) public view returns(address){
        return lands[_landId].propertyOwner;
    }

    function landisVerified(uint _landId) public view returns(bool){
        return lands[_landId].verified;
    }

    function checkSeller(address _address) public view returns(bool){
        return sellers[_address].verified;
    }

    function checkBuyer(address _address) public view returns(bool){
        return buyers[_address].verified;
    }

    function _landInspector() public view returns(govInspector memory){
        return landInspector;
    }

    function getLandCity(uint _landId) public view returns(string memory){
        return lands[_landId].city;
    }

    function getLandPrice(uint _landId) public view returns(uint){
        return lands[_landId].totalPrice;
    }

    function getArea(uint _landId) public view returns(string memory){
    
        return lands[_landId].area;
    }

    function getBalance() public view returns(uint){
        return balance[msg.sender];
    }

    function getTotalBalance() public view onlyInspector returns(uint){
        return address(this).balance;
    }
    
    function isBuyer(address _address) public view returns(bool){
        if(buyers[_address].CNIC == 0){
            return false;
        }else{
            return true;
        } 
    }

    function isSeller(address _address) public view returns(bool){
        if(sellers[_address].CNIC == 0){
            return false;
        }else{
            return true;
        } 
    }
}