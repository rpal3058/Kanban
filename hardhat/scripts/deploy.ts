import { ethers } from "hardhat";

async function main() {
  //Deploying Kanban
  const kanban = await ethers.getContractFactory("Kanban");
  let instanceOfKanban = await kanban.deploy();  
  console.log(
      `The address the Kanban contract WILL have once mined: ${instanceOfKanban.address}`
  );
  console.log(
      `The transaction that was sent to the network to deploy the Kanban contract: ${
          instanceOfKanban.deployTransaction.hash
      }`
  );
  console.log(
      'The Kanban contract is NOT deployed yet; we must wait until it is mined...'
  );
  await instanceOfKanban.deployed();
  console.log('Mined!');

  //Deploying Kanban Factory
  const kanbanFactory = await ethers.getContractFactory("KanbanFactory");
  let instanceOfKanbanFactory = await kanbanFactory.deploy(instanceOfKanban.address);  
  console.log(
      `The address the Kanban Factory contract WILL have once mined: ${instanceOfKanbanFactory.address}`
  );
  console.log(
      `The transaction that was sent to the network to deploy the Kanban Factory Contract: ${
        instanceOfKanbanFactory.deployTransaction.hash
      }`
  );
  console.log(
      'The Kanban Factory contract is NOT deployed yet; we must wait until it is mined...'
  );
  await instanceOfKanbanFactory.deployed();
  console.log('Mined!');

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
