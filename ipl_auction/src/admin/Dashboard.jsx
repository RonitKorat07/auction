import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fetchTeam } from "../store/teamslice";
import { fetchPlayers } from "../store/playerslice";
import { FaArrowRight } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTeam());
    dispatch(fetchPlayers());
  }, [dispatch]);

  const [topBatsmen, setTopBatsmen] = useState([]);
  const { teams, loading, error } = useSelector((state) => state.team);
  const {
    players,
    loading: playersLoading,
    error: playersError,
  } = useSelector((state) => state.player);

  useEffect(() => {
    if (players.length > 0) {
      const sortedBatsmen = players
        .filter(
          (player) =>
            (player.player_role === "Batsman" ||
              player.player_role === "Wicket-keeper batsman") &&
            player.state?.ipl?.batting?.runs !== undefined
        )
        .sort((a, b) => b.state.ipl.batting.runs - a.state.ipl.batting.runs);

      setTopBatsmen(sortedBatsmen.slice(0, 3));
    }
  }, [players]);

  useEffect(() => {
    // Scroll animations for player cards
    gsap.utils.toArray(".player-card").forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 100,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            end: "bottom center",
            toggleActions: "play none none reverse",
            markers: false,
            scrub: 1,
          },
        }
      );
    });

    // Team cards scroll animation
    gsap.utils.toArray(".team-card").forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 100,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            end: "bottom center",
            toggleActions: "play none none reverse",
            markers: false,
            scrub: 1,
          },
        }
      );
    });
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#0047AB]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626]">
        <div className="text-[#FF4500] text-xl">Error: {error}</div>
      </div>
    );
  }
  return (
    <>
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-[#202626] ">
        <div className="flex flex-col items-center justify-between w-full max-w-7xl px-6 py-30 ">
          {/* Content Layout */}
          <div className="flex flex-col lg:flex-row w-full items-center justify-between">
            {/* Image - Shows on top for mobile, right side for desktop */}
            <motion.div
              className="w-full lg:w-1/2 flex justify-center items-center mb-8 lg:mb-0 order-1 lg:order-2"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            >
              <img
                src="https://spin.axiomthemes.com/splash/src/img/hero/banner.png"
                alt="Admin Dashboard"
                className="w-[250px] lg:w-full h-auto object-contain transform hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            {/* Content - Shows below image for mobile, left side for desktop */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
              className="w-full lg:w-1/2 text-white max-w-lg order-2 lg:order-1"
            >
              <motion.h2
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
                className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 lg:mb-10 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent text-center lg:text-left"
              >
                Welcome Back, Admin!
              </motion.h2>

              <motion.p
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 1.5 }}
                className="text-base md:text-lg lg:text-xl text-gray-300 mb-5 text-center lg:text-left"
              >
                Take command of your platform with{" "}
                <span className="font-semibold text-blue-300">precision</span>{" "}
                and{" "}
                <span className="font-semibold text-blue-200">efficiency</span>.
                Dive into real-time analytics, manage users effortlessly, and
                unlock the full potential of your system.
              </motion.p>

              <div className="flex justify-center lg:justify-start">
                <Link to="/auction">
                  <motion.button
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 2 }}
                    className="mt-4 lg:mt-6 px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all rounded-xl text-white text-base lg:text-lg font-bold shadow-2xl hover:shadow-blue-500/50"
                  >
                    Auction List
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* player list */}
      <div className="min-h-screen bg-[#202626] text-white p-4 md:p-6">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-8 sm:mb-12"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 text-center sm:text-left">
              Players List
            </h1>
            <Link
              to={"/admin/players"}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-500 text-white px-4 sm:px-5 py-2 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition"
            >
              View All <FaArrowRight className="ml-1 sm:ml-2" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {playersLoading ? (
              <p className="text-white">Loading players...</p>
            ) : playersError ? (
              <p className="text-red-500">{playersError}</p>
            ) : topBatsmen.length === 0 ? (
              <p className="text-white">No batsmen found.</p>
            ) : (
              topBatsmen.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="player-card flex flex-col items-center justify-center rounded-2xl bg-gray-800 p-6 border border-[#0047AB]"
                >
                  <img
                    src={player.image}
                    alt={player.name}
                    className="w-32 h-32 rounded-full border-4 border-blue-400 mb-4"
                  />
                  <h2 className="text-lg font-bold text-white">
                    {player.name}
                  </h2>
                  <p className="text-sm text-gray-300">{player.country}</p>
                  <p className="text-sm text-gray-300">
                    {player.player_role} | {player.batting_style}
                  </p>
                  <p className="text-sm text-blue-300 font-bold mt-2">
                    Matches: {player.state.ipl.batting.match} | Runs:{" "}
                    {player.state.ipl.batting.runs} | Avg:{" "}
                    {player.state.ipl.batting.average}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
        {/* team list */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-8 sm:mb-12"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 text-center sm:text-left">
              Team List
            </h1>
            <Link
              to={"/admin/teampage"}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-500 text-white px-4 sm:px-5 py-2 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition"
            >
              See more <FaArrowRight className="ml-1 sm:ml-2" />
            </Link>
          </motion.div>
          <div
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading ? (
              <p className="text-white">Loading teams...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  className="team-card flex flex-col items-center justify-center rounded-2xl w-[280px] h-[320px] bg-gray-800 p-6 snap-start mt-30 border border-[#0047AB] hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 "
                  initial={{ opacity: 0, y: 0 }}
                  whileInView={{ opacity: 1, y: -100 }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
                >
                  <div className="w-45 h-45 flex items-center justify-center mb-4">
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h3
                    className="text-lg font-bold text-center text-white px-2 w-full "
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

export default Dashboard;
