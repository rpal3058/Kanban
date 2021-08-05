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
import { kanbanBoard, task } from "../generated/schema"

//getting the context from the factory mapping
let context = dataSource.context()
let kanbanId = context.getString("id")

export function handleTaskSubmitted(event: taskSubmitted): void {
    let entity =  task.load(event.params.task_id.toHexString() + kanbanId)
    if (entity == null) {
      entity = new task(event.params.task_id.toHexString() + kanbanId)
    }
    //entity.taskFunds = event.params.funds
    entity.boardID=kanbanId
    entity.taskTitle = event.params.title
    entity.taskDetails = event.params.detail
    entity.save()
}

export function handleContractPaid(event: contractPaid): void {
    let entity =  kanbanBoard.load(kanbanId)
    if (entity == null) {
      entity = new kanbanBoard(kanbanId)
    }    
    // entity.funder = event.params.funder
    entity.funds = event.params.fundAmount
    entity.save()
}
