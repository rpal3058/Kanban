import client from ".";
import {
    boardDetails,
    taskDetails
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


