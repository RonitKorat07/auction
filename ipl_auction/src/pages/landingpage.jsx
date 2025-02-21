import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../config/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';

export const Landingpage = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const teamCollection = collection(db, 'teams');
      const teamSnapshot = await getDocs(teamCollection);
      const teamList = teamSnapshot.docs.map((doc) => doc.data());
      setTeams(teamList);
    };

    fetchTeams();
  }, []);

  return (
    <>
      {/* Full page background */}
      <div className="min-h-screen bg-[#202626] w-full">
        <div className="flex justify-center items-center h-screen w-full relative">
        <motion.img
            src="https://spin.axiomthemes.com/splash/src/img/hero/banner.png"
            alt="Middle image"
            className='h-90 max-w-full object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Horizontal Scroll Section for Teams */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              IPL Teams
            </h1>
          </div>

          {/* Horizontal Scroll Container */}
          <div
            className="flex gap-6 overflow-x-auto scrollbar-hide px-6 snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {teams.length === 0 ? (
              <p className="text-white">Loading teams...</p>
            ) : (
              teams.map((team) => (
                <motion.div
                  key={team.id}
                  className="flex flex-col items-center justify-center rounded-2xl min-w-[280px] sm:min-w-[250px] md:min-w-[220px] h-[300px] shadow-lg p-6 bg-[rgb(0,0,0,0.1)] snap-start border border-gray-700/50"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  {/* Logo Container */}
                  <div className="w-40 h-40 flex items-center justify-center mb-4">
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  {/* Team Name Below Logo */}
                  <h3
                    className="text-lg font-bold text-center text-white px-2 w-full"
                    style={{ color: team.color }}
                  >
                    {team.name}
                  </h3>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Landingpage;
