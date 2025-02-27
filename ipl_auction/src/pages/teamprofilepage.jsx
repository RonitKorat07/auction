import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeam } from "../store/teamslice";

const Teamprofile = () => {
  const [selectedRole, setSelectedRole] = useState("All");
  const { id } = useParams();
  const dispatch = useDispatch();
  const { teams } = useSelector((state) => state.team);

  useEffect(() => {
    dispatch(fetchTeam());
  }, [dispatch]);

  const players = [
    {
      name: "Rohit Sharma",
      role: "Batsman",
      number: "45",
      nationality: "India",
      image:
        "https://public.readdy.ai/ai/img_res/b28f424fb204624038f5d466baad5634.jpg",
    },
    {
      name: "Jasprit Bumrah",
      role: "Bowler",
      number: "93",
      nationality: "India",
      image:
        "https://public.readdy.ai/ai/img_res/cb731038623ddd329f0101ff9a12e621.jpg",
    },
    {
      name: "Kieron Pollard",
      role: "All-rounder",
      number: "55",
      nationality: "West Indies",
      image:
        "https://public.readdy.ai/ai/img_res/d0398943506165fe470f32206953efe4.jpg",
    },
  ];

  const filteredPlayers =
    selectedRole === "All"
      ? players
      : players.filter((player) => player.role === selectedRole);

  const selectedteam = teams.find((team) => team.id.toString() === id);

  return (
    <div className="min-h-screen bg-[#202626]">
      {/* Hero Section */}
      <div
        className={`h-[300px] sm:h-[400px] md:h-[500px] lg:h-[500px] bg-black relative overflow-hidden`}
      >
        <div className="absolute inset-0">
          <img
            src="https://public.readdy.ai/ai/img_res/aa3299b34db5e268fca26ddc580b7737.jpg"
            className="w-full h-full object-cover opacity-30"
            alt="Stadium"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center">
          <img
            src={selectedteam?.logo}
            alt="Team Logo"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mb-4 sm:mb-6"
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#E8EAF6] text-center">
            {selectedteam?.name}
          </h1>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 -mt-12 sm:-mt-16 relative z-20">
        <div className="bg-[#202626] rounded-lg shadow-lg shadow-[#0047AB]/10 p-4 md:p-6 lg:p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 hover:shadow-[#0047AB]/100 transition delay-150 duration-300 ease-in-out border border-[#0047AB] ">
          <div className="text-center">
            <p className="text-[#B0E0E6] text-sm">Home Venue</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#E8EAF6]">
              {selectedteam?.homeVenue?.name}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[#B0E0E6] text-sm">Coach</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#E8EAF6]">
              {selectedteam?.coach}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[#B0E0E6] text-sm">Owner</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#E8EAF6]">
              {selectedteam?.owner}
            </p>
          </div>

          <div className="text-center">
            <p className="text-[#B0E0E6] text-sm">Team Budget</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#E8EAF6]">
              {selectedteam?.budget}
            </p>
          </div>
        </div>
      </div>

      {/* Squad Section */}
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0047AB] mb-4 md:mb-8">
          Squad
        </h2>
        <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-8">
          <button
            onClick={() => setSelectedRole("All")}
            className={`px-4 py-2 text-sm sm:text-base rounded-button ${
              selectedRole === "All"
                ? "bg-[#0047AB] text-[#E8EAF6]"
                : "bg-[#B0E0E6]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedRole("Batsman")}
            className={`px-4 py-2 text-sm sm:text-base rounded-button ${
              selectedRole === "Batsman"
                ? "bg-[#0047AB] text-[#E8EAF6]"
                : "bg-[#B0E0E6]"
            }`}
          >
            Batsmen
          </button>
          <button
            onClick={() => setSelectedRole("Bowler")}
            className={`px-4 py-2 text-sm sm:text-base rounded-button ${
              selectedRole === "Bowler"
                ? "bg-[#0047AB] text-[#E8EAF6]"
                : "bg-[#B0E0E6]"
            }`}
          >
            Bowlers
          </button>
          <button
            onClick={() => setSelectedRole("All-rounder")}
            className={`px-4 py-2 text-sm sm:text-base rounded-button ${
              selectedRole === "All-rounder"
                ? "bg-[#0047AB] text-[#E8EAF6]"
                : "bg-[#B0E0E6]"
            }`}
          >
            All-rounders
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {filteredPlayers.map((player, index) => (
            <div
              key={index}
              className="bg-[#202626] rounded-lg shadow-lg shadow-black/100 overflow-hidden"
            >
              <img
                src={player.image}
                alt={player.name}
                className="w-full h-48 sm:h-56 md:h-64 object-cover"
              />
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-[#0047AB]">
                  {player.name}
                </h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[#B0E0E6] text-sm sm:text-base">
                    {player.role}
                  </span>
                  <span className="text-[#B0E0E6] text-sm sm:text-base">
                    #{player.number}
                  </span>
                </div>
                <p className="text-[#B0E0E6] mt-2 text-sm sm:text-base">
                  {player.nationality}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Teamprofile;
