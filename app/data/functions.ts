import client from ".";
import {
    boardDetails,
    taskDetails,
    requestDetails
} from "./queries";

export const getBoardList = async () => {
    // Collect fund details
    let board = await client.request(boardDetails);
    board = board.kanbanBoards  ;
  
    // Return funds
    return board
};    

export const getTaskList = async () => {
    // Collect fund details
    let task = await client.request(taskDetails);
    task = task.tasks  ;
  
    // Return funds
    return task
};    


export const getRequestList = async () => {
    // Collect fund details
    let request = await client.request(requestDetails);
    request = request.requests  ;
  
    // Return funds
    return request
};    
