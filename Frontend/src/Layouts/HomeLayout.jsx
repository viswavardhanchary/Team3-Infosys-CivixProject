import { Outlet } from "react-router-dom";
import {NavBar} from '../components/NavBar';
import {Footer} from '../components/Footer'
import { SideBar } from "../components/SideBar"

export const HomeLayout = () => {
  
  return <div className="w-full h-full">
    <NavBar/>
    <div className='w-full flex gap-1 mt-15'>
      <SideBar/>
      <Outlet/>
    </div>
    <Footer/>
  </div>
 
}