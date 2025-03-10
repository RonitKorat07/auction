import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeam } from "../store/teamslice";
import { fetchPlayers } from "../store/playerslice";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import adm_bg from "../assets/adm_bg.png"; // Replace with the correct path

export const Homepage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bgRef = useRef(null);
  const adminTagRef = useRef(null);

  const { teams, loading, error } = useSelector((state) => state.team);
  const {
    players,
    loading: playersLoading,
    error: playersError,
  } = useSelector((state) => state.player);

  const [topBatsmen, setTopBatsmen] = useState([]);
  const [topBowlers, setTopBowlers] = useState([]);
  const [topAllRounders, setTopAllRounders] = useState([]);

  useEffect(() => {
    dispatch(fetchTeam());
    dispatch(fetchPlayers());
  }, [dispatch]);

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

      const sortedBowlers = players
        .filter(
          (player) =>
            player.player_role === "Bowler" &&
            player.state?.ipl?.bowling?.wicket !== undefined
        )
        .sort(
          (a, b) => b.state.ipl.bowling.wicket - a.state.ipl.bowling.wicket
        );
      setTopBowlers(sortedBowlers.slice(0, 3));

      const sortedAllRounders = players
        .filter(
          (player) =>
            player.player_role === "All-rounder" &&
            player.state?.ipl?.batting?.runs !== undefined &&
            player.state?.ipl?.bowling?.wicket !== undefined
        )
        .sort(
          (a, b) =>
            b.state.ipl.batting.runs +
            b.state.ipl.bowling.wicket -
            (a.state.ipl.batting.runs + a.state.ipl.bowling.wicket)
        );
      setTopAllRounders(sortedAllRounders.slice(0, 3));
    }
  }, [players]);

  const handleNavigate = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      bgRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1 }
    )
      .fromTo(
        adminTagRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
      .fromTo(
        ".title-heading",
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      )
      .fromTo(
        ".description",
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      )
      .fromTo(
        ".start-auction-btn",
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );

    gsap.utils.toArray(".player-card").forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 100 },
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
            scrub: 1,
          },
        }
      );
    });

    gsap.utils.toArray(".team-card").forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 100 },
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
            scrub: 1,
          },
        }
      );
    });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="flex min-h-screen w-full flex-col lg:flex-row items-center justify-center gap-6 bg-[url('https://i.pinimg.com/736x/7d/57/bb/7d57bb24b1d299219c693bdf8600946d.jpg')] bg-no-repeat bg-cover bg-center text-white">
        <div className="flex h-auto w-full flex-col lg:flex-row items-center justify-center bg-[rgba(0,0,0,0.3)] gap-6 px-4 py-8 text-white">
          <div
            ref={bgRef}
            className="relative w-full h-[550px] sm:w-[80%] md:w-[70%] lg:w-1/2 sm:h-[550px] md:h-[630px] lg:h-[650px] xl:h-[700px] flex items-center justify-center pt-10"
          >
            <motion.img
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              src={adm_bg}
              alt="Admin Background"
              className="w-[95%] h-full object-cover opacity-90"
            />
          </div>

          <div className="w-full text-center lg:w-1/2 px-4">
            <motion.p
              ref={adminTagRef}
              className="text-2xl font-bold text-white text-opacity-80 uppercase tracking-wide pb-10"
            >
              🏏 Cricket Management Hub
            </motion.p>

            <motion.h1 className="title-heading text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-400 drop-shadow-lg">
              Take Control of the Game!
            </motion.h1>

            <motion.p className="description mt-6 text-xl text-gray-300 leading-relaxed">
              Manage teams, track stats, and achieve cricket greatness.
            </motion.p>

            <motion.div className="mt-10 flex justify-center">
              <Link
                to={"/auction"}
                className="start-auction-btn group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl text-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden hover:cursor-pointer"
              >
                <span className="relative z-10 flex items-center">
                  Start Auction <FaArrowRight className="ml-2" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Player List */}
      <div className="min-h-screen bg-[#202626] text-white p-4 md:p-6">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-8 sm:mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              IPL Teams
            </h1>
            <button
              onClick={() => handleNavigate("/teampage")}
              className="flex items-center gap-2 bg-[#0047AB] text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition hover:cursor-pointer"
            >
              See More <FaArrowRight />
            </button>
          </motion.div>
          <div
            className="flex gap-6 overflow-x-auto scrollbar-hide  snap-x snap-mandatory"
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
                  className="team-card  flex flex-col items-center justify-center rounded-2xl w-[280px] h-[320px] bg-gray-800 p-6 snap-start mt-30  border border-[#0047AB] hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20  transition-transform duration-100  "
                  initial={{ opacity: 0, y: 0 }}
                  whileInView={{ opacity: 1, y: -100 }}
                  transition={{ duration: 0.8, delay: index * 0.025 }}
                >
                  <div className="w-45 h-45 flex items-center justify-center mb-4">
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
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

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Top Batsmen Section */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-8 sm:mb-12"
          >
            <h1 className="text-4xl font-bold text-blue-400">Top 3 Batsmen</h1>
            <button
              onClick={() => handleNavigate("/players")}
              className="flex items-center justify-center bg-[#0047AB] text-white px-4 py-2 rounded-full hover:bg-blue-700 transition hover:cursor-pointer"
            >
              <FaArrowRight />
            </button>
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
                    Matches: {player.state?.ipl?.batting?.match || 0} | Runs:{" "}
                    {player.state?.ipl?.batting?.runs || 0} | Avg:{" "}
                    {player.state?.ipl?.batting?.average || 0}
                  </p>
                </motion.div>
              ))
            )}
          </div>

          {/* Top All-Rounders Section */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-8 sm:mb-12 mt-12"
          >
            <h1 className="text-4xl font-bold text-blue-400">Top 3 Bowlers</h1>
            <button
              onClick={() => handleNavigate("/players")}
              className="flex items-center justify-center bg-[#0047AB] text-white px-4 py-2 rounded-full hover:bg-blue-700 transition hover:cursor-pointer"
            >
              <FaArrowRight />
            </button>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {playersLoading ? (
              <p className="text-white">Loading players...</p>
            ) : playersError ? (
              <p className="text-red-500">{playersError}</p>
            ) : topAllRounders.length === 0 ? (
              <p className="text-white">No all-rounders found.</p>
            ) : (
              topBowlers.map((player, index) => (
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
                    {player.player_role} | {player.bowling_style}
                  </p>
                  <p className="text-sm text-blue-300 font-bold mt-2">
                    Matches: {player.state.ipl.bowling.match} | Wickets:{" "}
                    {player.state.ipl.bowling.wicket} | Eco:{" "}
                    {player.state.ipl.bowling.eco}
                  </p>
                </motion.div>
              ))
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-8 sm:mb-12 mt-12"
          >
            <h1 className="text-4xl font-bold text-blue-400">
              Top 3 All-Rounders
            </h1>
            <button
              onClick={() => handleNavigate("/players")}
              className="flex items-center justify-center bg-[#0047AB] text-white px-4 py-2 rounded-full hover:bg-blue-700 transition hover:cursor-pointer"
            >
              <FaArrowRight />
            </button>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {playersLoading ? (
              <p className="text-white">Loading players...</p>
            ) : playersError ? (
              <p className="text-red-500">{playersError}</p>
            ) : topAllRounders.length === 0 ? (
              <p className="text-white">No all-rounders found.</p>
            ) : (
              topAllRounders.map((player, index) => (
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
                    Batting | {player.batting_style}
                  </p>
                  <p className="text-sm text-gray-300">
                    Bowling | {player.bowling_style}
                  </p>
                  <p className="text-sm text-blue-300 font-bold mt-2">
                    Matches: {player.state?.ipl?.batting?.match || 0} | Runs:{" "}
                    {player.state?.ipl?.batting?.runs || 0} | Wickets:{" "}
                    {player.state?.ipl?.bowling?.wicket || 0}
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

export default Homepage;
