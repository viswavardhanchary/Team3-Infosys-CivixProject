import { FaBell, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { UserData } from "../axios/contextapi";
import { useContext } from "react";
export const NavBar = () => {
  const data = useContext(UserData);

  return (
    <nav className="w-full bg-[#5a2320] px-2 py-3 flex justify-between flex-col items-center shadow-md">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to='/home/dashboard'className="text-[#c19a6b] text-2xl md:text-4xl font-bold">🏛 Civix</Link>
        </div>

        <div className="flex items-center space-x-4">
          <FaBell className="text-xl text-white cursor-pointer hover:text-[#c19a6b]" />
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#c19a6b] text-[#5a2320] font-bold">
              {data.name.toUpperCase().charAt(0)}
            </div>
            <FaChevronDown className="w-4 h-4 text-white" />
          </div>
          <button
            className="md:hidden text-2xl text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
          </button>
        </div>
      </div>
    </nav>
  );
};
