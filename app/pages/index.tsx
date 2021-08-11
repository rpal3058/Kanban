import {useRouter } from "next/router";
import {ethers} from "ethers"; // Ethers
import {useEffect, useState } from "react";
import { Container } from "unstated-next";
import  Header from "../components/header";
import Layout from "../components/layout";
import { web3 } from "../containers";
import {getBoardList} from "../data/functions";

export default function Home() { 
  const router = useRouter()
  const {kanbanFactory} = web3.useContainer()

  //To track the rendering flow
  useEffect(()=>{
    console.log("Loading Board Page...")
  },[]) 
 
  //defining state
  const [load,setload] = useState(true)
  const [title, setTitle] = useState("")
  const [details, setDetails]= useState("")  
  const [pm, setPM]= useState("")  
  const [boardList,setBoardList] = useState([])
  const [addBoard, setAddBoard] = useState(false)


  //getting the details of the board the was clicked
  useEffect(()=>{
    async function fetchData(){
      if(kanbanFactory!=undefined)//this is to check if the metamask is connected or not
      {   
        const boardDetails = await getBoardList()
        console.log(boardDetails)

        if(boardDetails!=undefined) //this is to check if the details of the board selected has been propoerly loaded
        {
          //getting the list of task from subgraph
          console.log("List of Boards ")
          setBoardList(boardDetails)     
        }
      }
      else {
        console.log("Connect to the Provider i.e wallet like Metamask")
      }  
    }
    fetchData()
  },[load, kanbanFactory])

  
  const boardAdded = async (e) =>{
    setload(false) //to disable the processing icon
    e.preventDefault()
    try {
        if(kanbanFactory!=null){
        const tx = await kanbanFactory.createKanban(title, details,pm) //creating the clone of the contract
        await tx.wait()
        setload(true) //to disable the processing icon
        setAddBoard(false)
      }else{
        alert("Not connected to the provider (e.g MetaMask)")
        setload(true)
        setAddBoard(false) //to close the add fund dialgue bo
      } 
    }catch (error) {
        alert(error)
        setload(true)
        setAddBoard(false) //to close the add fund dialgue bo
      }
  }


  return(
    <div className="bg-blue-500 w-screen h-screen">
      <Layout>     
          {/* Adding New BOARD */}
          <div className="p-6">
            <button className="w-full bg-gray-900 cta-btn font-semibold text-white  py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 hover:text-gray-900 flex items-center justify-center"
            onClick= {() => setAddBoard(true)}
            >
              + NEW BOARD
            </button>
            {addBoard?
            (              
              <div className="bg-gray-900 justify-center items-center flex overflow-x-hidden 
                        overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl px-60">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
               
                    {/*header*/}
                      <div className="flex items-start justify-between p-5 rounded-t text-gray-700 text-xl font-bold ">
                          ADD BOARD
                      </div>

                    {/*body*/}
                      <div className="relative p-6 flex-auto">
                        <div className="mb-4">
                          <label className="block text-gray-700 text-xl font-light mb-2">
                            BOARD DETAILS
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
                              placeholder="Select PM"
                              onChange = {(e)=>setPM(e.target.value)}
                          />    
                  
                        </div>
                      </div>
                        
                    {/*footer*/}
                      {load ?(
                        <div className="flex items-center justify-end p-6  rounded-b">
                          <button
                            className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={(e) => boardAdded(e)}
                          >
                            Add
                          </button>

                          <button
                            className="bg-emerald-500 text-black active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded  outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => setAddBoard(false)}
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
        
      {/* Displaying Board*/}
        <div className="flex grid-cols-3 ">
          {         
            boardList.map((boardList) => {
                return(   
                  <div className="bg-white p-2 m-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
                    <div className="text-sm mt-2 px-2">
                      <div>
                        <p>{"Title :   " + boardList.title}</p>
                        <p>{"Details :" + boardList.details}</p>
                        <p>{"PM :   " + boardList.pm}</p>
                        <p>{"FUNDS :   " + boardList.funds/1000000000000000000 + " Eth"}</p>
                        <p>{"CREATER :   " + boardList.creator}</p>
                        
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-1 px-1 rounded "
                          onClick={() => {
                            router.push("/" + boardList.id);
                          }}
                        >
                          SELECT BOARD
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
          }
        </div>                              
      </Layout>
    </div>
  )        
}