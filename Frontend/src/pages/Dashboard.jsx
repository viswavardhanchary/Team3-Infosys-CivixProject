import { useContext, useEffect, useState } from "react";
import {MdEditNote,MdLocationOn} from 'react-icons/md';
import {FaSignature, FaTasks} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import { userInfo } from "../axios/user";


export const Dashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();


  useEffect(()=> {
    getUser();
    
  },[]);


  const getUser = async () => {
    const userData = await userInfo();
    if(!userData.found) {
      navigate('/login');
    }else {
      setData(userData.user);
    }
  }
  
  
  const petitions = useState({
    found: false,
    data: null
  })
  return <>
    <div className="ml-14 md:ml-50 flex align-middle p-1 md:p-3 flex-col flex-1 gap-10">
      <div className="flex flex-col rounded-md  bg-[#c19a6b] p-4">
          <h1 className="text-xl md:text-3xl text-white font-bold">Welcome Back , {data? data.name: "User"}!</h1>
          <p>See what happening in out commuinty and make your voice heard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 aling-center w-full">
        <div className="flex flex-col flex-1 aling-start p-2 bg-[#d3b795] rounded-lg">
          <div className="flex aling-center justify-between">
            <p className="text-xl">My Petitions</p>
            <Link to='/home/petitions' className="text-2xl text-blue-900"><MdEditNote/></Link>
          </div>
          <div className="text-3xl">{data && data.petitions ? data.petitions.length : 0}</div>
          <p className="text-md text-gray-700">petitions</p>
        </div>
        <div className="flex flex-col flex-1 aling-start p-2 bg-[#d3b795] rounded-lg">
          <div className="flex aling-center justify-between">
            <p className="text-xl">Successful Petitions</p>
            <Link to='/home/petitions' className="text-2xl text-blue-900"><FaSignature/></Link>
          </div>
          <div className="text-3xl">0</div>
          <p className="text-md text-gray-700">or under review</p>
        </div>
        <div className="flex flex-col flex-1 aling-start p-2 bg-[#d3b795] rounded-lg">
          <div className="flex aling-center justify-between">
            <p className="text-xl">Polls Created</p>
            <Link to='/home/polls' className="text-xl text-blue-900"><FaTasks/></Link>
          </div>
          <div className="text-3xl">0</div>
          <p className="text-md text-gray-700">polls</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-3">
        <div className="flex justify-between items-top gap-2">
          <p className="text-md md:text-lg lg:text-2xl font-semibold">Active Petitions Neat You</p>
          <div className="flex gap-2 flex-wrap items-center justify-end">
            <div className="m-0 p-0 text-md font-semibold">Showing for:</div>
            <div className="flex bg-blue-800 rounded-sm backdrop-blur-md items-center p-2 text-white cursor-pointer">
              <div className="text-xl"><MdLocationOn/></div>
              <select className="border-none outline-none  bg-blue-800">
                <option>Telangana</option>
                <option>Andra Pardesh</option>
                <option>New Delhi</option>
                <option>kerala</option>
                <option>Tamil Nadu</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center lg:justify-between font-semibold gap-2 flex-wrap">
          <button className="rounded-3xl p-2 bg-[#c19a6b] cursor-pointer hover:bg-[#e2c095]">All Categories</button>
          <button className="rounded-3xl p-2 bg-[#c19a6b] cursor-pointer hover:bg-[#e2c095]">Environment</button>
          <button className="rounded-3xl p-2 bg-[#c19a6b] cursor-pointer hover:bg-[#e2c095]">Infrastructure</button>
          <button className="rounded-3xl p-2 bg-[#c19a6b] cursor-pointer hover:bg-[#e2c095]">Education</button>
          <button className="rounded-3xl p-2 bg-[#c19a6b] cursor-pointer hover:bg-[#e2c095]">Public Safety</button>
          <button className="rounded-3xl p-2 bg-[#c19a6b] cursor-pointer hover:bg-[#e2c095]">Transportation</button>
          <button className="rounded-3xl p-2 bg-[#c19a6b] cursor-pointer hover:bg-[#e2c095]">Health Care</button>
          <button className="rounded-3xl p-2 bg-[#c19a6b] cursor-pointer hover:bg-[#e2c095]">Housing</button>
        </div>
        <div className="flex rounded-md bg-[#dfa866] h-full justify-center items-center p-3">
          {
            !petitions.found && <div className="flex items-center flex-col gap-3">
              <div className="font-semibold text-xl text-center">No Petitons Found with the current filters</div>
              <button className="bg-[#c19a6b] p-2 rounded-md font-semibold">clear filters</button>
            </div>
          }
        </div>
      </div>
    </div>
  </>
}