// Footer.tsx
import React, { useState } from 'react';
import { FaHandshake } from "react-icons/fa6";


const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  const sponsors = [
    { name: 'Tata Motors', logo: 'https://seeklogo.com/images/T/TATA-logo-B17191F4CA-seeklogo.com.png' },
    { name: 'Adidas', logo: 'https://images.seeklogo.com/logo-png/30/1/jio-logo-png_seeklogo-305444.png' },
    { name: 'CEAT Tyres', logo: 'https://images.seeklogo.com/logo-png/2/1/ceat-tyres-logo-png_seeklogo-27738.png' },
    { name: 'Dream11', logo: 'https://seeklogo.com/images/D/dream11-logo-A5D7BB9B54-seeklogo.com.png' },
  ];

  return (
    <div>
      {/* Main Footer */}
      <footer className="bg-[#1a1e1e] text-white z-50">

       <div className="max-w-7xl mx-auto px-4 py-4">

                 {/* Sponsors Section */}
                 <div className="max-w-7xl mx-auto mt-20 mb-16 bg-[#202626] rounded-2xl p-8 border border-gray-700/50">
                  <h2 className="text-3xl font-bold text-gray-100 mb-12 flex items-center justify-center">
                  <FaHandshake  className="fas fa-handshake text-blue-400 mr-3"/>
                    Our Trusted Sponsors
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                    {sponsors.map((sponsor, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-6 flex items-center justify-center border border-gray-200 shadow-md hover:scale-105 hover:opacity-80 transform transition-all duration-300"
                      >
                        <img
                          src={sponsor.logo}
                          alt={`${sponsor.name} logo`}
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>

          {/* Top Section with Logo and Newsletter */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-12">
            <div className="mb-8 md:mb-0">
              <img
                src="../src/assets/cricklogo.png"
                alt="IPL Logo"
                className="h-12 object-contain mb-4"
              />
              <p className="text-gray-300 max-w-md">
                Experience the thrill of cricket's biggest festival. The Indian Premier League - where talent meets opportunity.
              </p>
            </div>
            <div className="w-full md:w-96">
              <h3 className="text-xl font-semibold mb-4">Subscribe to Our Newsletter</h3>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">                
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg text-gray-300 bg-[#2a3131] border-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Email address"
                  required
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#37474f] hover:bg-[#455a64] text-white px-6 py-2 font-semibold transition-all w-full sm:w-auto"
                >
                  Subscribe
                </button>
              </form>
              {isSubscribed && (
                <p className="text-green-400 mt-2">Thank you for subscribing!</p>
              )}
            </div>
          </div>
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Column 1 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">About & Info</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">IPL Overview</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">History</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Career Opportunities</a></li>
              </ul>
            </div>
            {/* Column 2 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Teams & Players</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">All Teams</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Players</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Statistics</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Rankings</a></li>
              </ul>
            </div>
            {/* Column 3 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Match Schedule</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Ticket Booking</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">News & Updates</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Photo Gallery</a></li>
              </ul>
            </div>
            {/* Column 4 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Fan Zone</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Fan Club</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Mobile App</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Fantasy League</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Shop</a></li>
              </ul>
            </div>
          </div>
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-gray-300 hover:text-white text-2xl">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-2xl">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-2xl">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-2xl">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
          {/* Bottom Bar */}
          <div className="border-t border-[#2a3131] pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Indian Premier League. All rights reserved.
              </p>
              <div className="flex space-x-4 text-sm">
                <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Additional Footers (Optional) */}
      {/* Your other footers can be added here... */}
    </div>
  );
};

export default Footer;
