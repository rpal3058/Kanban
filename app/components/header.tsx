import {useRouter } from "next/router";
import web3 from "../containers/web3"
import { createContext, useEffect,useState } from 'react';

//DONT include async function to export since it might create problem in the child componenets
export default  function Header() {
  //To track the rendering flow
  useEffect(()=>{
    console.log("Loading Header...")
  },[])
  
  const [addressReceived,setAddressReceived] = useState(null)
  const router = useRouter()
  const {getWeb3,address} = web3.useContainer()
  
  //connecting to the provider/waller (eg metamask)
  const onConnect = () => {
    getWeb3();
    setAddressReceived(address)
  };  
  
  //routes it to the home page  
  const onHome = () => {
    router.push("/");
  };

  return (
      <div className="flex bg-gray-200 w-full px-8 py-3 justify-between items-center">
        <button className="font-bold" onClick={() => onHome()}>
          KANBAN
        </button>
        {address ? (
          <div className="flex">
            <div
              className="bg-grey-100 px-4 py-2 text-black font-bold"
              onClick={() => onConnect()}
            >
              {address.slice(0, 5) + "..." + address.slice(address.length - 5)}
              
            </div>
          </div>
        ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => onConnect()}
        >
          Connect
        </button>
        )}
      </div>
  );
}
