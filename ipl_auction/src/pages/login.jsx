import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link,useNavigate  } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseconfig';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });

  const [error, setError] = useState(""); // Error state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before validation

    if (!formData.email || !formData.password || !formData.role) {
      setError("❌ Please fill all fields!");
      return;
    }

    const auth = getAuth();
    try {
      // ✅ Authenticate user
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // ✅ Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userRole = userDoc.data().role;
        
        // ✅ Role-based authentication check
        if (userRole !== formData.role) {
          setError("❌ Incorrect role selected!");
          return;
        }

        console.log("✅ Login Successful:", user.email, "Role:", userRole);

        // ✅ Navigate based on role
        if (userRole === "admin") {
          navigate("/admin");
        } else if (userRole === "team") {
          navigate("/team-dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError("❌ User not found in Firestore!");
      }
    } catch (error) {
      // ✅ Handle Firebase Errors
      if (error.code === "auth/user-not-found") {
        setError("❌ No user found with this email!");
      } else if (error.code === "auth/wrong-password") {
        setError("❌ Incorrect password!");
      } else {
        setError(`❌ ${error.message}`);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="w-screen bg-[#202626] flex items-center justify-center md:h-screen lg:h-screen">
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
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent placeholder-white/50"
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
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent placeholder-white/50"
                placeholder="Enter your password"
                required
              />
            </motion.div>

            {/* Role Dropdown */}
            <motion.div 
              className="space-y-2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <label className="text-white block font-semibold">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-[#303A3A] border border-white/20 text-white focus:outline-none focus:border-transparent placeholder-white/50"
              >
                <option value="select" className="bg-[#404A4A] text-white">select</option>
                <option value="admin" className="bg-[#404A4A] text-white">Admin</option>
                <option value="team" className="bg-[#404A4A] text-white">Team</option>
                <option value="user" className="bg-[#404A4A] text-white">User</option>
              </select>
            </motion.div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 px-6 bg-black text-white font-bold rounded-lg shadow-lg hover: transition-all duration-300"
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
                <Link to="/Registration" style={{color : "Highlight"}}>
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
