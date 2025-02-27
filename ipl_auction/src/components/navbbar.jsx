import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseconfig"; // Ensure correct path

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "");
  const [links, setLinks] = useState([]);
  const navigate = useNavigate();

  // Fetch user role from Firestore
  const fetchUserRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        setUserRole(role);
        localStorage.setItem("userRole", role);
      } else {
        console.log("❌ No such user in Firestore!");
        setUserRole("");
        localStorage.removeItem("userRole");
      }
    } catch (error) {
      console.error("❌ Error fetching role:", error);
      setUserRole("");
      localStorage.removeItem("userRole");
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserRole(currentUser.uid);
      } else {
        setUserRole("");
        localStorage.removeItem("userRole");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Update navigation links based on role
    if (userRole === "user") {
      setLinks([
        { key: "Home", value: "/" },
        { key: "Players", value: "/players" },
        { key: "Team", value: "/team" },
        { key: "Auction", value: "/auction" },
      ]);
    } else if (userRole === "admin") {
      setLinks([
        { key: "Home", value: "/admin" },
        { key: "Players", value: "/admin/players" },
        { key: "Team", value: "/admin/team" },
        { key: "Auction", value: "/admin/auction" },
      ]);
    } else if (userRole === "team") {
      setLinks([
        { key: "Home", value: "/teamdashboard" },
        { key: "Players", value: "/players" },
        { key: "Team", value: "/team" },
        { key: "Auction", value: "/auction" },
      ]);
    }else {
      setLinks([
        { key: "Home", value: "/" },
        { key: "Players", value: "/players" },
        { key: "Team", value: "/team" },
        { key: "Auction", value: "/auction" },
      ]);
    }
  }, [userRole]);

  useEffect(() => {
    // Update underline for active link
    const activeLink = document.querySelector(".nav-link.active");
    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [location.pathname]);

  // Logout function
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("✅ User logged out");
      setUserRole("");
      localStorage.removeItem("userRole");
      setUnderlineStyle({ left: 0, width: 0 }); // Reset underline on logout
      navigate("/login");
    } catch (error) {
      console.error("❌ Logout Error:", error.message);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-[#202626] fixed top-0 left-0 right-0 w-full z-50 h-20 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div className="flex items-center" whileTap={{ scale: 0.95 }}>
            <Link to="/">
              <img src="../src/assets/cricklogo.png" alt="Logo" className="h-20 w-auto" />
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 relative">
            {links.map((link) => (
              <Link
                key={link.value}
                to={link.value}
                className={`nav-link text-white hover:text-gray-300 transition-colors duration-300 ${
                  location.pathname === link.value ? "active" : ""
                }`}
              >

                {link.key}
              </Link>
            ))}

            {/* Underline Animation */}
            <motion.div
              className="absolute bottom-[-4px] h-[3px] bg-blue-500"
              initial={{ width: 0 }}
              animate={{
                left: underlineStyle.left,
                width: underlineStyle.width,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </div>

          {/* Auth & Role Display */}
          <div className="hidden md:flex items-center space-x-4">

            {userRole ? (
              <>
                <p className="text-white font-bold">Role: {userRole}</p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg"
                  onClick={handleLogout}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Link
                    to="/login"
                    onClick={() => setUnderlineStyle({ left: 0, width: 0 })}
                    className={`px-4 py-2 ${
                      location.pathname === "/login"
                        ? "bg-blue-500 text-white rounded-lg"
                        : "text-white hover:text-gray-300"
                    }`}
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/Registration"
                    onClick={() => setUnderlineStyle({ left: 0, width: 0 })}
                    className={`px-4 py-2 bg-white text-[#202626] rounded ${
                      location.pathname === "/Registration" ? "border-2 border-blue-500" : ""
                    }`}
                  >
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-white"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </motion.button>
        </div>
      </div>

    </motion.nav>
  );
};

export default Navbar;
