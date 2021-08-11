import {useRouter } from "next/router";
import {ethers} from "ethers"; // Ethers
import {useEffect, useState } from "react";
import { Container } from "unstated-next";
import  Header from "../../components/header";
import Layout from "../../components/layout";
import { web3 } from "../../containers";
import {getTaskList, getBoardList, getRequestList} from "../../data/functions";

export default function Home() { 
  const router = useRouter()
  const {kanban, kanbanFactory} = web3.useContainer()

  //To track the rendering flow
  useEffect(()=>{
    console.log("Loading Task Page...")
    console.log(kanban)
  },[]) 
 
  //defining state
  const [boardFunds, setBoardFunds] = useState("") 
  const [addBoardFunds, setAddBoardFunds] = useState(false) //this will trigger the dialogue box to send funds to the board
  const [load,setload] = useState(true)
  const [instanceOfKB,setInstanceOfKB] =useState(null)
  const [addTask, setAddTask] = useState(false)
  const [title, setTitle] = useState("")
  const [details, setDetails]= useState("")  
  const [taskFunds, setTaskFunds] = useState("")
  const [taskList,setTaskList] = useState([])
  const [requestList,setRequestList] = useState([])
  const [selectRaider,setSelectRaider] = useState(false)

  //Getting the id of the board that was selected
  const { kanbanid } = router.query;
  const id = kanbanid

  //getting the details of the board the was clicked
  useEffect(()=>{
    async function getKanbanClone(){
      if(kanban!=undefined)//this is to check if the metamask is connected or not
      {   
        const boardDetails = await getBoardList()
        if(boardDetails!=undefined) //this is to check if the details of the board selected has been propoerly loaded
        {
          //getting the list of task from subgraph
          console.log("List of task ")
          let temp = await getTaskList()
          setTaskList(temp)

          //getting the list of requests for a task from subgraph
          console.log("List of requests")
          temp = await getRequestList()
          console.log(temp)
          setRequestList(temp)
     
          //deploying an instanc eof the kanban 
          const instanceDeployedAt = boardDetails[Number(id)-1].instance
          const kbInstance = await kanban.attach(instanceDeployedAt)
          setInstanceOfKB(kbInstance)
          const balance = await kbInstance.contractBalance()
          let ethBalance = ethers.utils.formatEther(balance)
          setBoardFunds(ethBalance)
        }
      }
      else {
        console.log("Connect to the Provider i.e wallet like Metamask")
      }  
    }
    getKanbanClone()
  },[load])

  //function to add the funds
  const fundsAdded = async (e)=>{
    setload(false)
    e.preventDefault();   
    try {
        if(instanceOfKB != null){
          const value = ethers.utils.parseEther(boardFunds)
          let tx = await instanceOfKB.payContract(value, { value: value })
          await tx.wait()
          setload(true) //to disable the processing icon
          setAddBoardFunds(false) //to close the add fund dialgue bo
        }else{
          alert("Not connected to the provider (e.g MetaMask)")  
          setload(true)
          setAddBoardFunds(false) //to close the add fund dialgue bo           
        }
      } catch (error) {
          alert(error)
          setload(true)
          setAddBoardFunds(false) //to close the add fund dialgue bo                     
        }
  }
  
  const taskAdded = async (e) =>{
    setload(false) //to disable the processing icon
    e.preventDefault()
    try {
        if(instanceOfKB!=null){
        const value = ethers.utils.parseEther(taskFunds)    
        const tx = await instanceOfKB.submitTask(value, title,details) //creating the clone of the contract
        await tx.wait()
        setload(true) //to disable the processing icon
        setAddTask(false)
      }else{
        alert("Not connected to the provider (e.g MetaMask)")
        setload(true)
        setAddTask(false) //to close the add fund dialgue bo
      } 
    }catch (error) {
        alert(error)
        setload(true)
        setAddTask(false) //to close the add fund dialgue bo
      }
  }

  const onClaim = async (e) =>{
    const tx = await instanceOfKB.requestTask(e) //creating the clone of the contract
    await tx.wait()
  }

  return(
    <div className="bg-blue-500 w-screen h-screen">
      <Layout>
        {/*Displaying Funds*/ }
        <div className="mx-auto">
          <div className="text-2xl font-light justify-end mx-8 my-8">
              Total Funds (in Eth): {boardFunds} 
          </div>
        </div>

        {/* Adding Funds */}
        <button 
            className="bg-gray-900 text-white font-light py-2 px-4 mx-8 my-4"
            onClick= {() => setAddBoardFunds(true)}
          > 
            Add Funds
          </button>
          {addBoardFunds?
            (
              <div className="bg-gray-900 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl px-60">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                      <div className="flex items-start justify-between p-5 rounded-t text-gray-700 text-xl font-bold ">
                          Add Funds
                      </div>

                    {/*body*/}
                      <div className="relative p-6 flex-auto">
                      <div className="mb-4">
                          <label className="block text-gray-700 text-xl font-light mb-2">
                            Funds (in Eth)
                          </label>
                          <input 
                          className="shadow appearance-none border rounded w-full py-2 px-3
                           text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                           id="funds" 
                           type="text" 
                           placeholder="funds to add"
                           onChange = {(e)=>setBoardFunds(e.target.value)}
                          />   
                        </div>
                      </div>
                                                
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
        
      {/* Adding New Tasks */}
        <div className="p-6">
      <button className="w-full bg-gray-900 cta-btn font-semibold text-white  py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 hover:text-gray-900 flex items-center justify-center"
      onClick= {() => setAddTask(true)}
      >
        + New Task
      </button>
      {addTask?
      (              
        <div className="bg-gray-900 justify-center items-center flex overflow-x-hidden 
                  overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-auto my-6 mx-auto max-w-3xl px-60">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          
              {/*header*/}
                <div className="flex items-start justify-between p-5 rounded-t text-gray-700 text-xl font-bold ">
                    Add Task
                </div>

              {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-xl font-light mb-2">
                      Task Details
                    </label>

                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3
                        text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2" 
                        id="title" 
                        type="text" 
                        placeholder="Title"
                        onChange = {(e)=>setTitle(e.target.value)}
                    />   
                
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 
                        text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2" 
                        id="details" 
                        type="text" 
                        placeholder="Details"
                        onChange = {(e)=>setDetails(e.target.value)}
                    />

                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 
                        text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2" 
                        id="PM" 
                        type="text" 
                        placeholder="Amount to be assigned to the task"
                        onChange = {
                          (e)=>{
                            if(e.target.value<boardFunds){
                              setTaskFunds(e.target.value) 
                            } else{
                              alert("Value of the funds assigned cant be more thatn the board funds")
                            }
                          }
                        }
                    />    
            
                  </div>
                </div>
                  
              {/*footer*/}
                {load ?(
                  <div className="flex items-center justify-end p-6  rounded-b">
                    <button
                      className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={(e) => taskAdded(e)}
                    >
                      Add
                    </button>

                    <button
                      className="bg-emerald-500 text-black active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded  outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setAddTask(false)}
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
        
      {/* Displaying tasks*/}
        <div className="flex">
          {/*Displaying the task add to TRIAGE*/}
          <div className="flex-auto justify-center rounded bg-gray-300 w-64 p-2 m-6">
            <div className="flex justify-between py-2">
              <h3 className="text-center font-bold text-sm mx-2">TRIAGE</h3>
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
                                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded my-1"
                                  onClick={() => onClaim(taskList.taskID)}
                                >
                                  CLAIM
                                </button> 
                              </div>
                            </div>
                          </div>
                        )
                      }
                    })
                  }
            </div>

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
                                  <div className="relative w-auto my-6 mx-auto px-60">
                                    {/*content*/}
                                    <div className="mx-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                      {/*header*/}
                                        <div className="flex items-start justify-between p-5 rounded-t text-gray-700 text-xl font-bold ">
                                            Select Raider
                                        </div>

                                      {/*body */}
                                      <div className="relative p-6 flex-auto">
                                      {
                                        requestList.map((requestList)=>
                                        {
                                            if(requestList.taskID.id==taskList.id){
                                              return(   
                                                <div className="text-sm mt-2 px-2">
                                                    <div>
                                                    <h2>{"Request ID : " + requestList.requestID}</h2>
                                                    <p>{"Raider : " + requestList.raiderAddress}</p>
                                                    <br></br>
                                                    </div>
                                                  </div>
                                              )
                                          }
                                        })
                                      }
                                      </div>
                                     
                                                                  
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

          </div>  
      </Layout>
    </div>
  )        
}