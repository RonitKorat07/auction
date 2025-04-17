import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { 
  history_fetchAuctionDetails,
  clearCurrentAuction
} from "../store/auction_historyslice";

const AuctionHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentAuction, status, error } = useSelector((state) => state.historyplayer);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Fetch auction details on mount
  useEffect(() => {
    if (id) {
      dispatch(history_fetchAuctionDetails(id));
    } else {
      navigate("/admin/auctions");
    }

    return () => {
      dispatch(clearCurrentAuction());
    };
  }, [dispatch, id, navigate]);

   // Filter and sort players
   const filteredPlayers = useMemo(() => {
    if (!currentAuction?.players) return [];
    
    return currentAuction.players
      .filter((player) => {
        const matchesSearch = player.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === "All" || player.role === selectedRole;
        const matchesTeam = selectedTeam === "All" || player.team === selectedTeam;
        const matchesStatus = selectedStatus === "All" || player.auctionStatus === selectedStatus;
        return matchesSearch && matchesRole && matchesTeam && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "finalBid") return (b.finalBid || 0) - (a.finalBid || 0);
        if (sortBy === "role") return a.role.localeCompare(b.role);
        return 0;
      });
  }, [currentAuction, searchTerm, selectedRole, selectedTeam, selectedStatus, sortBy]);

  // Get unique teams for filter dropdown
  const uniqueTeams = useMemo(() => {
    if (!currentAuction?.teams) return [];
    const teams = currentAuction.teams.map(team => team.name);
    return ["All", ...teams];
  }, [currentAuction]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-[#202626]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0047AB]"></div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#202626] text-white">
        <div className="text-2xl text-red-500 mb-4">Error Loading Auction</div>
        <p className="mb-6">{error}</p>
        <button 
          onClick={() => navigate("/admin/auctions")}
          className="bg-[#0047AB] px-4 py-2 rounded"
        >
          Back to Auctions
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#202626] text-gray-100">
      <main className="pt-24 pb-12 max-w-7xl mx-auto px-4">
        {/* Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentAuction?.teams?.length > 0 ? (
            currentAuction.teams.map(team => (
              <div key={team.id} className="bg-[#202626] rounded-xl border border-[#0047AB] p-4 hover:shadow-lg transition-all">
                {/* Team Header */}
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={team.logo} 
                    alt={team.name} 
                    className="w-16 h-16 object-contain rounded-full border-2 border-[#0047AB] p-1"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-[#E8EAF6]">{team.name}</h3>
                    <p className="text-sm text-[#B0E0E6]">{team.owner || "Team Owner"}</p>
                  </div>
                </div>

                {/* Budget Information */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#B0E0E6]">Total Budget:</span>
                    <span className="text-lg font-bold">
                      ₹{
                        team.budget < 10000000
                          ? (team.budget / 100000).toFixed(2) + ' Lakh'
                          : (team.budget / 10000000).toFixed(2) + ' Cr'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#B0E0E6]">Remaining:</span>
                    <span className="text-lg font-bold text-emerald-400">
                      ₹{
                        team.remainingBudget < 10000000
                          ? (team.remainingBudget / 100000).toFixed(2) + ' Lakh'
                          : (team.remainingBudget / 10000000).toFixed(2) + ' Cr'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#B0E0E6]">Amount Spent:</span>
                    <span className="text-lg font-bold text-[#FF4500]">
                      ₹{
                        team.totalSpent < 10000000
                          ? (team.totalSpent / 100000).toFixed(2) + ' Lakh'
                          : (team.totalSpent / 10000000).toFixed(2) + ' Cr'
                      }
                    </span>
                  </div>
                </div>

                {/* Players and Roles */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#B0E0E6]">Total Players:</span>
                    <span className="font-medium">{team.playersCount}/25</span>
                  </div>
                  
                  <div className="space-y-1">
                    {Object.entries(team.roleCounts || {}).map(([role, count]) => (
                      <div key={role} className="flex justify-between text-sm">
                        <span className="text-[#B0E0E6]">{role}</span>
                        <span className="font-medium text-[#E8EAF6]">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-400">
              No teams data available
            </div>
          )}
        </div>

        {/* Player Table */}
        <div className="bg-[#2A2F36] rounded-lg p-6 mb-8 border border-[#0047AB]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Players */}
            <div>
              <input
                type="text"
                placeholder="Player name..."
                className="w-full px-4 py-2 border border-[#E8EAF6] rounded-lg bg-[#202626] text-[#E8EAF6]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort By */}
            <div>
              <select
                className="w-full px-4 py-2 border border-[#E8EAF6] rounded-lg bg-[#202626] text-[#E8EAF6]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="finalBid">Final Bid</option>
              </select>
            </div>

            {/* Filter by Role */}
            <div>
              <select
                className="w-full px-4 py-2 border border-[#E8EAF6] rounded-lg bg-[#202626] text-[#E8EAF6]"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-rounder">All-rounder</option>
                <option value="Wicket-keeper batsman">Wicket-keeper</option>
              </select>
            </div>

            {/* Filter by Team */}
            <div>
              <select
                className="w-full px-4 py-2 border border-[#E8EAF6] rounded-lg bg-[#202626] text-[#E8EAF6]"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                {uniqueTeams.map((team) => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div>
              <select
                className="w-full px-4 py-2 border border-[#E8EAF6] rounded-lg bg-[#202626] text-[#E8EAF6]"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="sold">Sold</option>
                <option value="unsold">Unsold</option>
              </select>
            </div>
          </div>
        </div>

        {/* Player Table */}
        <div className="bg-[#202626] rounded-lg shadow-md overflow-hidden border border-[#0047AB] max-h-[400px] min-w-full h-full overflow-y-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>  
          
          <div className="overflow-x-auto h-full scrollbar-hide">
              <table className="min-w-full">
                <thead className="bg-[#202626] sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#E8EAF6] uppercase">Player</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#E8EAF6] uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#E8EAF6] uppercase">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#E8EAF6] uppercase">Final Bid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#E8EAF6] uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#E8EAF6] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0047AB]">
                  {filteredPlayers.map((player) => (
                    <tr key={`${player.id}-${player.team}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-full object-cover" src={player.imageUrl} alt={player.name} />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[#E8EAF6]">
                              {player.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs rounded-full bg-[#0047AB]/10 text-[#0047AB]">
                          {player.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E8EAF6]">
                        {player.team || "Unsold"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-400">
                        {player.finalBid ? (
                          `₹${
                            player.finalBid < 10000000
                              ? (player.finalBid / 100000).toFixed(2) + ' L'
                              : (player.finalBid / 10000000).toFixed(2) + ' Cr'
                          }`
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs rounded-full ${
                          player.auctionStatus === "sold" ? "bg-green-700" : "bg-red-700"
                        }`}>
                          {player.auctionStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {player.auctionStatus === "sold" && (
                          <button
                            onClick={() => setSelectedPlayer(player)}
                            className="text-[#0047AB] hover:text-[#FF4500]"
                          >
                            View Bid History
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>

        {/* Bid History Modal */}
        {selectedPlayer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#202626] rounded-lg p-6 w-full max-w-md border border-[#0047AB]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#E8EAF6]">Bid History</h2>
                <button onClick={() => setSelectedPlayer(null)} className="text-[#B0E0E6]">
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <img src={selectedPlayer.imageUrl} alt={selectedPlayer.name} className="w-16 h-16 rounded-full" />
                <div>
                  <h3 className="text-lg font-bold text-[#E8EAF6]">{selectedPlayer.name}</h3>
                  <p className="text-sm text-[#B0E0E6]">
                    {selectedPlayer.role} - {selectedPlayer.team}
                  </p>
                </div>
              </div>

              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide">
                {!selectedPlayer?.bidHistory || selectedPlayer.bidHistory.length === 0 ? (
                  <div className="text-center p-4 bg-[#2A2F36] rounded-lg">
                    <p className="text-lg font-bold text-red-400">No Bid History</p>
                    <p className="text-sm text-[#B0E0E6] mt-2">
                      This player did not receive any bids during the auction.
                    </p>
                  </div>
                ) : (
                  selectedPlayer.bidHistory.map((bid, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-[#2A2F36] rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img src={bid.teamLogo} alt={bid.teamName} className="w-12 h-12 rounded-full border-2 border-[#0047AB]" />
                        <div>
                          <p className="font-medium text-[#E8EAF6]">{bid.teamName}</p>
                          <p className="text-xs text-[#B0E0E6]">
                            {new Date(bid.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-emerald-400">
                        ₹{
                          bid.bidAmount < 10000000
                              ? (bid.bidAmount / 100000).toFixed(2) + ' L'
                              : (bid.bidAmount / 10000000).toFixed(2) + ' Cr'
                        }
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AuctionHistory;