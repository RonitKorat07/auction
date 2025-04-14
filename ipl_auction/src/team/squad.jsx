import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamemail } from "../store/teamslice";
import { fetchPlayersByTeam } from "../store/playerslice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";


const Squad = () => {
  const dispatch = useDispatch();
  const { teams, loading: teamLoading, error: teamError } = useSelector((state) => state.team);
  const { players = [], loading: playerLoading, error: playerError } = useSelector((state) => state.players);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email || null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchTeamemail(userEmail));
    }
  }, [dispatch, userEmail]);

  useEffect(() => {
    if (teams?.length > 0) {
      const teamName = teams[0].name;
      dispatch(fetchPlayersByTeam(teamName));
    }
    console.log(players)
  }, [dispatch, teams]);

  const team = teams?.[0] || null;
  const loading = teamLoading || playerLoading;
  const error = teamError || playerError;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#202626]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border border-[#0047AB]"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#202626]">
      <div className="text-[#FF4500] text-xl">Error: {error}</div>
    </div>
  );

  if (!team) return (
    <div className="min-h-screen flex items-center justify-center bg-[#202626]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border border-[#0047AB]"></div>
    </div>
  );

  const batsman = players.filter((p) => p.player_role === "Batsman"  );
  const allRounders = players.filter((p) => p.player_role === "All-rounder");
  const bowlers = players.filter((p) => p.player_role === "Bowler");
  const wicketKeepers = players.filter((p) => p.player_role === "Wicket-keeper batsman");

  return (
    <div className="min-h-screen bg-[#202626]">
      <div className="max-w-[1440px] mx-auto px-8 py-25">
        {/* Batsman Section */}
        <div className="mb-16">
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-4">
              <i className={`fas fa-bat text-4xl text-[#0047AB]`}></i>
              <h2 className="text-4xl font-bold text-[#E8EAF6]">Batsman</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {batsman.map((player, index) => (
              <div
                key={`batsman-${index}`}
                className="bg-gradient-to-r from-[#2C2F32] to-[#2C2F32] border rounded-2xl overflow-hidden relative group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  borderColor: team?.color || "#0047AB",
                  boxShadow: `0px 4px 20px ${team?.color || "#0047AB"}30`,
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={player.image || "https://via.placeholder.com/300x200?text=Player"}
                    alt={player.name}
                    className="w-full h-[200px] sm:h-[250px] object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=Player";
                    }}
                  />
                </div>
                <div className="p-6 h-full bg-gradient-to-b from-transparent to-black/40">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold" style={{ color: team?.color }}>
                      {player.name || "Unknown Player"}
                    </h3>
                    <span
                      className="px-3 py-1 bg-[#0047AB]/10 text-sm rounded-full border backdrop-blur-sm"
                      style={{ borderColor: team?.color, color: team?.color }}
                    >
                      {player.country || "N/A"}
                    </span>
                  </div>
                  <p className="text-[#B0E0E6] text-sm mb-3">
                    {player.batting_style }
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-[#B0E0E6]/80 text-sm font-medium">
                      {player.career.runs || "No achievements listed"}+runs
                    </p>
                    <Link
                      to={`/playerprofile/${player.id}`}
                      className="w-8 h-8 rounded-full bg-[#0047AB]/10 flex items-center justify-center hover:bg-[#0047AB]/20 transition-all duration-300 backdrop-blur-sm border hover:cursor-pointer"
                      style={{ borderColor: team?.color, color: team?.color }}                      
                      title="View Player">   
                      <AiOutlineArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wicket-keeper batsman*/}
        <div className="mb-16">
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-4">
              <i className={`fas fa-bat text-4xl text-[#0047AB]`}></i>
              <h2 className="text-4xl font-bold text-[#E8EAF6]">Wicket-keeper Batsman</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wicketKeepers.map((player, index) => (
              <div
                key={`wicketKeepers-${index}`}
                className="bg-gradient-to-r from-[#2C2F32] to-[#2C2F32] border rounded-2xl overflow-hidden relative group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  borderColor: team?.color || "#0047AB",
                  boxShadow: `0px 4px 20px ${team?.color || "#0047AB"}30`,
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={player.image || "https://via.placeholder.com/300x200?text=Player"}
                    alt={player.name}
                    className="w-full h-[200px] sm:h-[250px] object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=Player";
                    }}
                  />
                </div>
                <div className="p-6 h-full bg-gradient-to-b from-transparent to-black/40">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold" style={{ color: team?.color }}>
                      {player.name || "Unknown Player"}
                    </h3>
                    <span
                      className="px-3 py-1 bg-[#0047AB]/10 text-sm rounded-full border backdrop-blur-sm"
                      style={{ borderColor: team?.color, color: team?.color }}
                    >
                      {player.country || "N/A"}
                    </span>
                  </div>
                  <p className="text-[#B0E0E6] text-sm mb-3">
                    {player.batting_style }
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-[#B0E0E6]/80 text-sm font-medium">
                      {player.career.runs || "No achievements listed"}+runs
                    </p>
                    <Link
                      to={`/playerprofile/${player.id}`}
                      className="w-8 h-8 rounded-full bg-[#0047AB]/10 flex items-center justify-center hover:bg-[#0047AB]/20 transition-all duration-300 backdrop-blur-sm border hover:cursor-pointer"
                      style={{ borderColor: team?.color, color: team?.color }}                      
                      title="View Player">   
                      <AiOutlineArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All-Rounders Section */}
        <div className="mb-16">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-4xl font-bold text-[#E8EAF6]">All-Rounders</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allRounders.map((player, index) => (
              <div
                key={`allrounders-${index}`}
                className="bg-gradient-to-r from-[#2C2F32] to-[#2C2F32] border rounded-2xl overflow-hidden relative group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  borderColor: team?.color || "#0047AB",
                  boxShadow: `0px 4px 20px ${team?.color || "#0047AB"}30`,
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={player.image || "https://via.placeholder.com/300x200?text=Player"}
                    alt={player.name}
                    className="w-full h-[200px] sm:h-[250px] object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=Player";
                    }}
                  />
                </div>
                <div className="p-6 h-full bg-gradient-to-b from-transparent to-black/40">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold" style={{ color: team?.color }}>
                      {player.name || "Unknown Player"}
                    </h3>
                    <span
                      className="px-3 py-1 bg-[#0047AB]/10 text-sm rounded-full border backdrop-blur-sm"
                      style={{ borderColor: team?.color, color: team?.color }}
                    >
                      {player.country || "N/A"}
                    </span>
                  </div>
                  <p className="text-[#B0E0E6] text-sm mb-3">
                    {player.batting_style},{player.bowling_style}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-[#B0E0E6]/80 text-sm font-medium">
                      {player.career.runs}+runs , {player.career.wickets}+wickets
                    </p>
                    <Link
                      to={`/playerprofile/${player.id}`}
                      className="w-8 h-8 rounded-full bg-[#0047AB]/10 flex items-center justify-center hover:bg-[#0047AB]/20 transition-all duration-300 backdrop-blur-sm border hover:cursor-pointer"
                      style={{ borderColor: team?.color, color: team?.color }}                      
                      title="View Player">   
                      <AiOutlineArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bowlers Section */}
        <div className="mb-16">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-4xl font-bold text-[#E8EAF6]">Bowlers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bowlers.map((player, index) => (
              <div
                key={`bowlers-${index}`}
                className="bg-gradient-to-r from-[#2C2F32] to-[#2C2F32] border rounded-2xl overflow-hidden relative group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  borderColor: team?.color || "#0047AB",
                  boxShadow: `0px 4px 20px ${team?.color || "#0047AB"}30`,
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={player.image || "https://via.placeholder.com/300x200?text=Player"}
                    alt={player.name}
                    className="w-full h-[200px] sm:h-[250px] object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=Player";
                    }}/>
                </div>
                <div className="p-6 h-full bg-gradient-to-b from-transparent to-black/40">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold" style={{ color: team?.color }}>
                      {player.name || "Unknown Player"}
                    </h3>
                    <span
                      className="px-3 py-1 bg-[#0047AB]/10 text-sm rounded-full border backdrop-blur-sm"
                      style={{ borderColor: team?.color, color: team?.color }}
                    >
                      {player.country || "N/A"}
                    </span>
                  </div>
                  <p className="text-[#B0E0E6] text-sm mb-3">
                    {player.bowling_style || "No speciality specified"}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-[#B0E0E6]/80 text-sm font-medium">
                      {player.career.wickets}+ wickets
                    </p>
                    
                    <Link
                      to={`/playerprofile/${player.id}`}
                      className="w-8 h-8 rounded-full bg-[#0047AB]/10 flex items-center justify-center hover:bg-[#0047AB]/20 transition-all duration-300 backdrop-blur-sm border hover:cursor-pointer"
                      style={{ borderColor: team?.color, color: team?.color }}                      
                      title="View Player">   
                      <AiOutlineArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Squad;