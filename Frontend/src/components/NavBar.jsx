import { FaBell, FaChevronDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { userInfo } from "../axios/user";
import { useState, useEffect } from "react";

export const NavBar = () => {
  const [data, setData] = useState(null);
  const [dropDown, setDropDown] = useState(null);
  const navigate = useNavigate();
  const getUser = async () => {
    const userData = await userInfo();
    if (!userData.found) {
      navigate('/login');
    } else {
      setData(userData.user);
    }
  }


  useEffect(() => {
    getUser();
  }, []);



  return (
    <nav className="fixed w-full bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white px-4 py-3 flex justify-between items-center shadow-md h-16 z-50">
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        <Link to="/home/dashboard" className="text-[#2563eb] text-2xl md:text-4xl font-bold flex items-center gap-2">
          🏛 Civix
        </Link>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          <FaBell className="text-xl text-white cursor-pointer hover:text-[#2563eb] transition-colors" />

          {/* User Dropdown */}
          <div className="relative">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setDropDown((prev) => !prev)}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2563eb] text-white font-bold">
                {data ? data.name.toUpperCase().charAt(0) : "U"}
              </div>
              <FaChevronDown className="w-4 h-4 text-white" />
            </div>

            {/* Dropdown Menu */}
            {dropDown && (
              <div className="absolute top-12 right-0 bg-[#1e293b] text-white rounded-md shadow-lg flex flex-col min-w-[150px] z-50">
                <button className="px-4 py-2 text-left hover:bg-[#2563eb] transition-colors">
                  Profile
                </button>
                <button
                  className="px-4 py-2 text-left hover:bg-[#2563eb] transition-colors"
                  onClick={() => { localStorage.clear(); navigate('/login'); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>

  );
};
