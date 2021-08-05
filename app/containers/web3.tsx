//Creating a usable web3 file
import {useState, useEffect} from "react"
import WalletConnectProvider from "@walletconnect/web3-provider"; // WalletConnectProvider (Web3Modal)
import {ethers} from "ethers"; // Ethers
import Web3Modal, { Provider } from "web3modal";
import { createContext } from "react";
import { KanbanFactory__factory, Kanban__factory} from "../typechain";
import { createContainer } from "unstated-next"; // Unstated-next containerization

// Web3Modal provider options
const providerOptions = {
    // Set Provider Options 
        walletconnect: {
        package: WalletConnectProvider,
        options: {
          // Inject Infura
          infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
        },
    },
};

function useWeb3 (){
    const [web3, setWeb3] = useState(null);
    const [signer, setSigner] = useState(null);
    const [address, setAddress] = useState(null);
    const [kanbanFactory,setkanbanFactory] = useState(null)
    const [kanban,setKanban] = useState(null)

  
    async function getWeb3(){
        const web3Modal = new Web3Modal({
            network: "rinkeby",
            cacheProvider: true,
            providerOptions: providerOptions,
        });        
        const web3Provider  =  await web3Modal.connect();
        
        // Wraps the web3 injected by metamask or other provider and spits out the ether.js API for us
        const getWeb3 = new ethers.providers.Web3Provider(web3Provider); 
        
        setWeb3(getWeb3)
        console.log("Connected to the the Provider...")
    }
    
    useEffect(() => {
        async function fetchData () {
            if(web3!=null){    
                console.log("Web3 Provided : " + web3);      
            
                // Signer details received
                    const signer = await web3.getSigner();
                    setSigner(signer)
            
                // Address of the Signer received
                    const address = await signer.getAddress();
                    setAddress(address)
                    console.log("Current address provided by the Provider :  " + address)          
            
                //accessing Factory instance
                    const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS
                    const kanbanFactory = KanbanFactory__factory.connect(factoryAddress, signer)
                    console.log("Contract Factory accessed : " + kanbanFactory)
                    setkanbanFactory(kanbanFactory)
                
                //accessing Kanban instance
                     const kanbanAddress = process.env.NEXT_PUBLIC_KANBAN_ADDRESS
                     const kanban = Kanban__factory.connect(kanbanAddress, signer)
                     console.log("Kanban accessed : " + kanban)
                     setKanban(kanban)                        
            }             
        }
        fetchData()
    },[web3])     
    return  {getWeb3, web3, signer, address, kanbanFactory, kanban}
}
//create container 
const web3 = createContainer(useWeb3)
export default web3
