import { gql } from "graphql-request"; // graphql query language

// Collect information BOARD 
export const boardDetails = gql`
  {
    kanbanBoards{
    id
    creator
    instance
    task {
      id
    }
    pm
    title
    details
    funds
  }
}`;

// Collect information Task 
export const taskDetails = gql`
{
  tasks {
    id
    boardID {
      id
    }
    taskID
    taskFunds
    taskDetails
    taskTitle
  }
}`;

export const requestDetails = gql`
{
  requests{
    id
    taskID{
      id
    }
    requestID 
    raiderAddress
  } 
}`;