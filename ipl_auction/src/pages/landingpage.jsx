import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeam } from '../store/teamslice';
import { fetchPlayers } from '../store/playerslice';
import { FaArrowRight } from 'react-icons/fa'; // ✅ Importing React Icon
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate


export const Landingpage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const { teams, loading, error } = useSelector((state) => state.team);
  const { players, loading: playersLoading, error: playersError } = useSelector((state) => state.player);
  
  const [topBatsmen, setTopBatsmen] = useState([]);
  const [topBowlers, setTopBowlers] = useState([]);
  const [topAllRounders, setTopAllRounders] = useState([]);

  useEffect(() => {
    dispatch(fetchTeam());
    dispatch(fetchPlayers());
  }, [dispatch]);
 
  useEffect(() => {
    console.log("Fetched Players:", players); // Debugging
  
    if (players.length > 0) {
      // Filter and sort top batsmen
      const sortedBatsmen = players
        .filter(player => 
          (player.player_role === "Batsman" || player.player_role === "Wicket-keeper batsman") && 
          player.state?.ipl?.batting?.runs !== undefined // Ensure batting stats exist
        )
        .sort((a, b) => b.state.ipl.batting.runs - a.state.ipl.batting.runs);
  
      setTopBatsmen(sortedBatsmen.slice(0, 3)); 

      // Filter and sort top bowlers
      const sortedBowlers = players
        .filter(player => 
          player.player_role === "Bowler" && 
          player.state?.ipl?.bowling?.wicket !== undefined // Ensure bowling stats exist
        )
        .sort((a, b) => b.state.ipl.bowling.wicket - a.state.ipl.bowling.wicket);
  
      setTopBowlers(sortedBowlers.slice(0, 3)); 

      // Filter and sort top all-rounders
      const sortedAllRounders = players
        .filter(player => 
          player.player_role === "All-rounder" && 
          player.state?.ipl?.batting?.runs !== undefined && 
          player.state?.ipl?.bowling?.wicket !== undefined // Ensure both batting and bowling stats exist
        )
        .sort((a, b) => (b.state.ipl.batting.runs + b.state.ipl.bowling.wicket) - (a.state.ipl.batting.runs + a.state.ipl.bowling.wicket));
  
      setTopAllRounders(sortedAllRounders.slice(0, 3)); 
    }
  }, [players]);


  const handleNavigate = (path) => {
    window.scrollTo(0, 0); 
    navigate(path);
  };
  
  return (
    <>
      <div className="min-h-screen bg-[#202626] w-full overflow-hidden">
        {/* Hero Section */}
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

        {/* IPL Teams Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            IPL Teams
          </h1>
          <button 
            onClick={() => handleNavigate('/team')}
            className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            See More <FaArrowRight />
          </button>
        </div>
          <div className="flex gap-6 overflow-x-auto scrollbar-hide  snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {loading ? (
              <p className="text-white">Loading teams...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              teams.map((team) => (
                <motion.div
                  key={team.id}
                  className="flex flex-col items-center justify-center rounded-2xl w-[280px] h-[320px] bg-gray-800 p-6 snap-start"

                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <div className="w-45 h-45 flex items-center justify-center mb-4">
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-center text-white px-2 w-full" style={{ color: team.color }}>
                    {team.name}
                  </h3>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Top 3 Batsmen Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-bold text-blue-400">Top 3 Batsman</h1>
            <button 
              onClick={() => handleNavigate("/players")}
              className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
              <FaArrowRight />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {playersLoading ? (
              <p className="text-white">Loading players...</p>
            ) : playersError ? (
              <p className="text-red-500">{playersError}</p>
            ) : topBatsmen.length === 0 ? (
              <p className="text-white">No batsmen found.</p>
            ) : (
              topBatsmen.map(player => (
                <motion.div
                  key={player.id}
                  className="flex flex-col items-center justify-center rounded-2xl bg-gray-800 p-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <img src={player.image} alt={player.name} className="w-32 h-32 rounded-full border-4 border-blue-400 mb-4" />
                  <h2 className="text-lg font-bold text-white">{player.name}</h2>
                  <p className="text-sm text-gray-300">{player.country}</p>
                  <p className="text-sm text-gray-300">{player.player_role} | {player.batting_style}</p>
                  <p className="text-sm text-blue-300 font-bold mt-2">
                    Matches: {player.state.ipl.batting.match} | Runs: {player.state.ipl.batting.runs} | Avg: {player.state.ipl.batting.average}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Top 3 Bowlers Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-bold text-blue-400">Top 3 Bowler</h1>
            <button 
              onClick={() => handleNavigate("/players")}
              className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
              <FaArrowRight />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {playersLoading ? (
              <p className="text-white">Loading players...</p>
            ) : playersError ? (
              <p className="text-red-500">{playersError}</p>
            ) : topBowlers.length === 0 ? (
              <p className="text-white">No bowlers found.</p>
            ) : (
              topBowlers.map(player => (
                <motion.div
                  key={player.id}
                  className="flex flex-col items-center justify-center rounded-2xl bg-gray-800 p-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <img src={player.image} alt={player.name} className="w-32 h-32 rounded-full border-4 border-blue-400 mb-4" />
                  <h2 className="text-lg font-bold text-white">{player.name}</h2>
                  <p className="text-sm text-gray-300">{player.country}</p>
                  <p className="text-sm text-gray-300">{player.player_role} | {player.bowling_style}</p>
                  <p className="text-sm text-blue-300 font-bold mt-2">
                    Matches: {player.state.ipl.bowling.match} | Wickets: {player.state.ipl.bowling.wicket} | Eco: {player.state.ipl.bowling.eco}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Top 3 All-Rounders Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-bold text-blue-400">Top 3 All-rounder</h1>
            <button 
              onClick={() => handleNavigate("/players")}
              className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
              <FaArrowRight />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {playersLoading ? (
              <p className="text-white">Loading players...</p>
            ) : playersError ? (
              <p className="text-red-500">{playersError}</p>
            ) : topAllRounders.length === 0 ? (
              <p className="text-white">No all-rounders found.</p>
            ) : (
              topAllRounders.map(player => (
                <motion.div
                  key={player.id}
                  className="flex flex-col items-center justify-center rounded-2xl bg-gray-800 p-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <img src={player.image} alt={player.name} className="w-32 h-32 rounded-full border-4 border-blue-400 mb-4" />
                  <h2 className="text-lg font-bold text-white">{player.name}</h2>
                  <p className="text-sm text-gray-300">{player.country}</p>
                  {/* <p className="text-sm text-gray-300">{player.player_role}</p> */}
                  <p className="text-sm text-gray-300">Batting  | {player.batting_style}</p>
                  <p className="text-sm text-gray-300">Bowling  | {player.bowling_style}</p>
                  <p className="text-sm text-blue-300 font-bold mt-2">
                    Matches: {player.state.ipl.batting.match} | Runs: {player.state.ipl.batting.runs} | Wickets: {player.state.ipl.bowling.wicket}
                  </p>
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