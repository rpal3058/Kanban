import { dataSource, log } from "@graphprotocol/graph-ts";
import { kanbanCreated } from "../generated/KanbanFactory/KanbanFactory" //ts created based on the YAML files
import {
    assigned,
    taskRequested,
    taskCompleted,
    taskForReviewed,
    taskReviewRevoke,
    taskSubmitted,
    contractPaid,
} from  "../generated/templates/Kanban/Kanban" 
import { kanbanBoard, task,request } from "../generated/schema"

//getting the context from the factory mapping
let context = dataSource.context()
let kanbanId = context.getString("id")

export function handleContractPaid(event: contractPaid): void {
  let entity =  kanbanBoard.load(kanbanId)
  if (entity == null) {
    entity = new kanbanBoard(kanbanId)
  }    
  // entity.funder = event.params.funder
  entity.funds = event.params.fundAmount
  entity.save()
}

export function handleTaskSubmitted(event: taskSubmitted): void {
    let entity =  task.load(kanbanId + event.params.task_id.toHexString() )
    if (entity == null) {
      entity = new task(kanbanId + event.params.task_id.toHexString() )
    }
    //entity.taskFunds = event.params.funds
    entity.boardID=kanbanId
    entity.taskID = event.params.task_id
    entity.taskTitle = event.params.title
    entity.taskDetails = event.params.detail
    entity.taskFunds = event.params.funds
    entity.save()
}

export function handleTaskRequested(event: taskRequested): void {
  let entity =  request.load(kanbanId+event.params.task_id.toHexString()+event.params.requestId.toHexString())
  if (entity == null) {
    entity = new request(kanbanId+event.params.task_id.toHexString()+event.params.requestId.toHexString())
  }
  entity.taskID = kanbanId+event.params.task_id.toHexString()  //This should match the exact ID in row 29 and 31 since its where the task entity is being created and TaskID references this
  entity.requestID = event.params.requestId.toHexString()
  entity.raiderAddress = event.params.raider.toHexString()
  entity.save()
}
