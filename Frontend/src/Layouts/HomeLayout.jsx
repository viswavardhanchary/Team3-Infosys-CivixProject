import { Outlet } from "react-router-dom";
import {NavBar} from '../components/NavBar';
import {Footer} from '../components/Footer'
import { SideBar } from "../components/SideBar"
import { UserDataProvider } from "../axios/contextapi";

export const HomeLayout = () => {
  
  return <UserDataProvider>
     <div className="w-full h-full">
    <NavBar/>
    <div className='w-full flex gap-1'>
      <SideBar/>
      <Outlet/>
    </div>
    <Footer/>
  </div>
  </UserDataProvider>
  
 
}