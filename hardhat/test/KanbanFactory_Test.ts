/*
NOTE: THE TEST FILE RUNS OFN DEFAULT HARDHAT NETWORK AND DOESNT NEED GANACHE OR MAINNET OR TESTNET
IF YOU WANT TO USE GANCHE THE TYPE - npx hardhat --network localhost test 
*/  

import {Kanban__factory} from "../typechain"
import {KanbanFactory__factory} from "../typechain"

import { ethers} from "hardhat"
import chai from "chai"

//Handling Promises 
import chaiAsPromised from "chai-as-promised"
chai.use(chaiAsPromised)
const { expect } = chai

let instanceOfKanban
let instanceOfFactory
let signers 
let Kanban
describe("KanbanFactory", () => {
  beforeEach(async () => {  
    // 1 - Getting the top accounts from eith Ganache or Hardhat provided accounts
    signers = await ethers.getSigners();

    //2 - Deploying the actual contract
    Kanban = await ethers.getContractFactory("Kanban",signers[0])
    instanceOfKanban = await Kanban.deploy(); 
    await instanceOfKanban.deployed();

    // 3 - Deploying the factory that will clone the kanban
    const factory = await ethers.getContractFactory("KanbanFactory",signers[0])
    instanceOfFactory = await factory.deploy(instanceOfKanban.address); 
    await instanceOfFactory.deployed();
  });

  // 4 - Update test cases
  it("should check if both the contract have been deployed", async function(){
    let input
    //checking if the kanban was deployed
    input = instanceOfKanban.address;
    expect(input).to.not.be.undefined;

    //checking if the factory was deployed
    input = instanceOfFactory.address;
    expect(input).to.not.be.undefined;
  });

  it("should check if the Factory can create clones", async function(){
    const title= "Board 1"
    const description = "Testing the kanban"

    const pm = signers[0].address
    const tx = await instanceOfFactory.createKanban(title,description, pm) //creating the clone of the contract
    const kanbanInfo = await instanceOfFactory.kanbanInfo(1);
    
    //checking the PM in the deployed instance
     const cloneOfKB = await Kanban.attach(kanbanInfo.instance)
     const pmOfClone = await cloneOfKB.pm()
     expect(pmOfClone).to.be.equal(signers[0].address)
  });


})