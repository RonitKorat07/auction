import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchTeamemail } from "../store/teamslice"; // Adjust the import path
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Add onAuthStateChanged

import { AiOutlineArrowRight } from "react-icons/ai";
const Squad = () => {
  const players = [
    // Batsmen
    {
      name: "William Anderson",
      role: "Batsman",
      matches: 156,
      average: 48.5,
      speciality: "Right-handed Opening Batsman",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "England",
      achievements: "5000+ runs, Average: 48.5",
    },
    {
      name: "James Richardson",
      role: "Batsman",
      matches: 142,
      average: 45.8,
      speciality: "Left-handed Middle Order",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "Australia",
      achievements: "4800+ runs, Average: 45.8",
    },
    {
      name: "Rohit Sharma",
      role: "Batsman",
      matches: 198,
      average: 49.2,
      speciality: "Right-handed Opening Batsman",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "India",
      achievements: "6500+ runs, Average: 49.2",
    },
    {
      name: "Kane Williamson",
      role: "Batsman",
      matches: 165,
      average: 52.3,
      speciality: "Right-handed Top Order",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "New Zealand",
      achievements: "7000+ runs, Average: 52.3",
    },
    {
      name: "David Warner",
      role: "Batsman",
      matches: 187,
      average: 46.8,
      speciality: "Left-handed Opening Batsman",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "Australia",
      achievements: "5800+ runs, Average: 46.8",
    },
    {
      name: "Babar Azam",
      role: "Batsman",
      matches: 145,
      average: 50.1,
      speciality: "Right-handed Top Order",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "Pakistan",
      achievements: "5200+ runs, Average: 50.1",
    },
    {
      name: "Quinton de Kock",
      role: "Batsman",
      matches: 154,
      average: 44.7,
      speciality: "Left-handed Wicket-keeper Batsman",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "South Africa",
      achievements: "4900+ runs, Average: 44.7",
    },
    {
      name: "Tom Latham",
      role: "Batsman",
      matches: 134,
      average: 42.3,
      speciality: "Left-handed Wicket-keeper Batsman",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "New Zealand",
      achievements: "4500+ runs, Average: 42.3",
    },
    // All-Rounders
    {
      name: "Michael Thompson",
      role: "All-Rounder",
      matches: 178,
      average: 38.6,
      speciality: "Right-handed Batsman & Medium Fast Bowler",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "South Africa",
      achievements: "5000+ runs, 200+ wickets",
    },
    {
      name: "Christopher Davis",
      role: "All-Rounder",
      matches: 134,
      average: 35.2,
      speciality: "Left-arm All-rounder",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "New Zealand",
      achievements: "4500+ runs, 180+ wickets",
    },
    {
      name: "Ben Stokes",
      role: "All-Rounder",
      matches: 167,
      average: 41.5,
      speciality: "Left-handed Batsman & Right-arm Fast",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "England",
      achievements: "5500+ runs, 190+ wickets",
    },
    {
      name: "Ravindra Jadeja",
      role: "All-Rounder",
      matches: 156,
      average: 36.8,
      speciality: "Left-handed Batsman & Left-arm Spin",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "India",
      achievements: "4000+ runs, 250+ wickets",
    },
    {
      name: "Mitchell Marsh",
      role: "All-Rounder",
      matches: 142,
      average: 34.9,
      speciality: "Right-handed Batsman & Medium Fast",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "Australia",
      achievements: "3800+ runs, 160+ wickets",
    },
    // Bowlers
    {
      name: "Stuart Mitchell",
      role: "Bowler",
      matches: 145,
      average: 24.3,
      speciality: "Right-arm Fast Bowler",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "England",
      achievements: "300+ wickets, Best figures: 7/42",
    },
    {
      name: "Daniel Wilson",
      role: "Bowler",
      matches: 128,
      average: 25.1,
      speciality: "Left-arm Spin Bowler",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "India",
      achievements: "250+ wickets, Best figures: 6/35",
    },
    {
      name: "Pat Cummins",
      role: "Bowler",
      matches: 156,
      average: 22.8,
      speciality: "Right-arm Fast",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "Australia",
      achievements: "320+ wickets, Best figures: 8/38",
    },
    {
      name: "Kagiso Rabada",
      role: "Bowler",
      matches: 143,
      average: 23.4,
      speciality: "Right-arm Fast",
      imageUrl: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
      nationality: "South Africa",
      achievements: "280+ wickets, Best figures: 7/32",
    },
  ];
  const dispatch = useDispatch();
  const { teams, loading, error } = useSelector((state) => state.team);
  const [activeTab, setActiveTab] = useState("batsmen");
  const [userEmail, setUserEmail] = useState(null); // Track user email

  // Get the logged-in user's email using onAuthStateChanged
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); // Set user email
      } else {
        setUserEmail(null); // No user logged in
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Fetch team data when the userEmail changes
  useEffect(() => {
    if (userEmail) {
      dispatch(fetchTeamemail(userEmail)); // Pass the email to fetchTeam
    }
  }, [dispatch, userEmail]);

  // Use the first team in the array (or handle multiple teams as needed)
  const team = teams.length > 0 ? teams[0] : null;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border border-[#0047AB]"></div>
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

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border border-[#0047AB]"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#202626]">
      <div className="max-w-[1440px] mx-auto px-8 py-25">
        <div>
          {/* Batsmen Section */}
          <div className="mb-16">
            <div className="flex flex-col items-center mb-12">
              <div className="flex items-center gap-4">
                <i className="fas fa-bat text-4xl text-[#0047AB]"></i>
                <h2 className="text-4xl font-bold text-[#E8EAF6]">Batsmen</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {players
                .filter((player) => player.role === "Batsman")
                .map((player, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-r from-[#2C2F32] to-[#2C2F32] border rounded-2xl overflow-hidden relative group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
                    style={{
                      borderColor: team.color || "#0047AB",
                      boxShadow: `0px 4px 20px ${team.color || "#0047AB"}30`, // Adding transparency
                    }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={player.imageUrl}
                        alt={player.name}
                        className="w-full h-[200px] sm:h-[250px] object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6 h-full bg-gradient-to-b from-transparent to-black/40">
                      <div className="flex items-center justify-between mb-3">
                        <h3
                          className="text-xl font-bold transition-colors duration-300 "
                          style={{ color: team.color }}
                        >
                          {player.name}
                        </h3>
                        <span
                          className="px-3 py-1 bg-[#0047AB]/10  text-sm rounded-full border border-[#0047AB]/20 backdrop-blur-sm"
                          style={{ borderColor: team.color, color: team.color }}
                        >
                          {player.nationality}
                        </span>
                      </div>
                      <p className="text-[#B0E0E6] text-sm mb-3">
                        {player.speciality}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-[#B0E0E6]/80 text-sm font-medium">
                          {player.achievements}
                        </p>
                        <button
                          className="w-8 h-8 rounded-full bg-[#0047AB]/10 flex items-center justify-center hover:bg-[#0047AB]/20 transition-all duration-300 backdrop-blur-sm border hover:cursor-pointer"
                          style={{ borderColor: team.color, color: team.color }}
                        >
                          <i className="fas fa-arrow-right">
                            <AiOutlineArrowRight />
                          </i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* All-Rounders Section */}
          <div className="mb-8">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-4xl font-bold text-[#E8EAF6]">
                All-Rounders
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {players
                .filter((player) => player.role === "All-Rounder")
                .map((player, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-b from-[#2C2F32] to-[#2C2F32] border rounded-2xl overflow-hidden relative group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
                    style={{
                      borderColor: team.color || "#0047AB",
                      boxShadow: `0px 4px 20px ${team.color || "#0047AB"}30`, // Adding transparency
                    }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={player.imageUrl}
                        alt={player.name}
                        className="w-full h-[200px] sm:h-[250px] object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6 h-full bg-gradient-to-b from-transparent to-black/40">
                      <div className="flex items-center justify-between mb-3">
                        <h3
                          className="text-xl font-bold transition-colors duration-300 "
                          style={{ color: team.color }}
                        >
                          {player.name}
                        </h3>
                        <span
                          className="px-3 py-1 bg-[#0047AB]/10  text-sm rounded-full border border-[#0047AB]/20 backdrop-blur-sm"
                          style={{ borderColor: team.color, color: team.color }}
                        >
                          {player.nationality}
                        </span>
                      </div>
                      <p className="text-[#B0E0E6] text-sm mb-3">
                        {player.speciality}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-[#B0E0E6]/80 text-sm font-medium">
                          {player.achievements}
                        </p>
                        <button
                          className="w-8 h-8 rounded-full bg-[#0047AB]/10 flex items-center justify-center hover:bg-[#0047AB]/20 transition-all duration-300 backdrop-blur-sm border hover:cursor-pointer"
                          style={{ borderColor: team.color, color: team.color }}
                        >
                          <i className="fas fa-arrow-right">
                            <AiOutlineArrowRight />
                          </i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Bowlers Section */}
          <div className="mb-8">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-4xl font-bold text-[#E8EAF6]">Bowlers</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {players
                .filter((player) => player.role === "Bowler")
                .map((player, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-b from-[#2C2F32] to-[#2C2F32] border rounded-2xl overflow-hidden relative group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
                    style={{
                      borderColor: team.color || "#0047AB",
                      boxShadow: `0px 4px 20px ${team.color || "#0047AB"}30`, // Adding transparency
                    }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={player.imageUrl}
                        alt={player.name}
                        className="w-full h-[200px] sm:h-[250px] object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6 h-full  bg-gradient-to-b from-transparent to-black/40">
                      <div className="flex items-center justify-between mb-3">
                        <h3
                          className="text-xl font-bold transition-colors duration-300 "
                          style={{ color: team.color }}
                        >
                          {player.name}
                        </h3>
                        <span
                          className="px-3 py-1 bg-[#0047AB]/10  text-sm rounded-full border border-[#0047AB]/20 backdrop-blur-sm"
                          style={{ borderColor: team.color, color: team.color }}
                        >
                          {player.nationality}
                        </span>
                      </div>
                      <p className="text-[#B0E0E6] text-sm mb-3">
                        {player.speciality}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-[#B0E0E6]/80 text-sm font-medium">
                          {player.achievements}
                        </p>
                        <button
                          className="w-8 h-8 rounded-full bg-[#0047AB]/10 flex items-center justify-center hover:bg-[#0047AB]/20 transition-all duration-300 backdrop-blur-sm border hover:cursor-pointer"
                          style={{ borderColor: team.color, color: team.color }}
                        >
                          <i className="fas fa-arrow-right">
                            <AiOutlineArrowRight />
                          </i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Squad;
