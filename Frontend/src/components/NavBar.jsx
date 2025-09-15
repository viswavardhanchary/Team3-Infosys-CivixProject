import { FaBell, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

export const NavBar = () => {

  return (
    <nav className="w-full bg-[#5a2320] px-6 py-3 flex justify-between flex-col items-center shadow-md">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-[#c19a6b] text-xl font-bold">🏛 Civix</span>
        </div>

        <div className="flex items-center space-x-4">
          <FaBell className="text-xl text-white cursor-pointer hover:text-[#c19a6b]" />
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#c19a6b] text-[#5a2320] font-bold">
              S
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
