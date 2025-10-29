import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="ml-14 md:ml-50 bg-[#e6b380] border-t border-[#d9985b] text-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">

        <div>
          <h2 className="text-2xl font-bold text-[#b36f40]">Civix</h2>
          <p className="mt-3 text-gray-800 text-lg">
            Empowering communities by giving citizens a platform to raise
            their voice, create petitions, and drive real change.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-[#b36f40] mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-900 text-lg">
            <li><Link to="/home/dashboard" className="hover:text-[#d9985b] transition-colors">Dashboard</Link></li>
            <li><Link to="/home/petitions" className="hover:text-[#d9985b] transition-colors">Petitions</Link></li>
            <li><Link to="/home/polls" className="hover:text-[#d9985b] transition-colors">Polls</Link></li>
            <li><Link to="/home/reports" className="hover:text-[#d9985b] transition-colors">Reports</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-[#b36f40] mb-3">Resources</h3>
          <ul className="space-y-2 text-gray-900 text-lg">
            <li><Link to="/about" className="hover:text-[#d9985b] transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[#d9985b] transition-colors">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-[#d9985b] transition-colors">FAQ</Link></li>
            <li><Link to="/privacy" className="hover:text-[#d9985b] transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-[#b36f40] mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-xl text-gray-900">
            <a href="#" className="hover:text-[#d9985b] transition-colors"><FaFacebook /></a>
            <a href="#" className="hover:text-[#d9985b] transition-colors"><FaTwitter /></a>
            <a href="#" className="hover:text-[#d9985b] transition-colors"><FaInstagram /></a>
            <a href="#" className="hover:text-[#d9985b] transition-colors"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#d9985b] py-4 text-center text-gray-900 text-lg">
        © {new Date().getFullYear()} Civix. All rights reserved.
      </div>
    </footer>
  );
};
