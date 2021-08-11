import { BigInt, DataSourceContext } from "@graphprotocol/graph-ts";
import { kanbanCreated } from "../generated/KanbanFactory/KanbanFactory" //ts created based on the YAML files
import { Kanban } from "../generated/templates" //ts created based on the YAML files
import { kanbanBoard } from "../generated/schema"
import { log } from "@graphprotocol/graph-ts";

export function handlekanbanCreated(event: kanbanCreated): void {
  log.info("Making kanban", []);
   let entity = kanbanBoard.load(event.params.id.toHexString())  
   if (entity == null) {
     entity = new kanbanBoard(event.params.id.toHexString())
   }

  entity.creator = event.params.creator
  entity.instance = event.params.instance
  entity.pm = event.params.pm
  entity.title = event.params.title
  entity.details = event.params.description
  entity.save()

  //creating kanban with context of id
  let context = new DataSourceContext();
  context.setString("id", event.params.id.toHexString());
  Kanban.createWithContext(event.params.instance, context);
}
