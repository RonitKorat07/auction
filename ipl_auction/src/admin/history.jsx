import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import { FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { history_fetchPlayers } from "../store/auction_historyslice";

const teams = [
  {
    id: 1,
    name: "Royal Challengers",
    logo: "https://public.readdy.ai/ai/img_res/fd3489e027e32e36c0a79b189eded3fd.jpg",
    totalBudget: 10000000,
    spentBudget: 7500000,
    totalPlayers: 15,
    playersByRole: {
      Batsman: 5,
      Bowler: 4,
      "All-rounder": 4,
      "Wicket-keeper": 2,
    },
  },
  {
    id: 2,
    name: "Mumbai Indians",
    logo: "https://public.readdy.ai/ai/img_res/bf44ac4c7a42296cf22c5ed09ce499e1.jpg",
    totalBudget: 10000000,
    spentBudget: 8200000,
    totalPlayers: 16,
    playersByRole: {
      Batsman: 6,
      Bowler: 5,
      "All-rounder": 3,
      "Wicket-keeper": 2,
    },
  },
  {
    id: 3,
    name: "Chennai Super Kings",
    logo: "https://public.readdy.ai/ai/img_res/55fb85af3d2b10b2d444daf84c08cb0f.jpg",
    totalBudget: 10000000,
    spentBudget: 6800000,
    totalPlayers: 14,
    playersByRole: {
      Batsman: 4,
      Bowler: 5,
      "All-rounder": 3,
      "Wicket-keeper": 2,
    },
  },
];

const TeamCard = ({ team }) => (
  <div className="bg-[#202626] rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#0047AB]/20 border border-[#0047AB] p-4">
    <div className="flex flex-col items-center mb-4">
      <img
        src={team.logo}
        alt={team.name}
        className="w-32 h-32 object-contain mb-2"
      />
      <h2 className="text-xl font-bold text-[#E8EAF6]">{team.name}</h2>
    </div>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-sm text-[#B0E0E6]">Total Players</p>
        <p className="text-2xl font-bold text-[#E8EAF6]">{team.totalPlayers}</p>
      </div>
      <div>
        <p className="text-sm text-[#B0E0E6]">Spent Budget</p>
        <p className="text-2xl font-bold text-[#FF4500]">
          ${team.spentBudget.toLocaleString()}
        </p>
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-sm font-medium text-[#B0E0E6] mb-2">
        Player Distribution
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(team.playersByRole).map(([role, count]) => (
          <div key={role} className="flex justify-between text-sm">
            <span className="text-[#B0E0E6]">{role}</span>
            <span className="font-medium text-[#E8EAF6]">{count}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Filters = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  selectedRole,
  setSelectedRole,
  selectedTeam,
  setSelectedTeam,
}) => (
  <div className="bg-[#202626] backdrop-blur-sm rounded-lg p-6 mb-8 border border-[#0047AB]">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search players..."
            className="w-full pl-4 pr-4 py-2 border border-[#E8EAF6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047AB] bg-[#202626] text-[#E8EAF6] placeholder-[#B0E0E6]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0E0E6]"></i>
        </div>
      </div>
      <select
        className="border border-[#E8EAF6] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0047AB] bg-[#202626] text-[#E8EAF6] hover:cursor-pointer"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="name">Sort by Name</option>
        <option value="basePrice">Sort by Base Price</option>
        <option value="finalBid">Sort by Final Bid</option>
      </select>
      <select
        className="border border-[#E8EAF6] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0047AB] bg-[#202626] text-[#E8EAF6] hover:cursor-pointer"
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
      >
        <option value="All">All Roles</option>
        <option value="Batsman">Batsman</option>
        <option value="Bowler">Bowler</option>
        <option value="All-rounder">All-rounder</option>
        <option value="Wicket-keeper">Wicket-keeper</option>
      </select>
      <select
        className="border border-[#E8EAF6] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0047AB] bg-[#202626] text-[#E8EAF6] hover:cursor-pointer"
        value={selectedTeam || ""}
        onChange={(e) =>
          setSelectedTeam(e.target.value ? Number(e.target.value) : null)
        }
      >
        <option value="">All Teams</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const PlayerTable = ({ filteredPlayers, setSelectedPlayer }) => (
  <div className="bg-[#202626] backdrop-blur-sm rounded-lg shadow-md overflow-hidden border border-[#0047AB] max-h-[400px] overflow-y-auto">
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-[#202626] ">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#E8EAF6] uppercase tracking-wider ">
              Player
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#E8EAF6] uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#E8EAF6] uppercase tracking-wider">
              Team
            </th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-[#E8EAF6] uppercase tracking-wider">
              Base Price
            </th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-[#E8EAF6] uppercase tracking-wider">
              Final Bid
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#E8EAF6] uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#0047AB]">
          {filteredPlayers.map((player) => (
            <tr key={player.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={player.imageUrl}
                      alt={player.name}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-[#E8EAF6]">
                      {player.name}
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          player.auctionStatus === "sold"
                            ? " bg-[#0047AB]/10 text-green-700"
                            : " bg-[#0047AB]/10 text-red-700"
                        }`}
                      >
                        {player.auctionStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#0047AB]/10 text-[#0047AB]">
                  {player.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E8EAF6]">
                {player.team}
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E8EAF6]">
                ${player.basePrice?.toLocaleString() || "0"}
              </td> */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-400">
                {player.finalBid?.toLocaleString() || "0"} L
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B0E0E6]">
                <button
                  onClick={() => setSelectedPlayer(player)}
                  className="text-[#0047AB] hover:text-[#FF4500] transition-colors duration-300 !rounded-button whitespace-nowrap hover:cursor-pointer"
                >
                  View Bid History
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
const BidHistoryModal = ({ selectedPlayer, setSelectedPlayer }) => {
  const isUnsold =
    !selectedPlayer?.bidHistory ||
    (Array.isArray(selectedPlayer.bidHistory) &&
      selectedPlayer.bidHistory.length === 0);

  return (
    <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#202626] backdrop-blur-sm rounded-lg p-4 md:p-6 w-full max-w-md md:max-w-2xl mx-4 border border-[#0047AB]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#E8EAF6]">
            Bid History
          </h2>
          <button
            onClick={() => setSelectedPlayer(null)}
            className="text-[#B0E0E6] hover:text-[#E8EAF6] !rounded-button whitespace-nowrap hover:cursor-pointer"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Player Info */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 md:mb-6">
          <img
            src={selectedPlayer?.imageUrl || ""}
            alt={selectedPlayer?.name || "Player"}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
          />
          <div className="text-center sm:text-left">
            <h3 className="text-base md:text-lg font-bold text-[#E8EAF6]">
              {selectedPlayer?.name || "Unknown Player"}
            </h3>
            <p className="text-xs md:text-sm text-[#B0E0E6]">
              {selectedPlayer?.role || "Unknown Role"} -{" "}
              {selectedPlayer?.team || "No Team"}
            </p>
          </div>
        </div>

        {/* Bid History Content */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
          {/* Custom scrollbar styling */}
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 4px;
            }
            div::-webkit-scrollbar-track {
              background: #2a2f36;
              border-radius: 10px;
            }
            div::-webkit-scrollbar-thumb {
              background: #0047ab;
              border-radius: 10px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #0066ff;
            }
          `}</style>

          {isUnsold ? (
            <div className="text-center p-3 md:p-4 bg-[#2A2F36] rounded-lg">
              <p className="text-base md:text-lg font-bold text-red-400">
                Player Unsold
              </p>
              <p className="text-xs md:text-sm text-[#B0E0E6] mt-1 md:mt-2">
                This player did not receive any bids during the auction.
              </p>
            </div>
          ) : Array.isArray(selectedPlayer.bidHistory) ? (
            selectedPlayer.bidHistory.map((bid, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-[#2A2F36] rounded-lg space-y-2 sm:space-y-0"
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <img
                    src={bid.teamLogo || "/default-team-logo.png"}
                    alt={bid.teamName || "Team"}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-contain border-2 border-[#0047AB] p-0.5 md:p-1"
                  />
                  <div>
                    <p className="text-sm md:text-base font-medium text-[#E8EAF6]">
                      {bid.teamName || "Unknown Team"}
                    </p>
                    <p className="text-xs text-[#B0E0E6]">
                      {new Date(bid.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-base md:text-lg font-bold text-emerald-400 sm:pl-4">
                  {bid.bidAmount?.toLocaleString() || "0"} L
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm md:text-base text-[#B0E0E6] py-3 md:py-4">
              No bid history data available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
const AuctionHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const chartRef = useRef(null);

  // Redux state management
  const dispatch = useDispatch();
  const { players, status, error } = useSelector(
    (state) => state.historyplayer
  );

  useEffect(() => {
    dispatch(history_fetchPlayers());
  }, [dispatch]);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const option = {
        animation: false,
        tooltip: { trigger: "item" },
        legend: { top: "5%", left: "center" },
        series: [
          {
            name: "Budget Distribution",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: { show: false, position: "center" },
            emphasis: {
              label: { show: true, fontSize: 20, fontWeight: "bold" },
            },
            labelLine: { show: false },
            data: [
              { value: 7500000, name: "Spent Budget" },
              { value: 2500000, name: "Remaining Budget" },
            ],
          },
        ],
      };
      chart.setOption(option);
    }
  }, []);

  // Safe filtering with null checks
  const filteredPlayers = (players || [])
    .filter((player) => {
      const playerName = player?.name?.toLowerCase() || "";
      const playerRole = player?.role || "";
      const playerTeam = player?.team || "";

      return (
        playerName.includes(searchTerm.toLowerCase()) &&
        (selectedRole === "All" || playerRole === selectedRole) &&
        (selectedTeam === null ||
          playerTeam === teams.find((t) => t.id === selectedTeam)?.name)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a?.name || "").localeCompare(b?.name || "");
        // case "basePrice":
        //   return (b?.basePrice || 0) - (a?.basePrice || 0);
        case "finalBid":
          return (b?.finalBid || 0) - (a?.finalBid || 0);
        default:
          return 0;
      }
    });

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#0047AB]"></div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-[#202626] text-gray-100 flex items-center justify-center">
        <div className="text-2xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#202626] text-gray-100">
      <main className="pt-24 pb-12 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
        />
        <PlayerTable
          filteredPlayers={filteredPlayers}
          setSelectedPlayer={setSelectedPlayer}
        />
        {selectedPlayer && (
          <BidHistoryModal
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
          />
        )}
      </main>
    </div>
  );
};

export default AuctionHistory;
