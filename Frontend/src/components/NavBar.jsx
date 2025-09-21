import { FaBell, FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { userInfo } from "../axios/user";
import { useState,useEffect } from "react";

export const NavBar = () => {
  const [data, setData] = useState(null);
  const [dropDown , setDropDown] = useState(null);
  const navigate = useNavigate();
  const getUser = async () => {
      const userData = await userInfo();
      if(!userData.found) {
        navigate('/login');
      }else {
        setData(userData.user);
      }
    }


  useEffect(()=> {
    getUser();
  },[]);



  return (
    <nav className="fixed w-full bg-[#5a2320] px-2 py-3 flex justify-between flex-col items-center shadow-md h-15 z-10000">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to='/home/dashboard'className="text-[#c19a6b] text-2xl md:text-4xl font-bold">🏛 Civix</Link>
        </div>

        <div className="flex items-center space-x-4">
          <FaBell className="text-xl text-white cursor-pointer hover:text-[#c19a6b]" />
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#c19a6b] text-[#5a2320] font-bold">
              {data?data.name.toUpperCase().charAt(0):"U"}
            </div>
            <div onClick={() => setDropDown((prev) => !prev)}>
              <FaChevronDown className="w-4 h-4 text-white" />
            </div>
          </div>
          {/* <button
            className="md:hidden text-2xl text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
          </button> */}

          
          
        </div>
        {
            dropDown && <div className="flex text-lg flex-col gap-2 text-[#ffffff] rounded-md absolute top-16 right-3 bg-[#5a2320]">
            <button className="border-b-gray-600 hover:bg-[#c19a6b] hover:text-white cursor-pointer p-2 px-4">Profile</button>
            <button className="hover:bg-[#c19a6b] hover:text-white cursor-pointer p-2" onClick={() => {localStorage.clear();navigate('/login')}}>Logout</button>
          </div>

          }
      </div>
    </nav>
  );
};
