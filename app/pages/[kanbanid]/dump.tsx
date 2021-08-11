   {/*Displaying the task add to ASSIGN*/}
   <div className="flex-auto justify-center rounded bg-gray-300 w-64 p-2 m-6">
   <div className="flex justify-between py-2">
     <h3 className="text-center font-bold text-sm mx-2">ASSIGN</h3>
   </div> 
       {         
           taskList.map((taskList) => {
             if(taskList.boardID.id==id){
               return(   
                 <div className="bg-white p-2 m-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
                   <div className="text-sm mt-2 px-2">
                     <div>
                     <h2>{"Title : " + taskList.taskTitle}</h2>
                     <p>{"Details : " + taskList.taskDetails}</p>
                     <p>{"Funds Allocated : " + taskList.taskFunds/1000000000000000000 + " Eth"}</p>
                       <button
                         className="bg-blue-500 hover:bg-blue-700 text-white my-1 font-bold py-1 px-1 rounded"
                         onClick={() => setSelectRaider(true)}
                       >
                         ASSIGN RAIDER
                       </button>
                       {selectRaider?
                         (
                           <div className="bg-gray-900 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                             <div className="relative w-auto my-6 mx-auto max-w-3xl px-60">
                               {/*content*/}
                               <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                 {/*header*/}
                                   <div className="flex items-start justify-between p-5 rounded-t text-gray-700 text-xl font-bold ">
                                       Select Raider
                                   </div>

                                 {/*body}
                                   <div className="relative p-6 flex-auto">
                                   requestList.map((requestList) => {
                                      if(taskList.taskID.id==id){
                                       return( 
                                       )
                                     }
                                   }
                                   </div>
                                 */}
                                                             
                                 {/*footer*/}
                                   {load ?(
                                     <div className="flex items-center justify-end p-6  rounded-b">
                                       <button
                                         className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                         type="button"
                                         onClick={(e) => fundsAdded(e)}
                                       >
                                         Add
                                       </button>

                                       <button
                                         className="bg-emerald-500 text-black active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded  outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                         type="button"
                                         onClick={() => setAddBoardFunds(false)}
                                       >
                                         Close
                                       </button>
                                     </div>  
                                     ):(
                                       <div className="flex items-center justify-end p-6  rounded-b">  
                                         <button type="button" className="text-red-500" disabled>
                                           <svg className="animate-spin h-1 w-1 mr-1 ..." viewBox="0 0 24 24">
                                           </svg>
                                             Processing...
                                         </button>
                                       </div>  
                                     )
                                   }
                                   </div> 
                               </div>           
                             </div> 
                         ):null
                       }
                     </div>
                   </div>
                 </div>
               )
             }
           })
         }
   </div>

{/*Displaying the task add to REVIEW*/}
 <div className="flex-auto justify-center rounded bg-gray-300 w-64 p-2 m-6">
   <div className="flex justify-between py-2">
     <h3 className="text-center font-bold text-sm mx-2">FOR REVIEW</h3>
   </div> 
       {         
           taskList.map((taskList) => {
             if(taskList.boardID.id==id){
               return(   
                 <div className="bg-white p-2 m-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
                   <div className="text-sm mt-2 px-2">
                     <div>
                     <h2>{"Title : " + taskList.taskTitle}</h2>
                     <p>{"Details : " + taskList.taskDetails}</p>
                     <p>{"Funds Allocated : " + taskList.taskFunds/1000000000000000000 + " Eth"}</p>
                     <button
                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-1 py-1 px-1 rounded "
                         onClick={() => onClaim(id)}
                       >
                         REVIEWED
                     </button>
                     </div>
                   </div>
                 </div>
               )
             }
           })
         }
   </div>

{/*Displaying the task add to COMPLETE*/}
 <div className="flex-auto justify-center rounded bg-gray-300 w-64 p-2 m-6">
   <div className="flex justify-between py-2">
     <h3 className="text-center font-bold text-sm mx-2">COMPLETED</h3>
   </div> 
       {         
           taskList.map((taskList) => {
             if(taskList.boardID.id==id){
               return(   
                 <div className="bg-white p-2 m-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
                   <div className="text-sm mt-2 px-2">
                     <div>
                     <h2>{"Title : " + taskList.taskTitle}</h2>
                     <p>{"Details : " + taskList.taskDetails}</p>
                     <p>{"Funds Allocated : " + taskList.taskFunds/1000000000000000000 + " Eth"}</p>
                     </div>
                   </div>
                 </div>
               )
             }
           })
         }
   </div>      


<div className="text-sm mt-2 px-2">
<h2>{"Request ID : " + requestList.requestID}</h2>
<p>{"Raider : " + requestList.raiderAddress}</p>
<br></br>
</div>
