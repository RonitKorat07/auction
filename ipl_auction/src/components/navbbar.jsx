import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-[#202626]  fixed top-0 left-0 right-0 w-full z-50 h-20"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <motion.div
            className="flex items-center"
            whileHover={{ rotate: 5, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to="/">
              <img 
                src="../src/assets/cricklogo.png"
                alt="IPL Logo"
                className="h-20 w-auto"
              />
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {['/', '/players', '/teams', '/auction'].map((path, index) => (
              <motion.div
                key={path}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.1,
                  textShadow: "0 0 8px rgb(255,255,255)"
                }}
              >
                <Link 
                  to={path}
                  style={{color: "white"}}
                  className="text-white hover:text-gray-300"
                >
                  {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div
              whileHover={{ 
                scale: 1.1,
                textShadow: "0 0 8px rgb(255,255,255)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link
                to="/login"
                style={{color: "white"}} 
                className="text-white hover:text-gray-300"
              >
                Login
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "#f0f0f0",
                boxShadow: "0 0 15px rgba(255,255,255,0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Link
                to="/Registration"
                className="px-4 py-2 bg-white text-[#202626] rounded"
              >
                Register
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden text-white"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>

          

        </div>
      </div>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden bg-[#202626] w-full absolute top-20 left-0 right-0 shadow-lg border-t border-white/20"
        >
          <div className="flex flex-col items-center space-y-4 py-4">
            {['/', '/players', '/teams', '/auction', '/login', '/Registration'].map((path) => (
              <Link 
                key={path} 
                to={path} 
                style={{color:"white"}}
                className="text-white text-lg hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
