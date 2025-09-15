import { Outlet } from "react-router-dom";
import {NavBar} from '../components/NavBar';
import {Footer} from '../components/Footer'

export const DashboardLayout = () => {
  return <div className="w-full h-screen">
    <NavBar/>
    <Outlet/>
    <Footer/>
  </div>
}