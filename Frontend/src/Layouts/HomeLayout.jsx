import { Outlet , useLocation} from "react-router-dom";
import {useEffect} from "react";
import {NavBar} from '../components/NavBar';
import {Footer} from '../components/Footer'
import { SideBar } from "../components/SideBar"

export const HomeLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, [pathname]);
  
  return <div className="w-full h-full">
    <NavBar/>
    <div className='w-full flex gap-1 mt-15'>
      <SideBar/>
      <div className="border-t-5 border-[#d6bfa6] text-[#3a2e28] w-full">
        <div className='ml-18 md:ml-50 p-3 md:p-4'>
      <Outlet/>
      </div>
      </div>
      
    </div>
    <Footer/>
  </div>
 
}
