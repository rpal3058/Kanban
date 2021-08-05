/*
NOTE: THE TEST FILE RUNS OFN DEFAULT HARDHAT NETWORK AND DOESNT NEED GANACHE OR MAINNET OR TESTNET
IF YOU WANT TO USE GANCHE THE TYPE - npx hardhat --network localhost test 
*/  
import {Kanban__factory} from "../typechain"

import { ethers} from "hardhat"
import chai from "chai"

//Handling Promises 
import chaiAsPromised from "chai-as-promised"
chai.use(chaiAsPromised)
const { expect } = chai


let contractName = "Kanban"; //UPDATE THIS 
let instanceOfFactory
let signers 

describe(contractName, () => {
  beforeEach(async () => {  
    // 1
    signers = await ethers.getSigners();

    // 2
    const factory = await ethers.getContractFactory(contractName,signers[0])
    instanceOfFactory = await factory.deploy(); //UPDATE THIS if the constructor as any input
    await instanceOfFactory.deployed();
  });

  // 3
  //UPDATE THE TEST CASES
  it("should check if the contract has been deployed", async function(){
    const input = instanceOfFactory.address;
    expect(input).to.not.be.undefined;
  });

  it("should check if the contract is receiving funds", async function(){
    const value = ethers.utils.parseEther("1") //converting 1 to a Big Number format so that it can be easitly compared with the o/p of FundsAvailable 
    const tx = await instanceOfFactory.payContract(value, { value: value }) //sending ether to the contract
    const funds = await instanceOfFactory.contractBalance() //will generate a number in Big Number format
    expect(funds).to.be.equal(value);
  });  

  it("should check if the funder is being set", async function(){
    const value = ethers.utils.parseEther("1")//converting 1 to a Big Number format so that it can be easitly compared with the o/p of FundsAvailable 
    const tx = await instanceOfFactory.payContract(value, { value: value }) //sending amount of ethter to the contract and also settign the msg.valu to the amount of ether mentioned so that the require function is met
    const funder =  await instanceOfFactory.funder();
    expect(funder).to.be.equal(signers[0].address);
  });  

  it("should check if the PM is being set", async function(){
    //the PM is current set at 0x0 address hence the require statement will not become a blockers
    const tx = await instanceOfFactory.setPM(signers[0].address)
    const pm = await instanceOfFactory.pm()
    expect(pm).to.be.equal(signers[0].address)
  });
  
  it("should check that we cannot submit a task when the PM has not been set", async function(){
    const value = ethers.utils.parseEther(".01")
    await expect(instanceOfFactory.submitTask(value, "Test 1","Test Submission"))
    .to.be.rejectedWith("VM Exception while processing transaction: revert This function requires a PM to have been set") //Checking if we are getting the right error 
  });

  it("should check that we cannot submit a task with funds when the kanban has no funds overall ", async function(){
    await instanceOfFactory.setPM(signers[0].address) //setting the PM
    const value = ethers.utils.parseEther(".01")
    await expect(instanceOfFactory.submitTask(value, "Test 1","Test Submission"))
    .to.be.rejectedWith("VM Exception while processing transaction: revert Not enough funds") //Checking if we are getting the right error 
  });

  it("should check if we can submit a task", async function(){
    //setting the PM
    await instanceOfFactory.setPM(signers[0].address) 
    //paying the contract
    const value = ethers.utils.parseEther("1")//converting 1 to a Big Number format so that it can be easitly compared with the o/p of FundsAvailable 
    const tx = await instanceOfFactory.payContract(value, { value: value }) //sending amount of ethter to the contract and also settign the msg.valu to the amount of ether mentioned so that the require function is met
    const valueForTask = ethers.utils.parseEther(".01")
    await instanceOfFactory.submitTask(valueForTask, "Test 1","Test Submission",{value: value})
    const taskLog = await instanceOfFactory.taskLog(0)
    expect(taskLog.title).to.be.equal("Test 1")
    expect(taskLog.details).to.be.equal("Test Submission")
    expect(taskLog.funds.toString()).to.be.equal("10000000000000000")
    expect(taskLog.reviewed).to.be.equal(false)
    expect(taskLog.closed).to.be.equal(false)
  });

  it("should check if raiders can claim a task", async function(){
    //setting the PM
    await instanceOfFactory.setPM(signers[0].address) 
    //paying the contract
    const value = ethers.utils.parseEther("1")//converting 1 to a Big Number format so that it can be easitly compared with the o/p of FundsAvailable 
    const tx = await instanceOfFactory.payContract(value, { value: value }) //sending amount of ethter to the contract and also settign the msg.valu to the amount of ether mentioned so that the require function is met
    const valueForTask = ethers.utils.parseEther(".01")
    await instanceOfFactory.submitTask(valueForTask, "Test 1","Test Submission",{value: value})
    await instanceOfFactory.connect(signers[1]).requestTask(0)
    const requestsList = await instanceOfFactory.viewRequests(0,0)
    expect(requestsList[0]).to.be.equal(signers[1].address)
  })

  it("should check if the raider is being assigned", async function(){
    //setting the PM
    await instanceOfFactory.setPM(signers[0].address) 
    //paying the contract
    const value = ethers.utils.parseEther("1")//converting 1 to a Big Number format so that it can be easitly compared with the o/p of FundsAvailable 
    await instanceOfFactory.payContract(value, { value: value }) //sending amount of ethter to the contract and also settign the msg.valu to the amount of ether mentioned so that the require function is met
    const valueForTask = ethers.utils.parseEther(".01")
    await instanceOfFactory.submitTask(valueForTask, "Test 1","Test Submission",{value: value})
    await instanceOfFactory.connect(signers[1]).requestTask(0)
    await instanceOfFactory.connect(signers[2]).requestTask(0)
    await instanceOfFactory.connect(signers[0]).assignTaskToRaider(0,0) 
    const taskLog = await instanceOfFactory.taskLog(0)
    expect(taskLog.raider).to.be.equal(signers[1].address)	
  })

  it("should check if task can be approved and closed by the funder and the PM", async function(){
    //setting the PM and the funder
    await instanceOfFactory.setPM(signers[0].address) 
    const fundedAmount = ethers.utils.parseEther("1")   
    await instanceOfFactory.connect(signers[1]).payContract(fundedAmount, { value: fundedAmount} ) //sending amount of ethter to the contract and also settign the msg.valu to the amount of ether mentioned so that the require function is met
    const funder =  await instanceOfFactory.funder();
    

    //Handling Tasks
    let taskLog
    const valueForTask = ethers.utils.parseEther(".01")
    await instanceOfFactory.submitTask(valueForTask, "Test 1","Test Submission",{value: valueForTask})
    taskLog = await instanceOfFactory.taskLog(0)
    expect(taskLog.funds).to.be.equal(valueForTask)//cehcking if the task log has receive the amount asigned by PM
    
    //Two raiders are requestig for the task
    await instanceOfFactory.connect(signers[2]).requestTask(0)
    await instanceOfFactory.connect(signers[3]).requestTask(0)
 
    await instanceOfFactory.connect(signers[0]).assignTaskToRaider(0,0) //PM assigns the task to raider 
    await instanceOfFactory.connect(signers[2]).taskForReview(0) // Raider 1 submits the task for review
    await instanceOfFactory.connect(signers[0]).taskApproved(0) //task approved by the PM (i.e signers[0])
    await instanceOfFactory.connect(signers[1]).taskApproved(0) //task approved by the Funder (i.e signers[1])
    taskLog = await instanceOfFactory.taskLog(0) //gettign the updated tasklog
    expect(taskLog.closed).to.be.equal(true)
    expect(taskLog.funds).to.be.equal(0)
  })

})