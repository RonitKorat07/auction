import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlayers } from "../store/playerslice";

const PlayerProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { players, loading, error } = useSelector((state) => state.player);

  useEffect(() => {
    dispatch(fetchPlayers());
  }, [dispatch]);

  const selectedPlayer = players.find((player) => player.id.toString() === id);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading player data.</p>;
  if (!selectedPlayer) return <p className="text-white">Player not found.</p>;

  return (
   <div className="h-auto  w-full bg-[#202626] text-white pt-20">
 

  {/* Main Content - Scrollable but No Scrollbar */}
  <div className="h-auto  container mx-auto px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Left Column - Player Image and Info */}
    <div className="md:col-span-1">
      <div className="rounded-xl overflow-hidden mb-6">
        <img
          src={selectedPlayer.image}
          alt={selectedPlayer.name}
          className="w-full h-[400px] object-cover object-top"
        />
      </div>
      <div className="space-y-4">
        <div className="bg-[#2A3131] p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-purple-400">
            Player Info
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Name</span>
              <span className="text-white">
                {selectedPlayer.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Team</span>
              <span className="text-white">
                {selectedPlayer.auction_detail.team || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Role</span>
              <span className="text-white">{selectedPlayer.player_role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Nationality</span>
              <span className="text-white">{selectedPlayer.country}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Right Column - Stats and Radar Chart */}
    <div className="md:col-span-2 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#2A3131] p-6 rounded-lg text-center">
          <i className="fas fa-cricket-bat-ball text-4xl text-purple-500 mb-2"></i>
          <p className="text-2xl font-bold text-white">
            {selectedPlayer?.state?.ipl?.batting?.match}
          </p>
          <p className="text-sm text-gray-400">Total Matches</p>
        </div>
        <div className="bg-[#2A3131] p-6 rounded-lg text-center">
          <i className="fas fa-running text-4xl text-blue-500 mb-2"></i>
          <p className="text-2xl font-bold text-white">
            {selectedPlayer.player_role.includes("Batsman") ||
            selectedPlayer.player_role === "All-rounder"
              ? selectedPlayer?.state?.ipl?.batting?.runs
              : selectedPlayer?.state?.ipl?.bowling?.wicket}
          </p>
          <p className="text-sm text-gray-400">
            {selectedPlayer.player_role.includes("Batsman") ||
            selectedPlayer.player_role === "All-rounder"
              ? "Total Runs"
              : "Total Wickets"}
          </p>
        </div>
        <div className="bg-[#2A3131] p-6 rounded-lg text-center">
          <i className="fas fa-bullseye text-4xl text-green-500 mb-2"></i>
          <p className="text-2xl font-bold text-white">
            {selectedPlayer.player_role.includes("Batsman") ||
            (selectedPlayer.player_role === "All-rounder" &&
              selectedPlayer?.state?.ipl?.batting?.high_score >= 50)
              ? selectedPlayer?.state?.ipl?.batting?.high_score
              : selectedPlayer?.state?.ipl?.bowling?.best_bowling || "N/A"}
          </p>
          <p className="text-sm text-gray-400">Best Performance</p>
        </div>
      </div>
      <div className="bg-[#2A3131] p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-purple-400">
          Key Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
      </div>
      <div className="bg-[#2A3131] p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-purple-400">
          Performance Radar
        </h3>
        <div id="statsChart" style={{ width: "100%", height: "300px" }}></div>
      </div>
    </div>
  </div>
</div>

  );
};

export default PlayerProfile;
