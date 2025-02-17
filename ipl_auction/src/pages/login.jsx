import { useState } from 'react';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className=" w-screen bg-[#202626] flex items-center justify-center md:h-screen lg:h-screen">
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full p-6 md:p-8 flex flex-col md:flex-row items-center justify-between"
      >
        {/* IPL image */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full md:w-1/2 flex items-center justify-center mb-8 md:mb-0 pt-15"
        >
          <img
            src="../src/assets/lglogo.png"
            alt="IPL Logo"
            className="w-[300px] md:w-[400px] lg:w-[800px] h-auto"
          />
        </motion.div>

        {/* Login form */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <motion.h2 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-3xl md:text-4xl font-bold text-center mb-8 text-white tracking-wider"
          >
             Auction Watch
          </motion.h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm px-4 md:px-0">
            <motion.div 
              className="space-y-2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="text-white block font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transform transition-all duration-300 placeholder-white/50"
                placeholder="Enter your email"
                required
              />
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="text-white block font-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transform transition-all duration-300 placeholder-white/50"
                placeholder="Enter your password"
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 px-6 bg-white text-white font-bold rounded-lg shadow-lg hover:bg-white/90 transition-all duration-300"
            >
              Login
            </motion.button>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-white/80 text-center mt-6">
                Don't have an account? {' '}
                <Link
                to="/Registration"
                className="text-blue"
              >
                Register
              </Link>
              </p>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
