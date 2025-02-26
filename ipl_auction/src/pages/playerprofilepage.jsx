import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlayers } from "../store/playerslice";
import gsap from "gsap";

const PlayerProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { players, loading, error } = useSelector((state) => state.player);
  const [selectedFormat, setSelectedFormat] = useState("ipl"); // State to manage selected format

  useEffect(() => {
    dispatch(fetchPlayers());
  }, [dispatch]);

  const selectedPlayer = players.find((player) => player.id.toString() === id);

  useEffect(() => {
    if (!loading && selectedPlayer) {
      gsap.fromTo(
        ".player-info",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
      gsap.fromTo(
        ".stat-card",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }
      );
      gsap.fromTo(
        ".player-image",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5 }
      );
    }
  }, [loading, selectedPlayer]);

  if (error) return <p>Error loading player data.</p>;
  if (!selectedPlayer) return <p className="text-white">Player not found.</p>;

  // Function to handle format selection
  const handleFormatChange = (format) => {
    setSelectedFormat(format);
  };

  // Get stats for the selected format
  const formatStats = selectedPlayer?.state?.[selectedFormat] || {};

  return (
    <div className="h-auto w-full bg-[#202626] text-white pt-20">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#0047AB]"></div>
        </div>
      ) : (
        <div className="h-auto container mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Player Image and Info */}
          <div className="md:col-span-1 player-info">
            <div className="rounded-xl overflow-hidden mb-6 player-image">
              <img
                src={selectedPlayer.image}
                alt={selectedPlayer.name}
                className="w-full h-[300px] sm:h-[400px] object-cover object-top"
              />
            </div>
            <div className="space-y-4">
              <div className="bg-[#2A3131] p-4 rounded-lg border border-[#0047AB]">
                <h3 className="text-lg font-semibold mb-3 text-[#0047AB]">
                  Player Info
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#B0E0E6]">Name</span>
                    <span className="text-white">{selectedPlayer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#B0E0E6]">Team</span>
                    <span className="text-white">
                      {selectedPlayer.auction_detail.team || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#B0E0E6]">Role</span>
                    <span className="text-white">
                      {selectedPlayer.player_role}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#B0E0E6]">Nationality</span>
                    <span className="text-white">{selectedPlayer.country}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Table */}
          <div className="md:col-span-2 space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[#2A3131] p-6 rounded-lg text-center border border-[#0047AB] stat-card">
                <i className="fas fa-cricket-bat-ball text-4xl text-[#0047AB] mb-2"></i>
                <p className="text-2xl font-bold text-white">
                  {selectedPlayer?.state?.ipl?.batting?.match}
                </p>
                <p className="text-sm text-[#B0E0E6]">Total Matches</p>
              </div>
              <div className="bg-[#2A3131] p-6 rounded-lg text-center border border-[#0047AB] stat-card">
                <i className="fas fa-running text-4xl text-[#0047AB] mb-2"></i>
                <p className="text-2xl font-bold text-white">
                  {selectedPlayer.player_role.includes("Batsman") ||
                  selectedPlayer.player_role === "Wicket-keeper batsman" ||
                  selectedPlayer.player_role === "All-rounder"
                    ? selectedPlayer?.state?.ipl?.batting?.runs
                    : selectedPlayer?.state?.ipl?.bowling?.wicket}
                </p>
                <p className="text-sm text-[#B0E0E6]">
                  {selectedPlayer.player_role.includes("Batsman") ||
                  selectedPlayer.player_role === "Wicket-keeper batsman" ||
                  selectedPlayer.player_role === "All-rounder"
                    ? "Total Runs"
                    : "Total Wickets"}
                </p>
              </div>
              <div className="bg-[#2A3131] p-6 rounded-lg text-center border border-[#0047AB] stat-card">
                <i className="fas fa-bullseye text-4xl text-[#0047AB] mb-2"></i>
                <p className="text-2xl font-bold text-white">
                  {selectedPlayer.player_role.includes("Batsman") ||
                  selectedPlayer.player_role === "Wicket-keeper batsman" ||
                  (selectedPlayer.player_role === "All-rounder" &&
                    selectedPlayer?.state?.ipl?.batting?.high_score >= 50)
                    ? selectedPlayer?.state?.ipl?.batting?.high_score
                    : selectedPlayer?.state?.ipl?.bowling?.best_bowling ||
                      "N/A"}
                </p>
                <p className="text-sm text-[#B0E0E6]">Best Performance</p>
              </div>
            </div>

            {/* Format Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <button
                onClick={() => handleFormatChange("ipl")}
                className={`px-4 py-2 rounded ${
                  selectedFormat === "ipl"
                    ? "bg-[#0047AB] text-white"
                    : "bg-[#B0E0E6] text-[#202626]"
                }`}
              >
                IPL
              </button>
              <button
                onClick={() => handleFormatChange("odi")}
                className={`px-4 py-2 rounded ${
                  selectedFormat === "odi"
                    ? "bg-[#0047AB] text-white"
                    : "bg-[#B0E0E6] text-[#202626]"
                }`}
              >
                ODI
              </button>
              <button
                onClick={() => handleFormatChange("t20")}
                className={`px-4 py-2 rounded ${
                  selectedFormat === "t20"
                    ? "bg-[#0047AB] text-white"
                    : "bg-[#B0E0E6] text-[#202626]"
                }`}
              >
                T20
              </button>
              <button
                onClick={() => handleFormatChange("test")}
                className={`px-4 py-2 rounded ${
                  selectedFormat === "test"
                    ? "bg-[#0047AB] text-white"
                    : "bg-[#B0E0E6] text-[#202626]"
                }`}
              >
                Test
              </button>
            </div>

            {/* Stats Table */}
            <div className="bg-[#2A3131] p-6 rounded-lg border border-[#0047AB]">
              <h3 className="text-xl font-semibold mb-6 text-[#0047AB]">
                {selectedFormat.toUpperCase()} Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Batting Stats */}
                <div className="bg-[#1E2424] p-6 rounded-lg shadow-lg border border-[#0047AB]">
                  <div className="flex items-center mb-4">
                    <i className="fas fa-baseball-bat-ball text-3xl text-[#0047AB] mr-3"></i>
                    <h4 className="text-lg font-semibold text-[#0047AB]">
                      Batting
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard
                      icon="fas fa-calendar-alt"
                      label="Total Matches"
                      value={formatStats?.batting?.match || "N/A"}
                    />
                    <StatCard
                      icon="fas fa-running"
                      label="Total Runs"
                      value={formatStats?.batting?.runs || "N/A"}
                    />
                    <StatCard
                      icon="fas fa-chart-line"
                      label="Average"
                      value={formatStats?.batting?.average || "N/A"}
                    />
                    <StatCard
                      icon="fas fa-bolt"
                      label="Strike Rate"
                      value={formatStats?.batting?.strike_rate || "N/A"}
                    />
                    <StatCard
                      icon="fas fa-trophy"
                      label="Highest Score"
                      value={formatStats?.batting?.high_score || "N/A"}
                    />
                  </div>
                </div>

                {/* Bowling Stats */}
                <div className="bg-[#1E2424] p-6 rounded-lg shadow-lg border border-[#0047AB]">
                  <div className="flex items-center mb-4">
                    <i className="fas fa-baseball text-3xl text-[#0047AB] mr-3"></i>
                    <h4 className="text-lg font-semibold text-[#0047AB]">
                      Bowling
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard
                      icon="fas fa-calendar-alt"
                      label="Total Matches"
                      value={formatStats?.bowling?.match || "N/A"}
                    />
                    <StatCard
                      icon="fas fa-bullseye"
                      label="Total Wickets"
                      value={formatStats?.bowling?.wicket || "N/A"}
                    />
                    <StatCard
                      icon="fas fa-chart-line"
                      label="Average"
                      value={formatStats?.bowling?.average || "N/A"}
                    />
                    <StatCard
                      icon="fas fa-coins"
                      label="Economy"
                      value={formatStats?.bowling?.economy || "N/A"}
                    />
                    <StatCard
                      icon="fas fa-award"
                      label="Best Bowling"
                      value={formatStats?.bowling?.best_bowling || "N/A"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable StatCard Component
const StatCard = ({ icon, label, value }) => (
  <div className="flex flex-col items-center justify-center bg-[#2A3131] p-4 rounded-lg text-center border border-[#0047AB] stat-card">
    <i className={`${icon} text-3xl text-[#0047AB] mb-2`}></i>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-sm text-[#B0E0E6]">{label}</p>
  </div>
);

export default PlayerProfile;
