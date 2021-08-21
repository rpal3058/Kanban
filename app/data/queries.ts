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
    funder
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
    taskAssigned
    taskReviewed
    taskClosed  
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