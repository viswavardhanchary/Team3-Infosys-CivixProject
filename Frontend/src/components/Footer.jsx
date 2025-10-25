import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
export const Footer = () => {
  return <>
  <footer className="ml-14 md:ml-50 bg-[#333333] border-t border-[#1e293b] text-white">
  <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
    <div>
      <h2 className="text-2xl font-bold text-[#0055A4]">Civix</h2>
      <p className="mt-3 text-[#E5E5E5] text-lg">
        Empowering communities by giving citizens a platform to raise
        their voice, create petitions, and drive real change.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-[#0055A4] mb-3">Quick Links</h3>
      <ul className="space-y-2 text-[#E5E5E5] text-lg">
        <li><Link to="/home/dashboard" className="hover:text-[#FF9800] transition-colors">Dashboard</Link></li>
        <li><Link to="/home/petitions" className="hover:text-[#FF9800] transition-colors">Petitions</Link></li>
        <li><Link to="/home/polls" className="hover:text-[#FF9800] transition-colors">Polls</Link></li>
        <li><Link to="/home/reports" className="hover:text-[#FF9800] transition-colors">Reports</Link></li>
      </ul>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-[#0055A4] mb-3">Resources</h3>
      <ul className="space-y-2 text-[#E5E5E5] text-lg">
        <li><Link to="/about" className="hover:text-[#FF9800] transition-colors">About Us</Link></li>
        <li><Link to="/contact" className="hover:text-[#FF9800] transition-colors">Contact</Link></li>
        <li><Link to="/faq" className="hover:text-[#FF9800] transition-colors">FAQ</Link></li>
        <li><Link to="/privacy" className="hover:text-[#FF9800] transition-colors">Privacy Policy</Link></li>
      </ul>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-[#0055A4] mb-3">Follow Us</h3>
      <div className="flex space-x-4 text-xl text-[#E5E5E5]">
        <a href="#" className="hover:text-[#FF9800] transition-colors"><FaFacebook /></a>
        <a href="#" className="hover:text-[#FF9800] transition-colors"><FaTwitter /></a>
        <a href="#" className="hover:text-[#FF9800] transition-colors"><FaInstagram /></a>
        <a href="#" className="hover:text-[#FF9800] transition-colors"><FaLinkedin /></a>
      </div>
    </div>
  </div>

  <div className="border-t border-[#1e293b] py-4 text-center text-[#E5E5E5] text-lg">
    © {new Date().getFullYear()} Civix. All rights reserved.
  </div>
</footer>




  </>
}