import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
export const Footer = () => {
  return <>
    <footer className="ml-14 md:ml-50 bg-[#c19a6b] border-t border-[#b28b61] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div>
          <h2 className="text-2xl font-bold text-[#5a3d2b]">Civix</h2>
          <p className="mt-3 text-lg">
            Empowering communities by giving citizens a platform to raise 
            their voice, create petitions, and drive real change.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-[#5a3d2b] mb-3">Quick Links</h3>
          <ul className="space-y-2 text-lg">
            <li><Link to="/home/dashboard" className="hover:text-[#000000]">Dashboard</Link></li>
            <li><Link to="/home/petitions" className="hover:text-[#5a3d2b]">Petitions</Link></li>
            <li><Link to="/home/polls" className="hover:text-[#5a3d2b]">Polls</Link></li>
            <li><Link to="/home/reports" className="hover:text-[#5a3d2b]">Reports</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-[#5a3d2b] mb-3">Resources</h3>
          <ul className="space-y-2 text-lg">
            <li><Link to="/about" className="hover:text-[#5a3d2b]">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[#5a3d2b]">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-[#5a3d2b]">FAQ</Link></li>
            <li><Link to="/privacy" className="hover:text-[#5a3d2b]">Privacy Policy</Link></li>
          </ul>
        </div>


        <div>
          <h3 className="text-xl font-semibold text-[#5a3d2b] mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a to="#" className="hover:text-[#5a3d2b]"><FaFacebook /></a>
            <a to="#" className="hover:text-[#5a3d2b]"><FaTwitter /></a>
            <a to="#" className="hover:text-[#5a3d2b]"><FaInstagram /></a>
            <a to="#" className="hover:text-[#5a3d2b]"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#b28b61] mt-6 py-4 text-center text-lg text-gray-700">
        © {new Date().getFullYear()} Civix. All rights reserved.
      </div>
    </footer>
  </>
}