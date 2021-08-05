import { useEffect} from "react";
import Header from "./header";

export default function Layout(props) {
  //To track the rendering flow
  useEffect(()=>{
    console.log("Loading Layout...")
  },[])
   
  return (
    <div>
      <Header /> 
      {props.children}
    </div>
  );
}