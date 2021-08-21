import request from "graphql-request";
import {useRouter } from "next/router";
import {useEffect, useState } from "react";
import { Container } from "unstated-next";
import  Header from "../../../components/header";
import Layout from "../../../components/layout";
import { web3 } from "../../../containers";
import {getTaskList, getBoardList, getRequestList} from "../../../data/functions";

export default function Home() {
  const router = useRouter()
  const {kanban, kanbanFactory} = web3.useContainer()

  //To track the rendering flow
  useEffect(()=>{
    console.log("Loading Raider List Page...")
  },[]) 
 
  //defining state
  const [load,setload] = useState(false)
  const [instanceOfKB,setInstanceOfKB] =useState(null)
  const [taskList,setTaskList] = useState([])
  const [requestList,setRequestList] = useState([])
  const [raiderList, setRaiderList]=useState([])
  const [raiderSelected, setRaiderSelected] = useState("")

  //Getting the id of the board that was selected
  const { taskid,kanbanid,taskNumberID} = router.query;
 
  //Getting the TaskID in the task schema
  let temp = taskid.toString()
  let temp2 = temp.split("x")
  const taskNumber = temp2[2]
  
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
          temp.wait
          setTaskList(temp)

          //getting the list of requests for a task from subgraph
          console.log("List of requests")
          temp = await getRequestList()
          temp.wait
          setRequestList(temp)
     
          // deploying an instanc eof the kanban 
          const instanceDeployedAt = boardDetails[Number(kanbanid)-1].instance
          const kbInstance = await kanban.attach(instanceDeployedAt)
          setInstanceOfKB(kbInstance)
          setload(true)
          
        }
      }
      else {
        console.log("Connect to the Provider i.e wallet like Metamask")
      }  
    }
    getKanbanClone()
  },[kanban])

 
  const assignRaider = async () =>{
    setload(false) //to disable the processing icon
    try {
        if(instanceOfKB!=null){
        const tx = await instanceOfKB.assignTaskToRaider(taskNumber,raiderSelected) 
        await tx.wait()     
      }else{
        alert("Not connected to the provider (e.g MetaMask)")
      } 
    }catch (error) {
        alert(error)
      } 
      router.push("/" + kanbanid)  
    }

  return(
      <div className="bg-grey-500 w-screen h-screen">
      <Layout>
      return  
        (
        {load?
          ( 
          <div className=" bg-gray-900 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-auto my-6 mx-auto px-60">
            {/*content*/}
            <div className="mx-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

              {/*header*/}
                <div className="flex items-start justify-between p-5 rounded-t text-gray-700 text-xl font-bold ">
                    Select Raider
                </div>
              
              {/*body */}
              {
                requestList.map((requestList)=>{
                if(requestList.taskID.id==taskid)
                  {
                    return(   
                      <label className="text-gray-700">
                        <input 
                        className="text-sm mt-2 px-2" 
                        name="radioButton" //the namprovide a name attribute on your input elements to mark them as part of the same radio button group.
                        id="title" 
                        type="radio" 
                        placeholder="Title"
                        onChange = {() => setRaiderSelected(requestList.requestID)}                                                     
                        />
                        <span className="ml-1">
                          <div className="text-sm mt-2 px-2">
                            <h2>{"Request ID : " + requestList.requestID}</h2>
                            <p>{"Raider : " + requestList.raiderAddress}</p>
                          <br></br>
                          </div>
                        </span>
                      </label>
                    )
                  }
                })
              }

              {/* Footer*/ }
                <div className="flex items-center justify-end p-6  rounded-b">
                  <button
                    className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick ={() => assignRaider()}
                  >
                    Select
                  </button>

                  <button
                    className="bg-emerald-500 text-black active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded  outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={()=>router.push("/" + kanbanid)}
                  >
                    Close
                  </button>
                </div>  

            </div>
          </div>
          </div>
          ):
          ( 
            <div className="bg-gray-900 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">  
            <div className= "text-red-500">
              Processing...
            </div>
            </div>
          )
        }
      )
    </Layout>
    </div>

  )        
}

  