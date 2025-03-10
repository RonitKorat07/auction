import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import { FaTimes } from "react-icons/fa"; // Importing the close icon from react-icons

// Mock Data
const bidHistory = [
  { team: "Royal Challengers", amount: 850000, time: "10:15 AM" },
  { team: "Mumbai Indians", amount: 800000, time: "10:14 AM" },
  { team: "Chennai Super Kings", amount: 750000, time: "10:13 AM" },
  { team: "Royal Challengers", amount: 700000, time: "10:12 AM" },
  { team: "Mumbai Indians", amount: 650000, time: "10:11 AM" },
];

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

const players = [
  {
    id: 1,
    name: "Christopher Anderson",
    basePrice: 200000,
    finalBid: 850000,
    role: "Batsman",
    imageUrl:
      "https://public.readdy.ai/ai/img_res/8126475ef044edf2a503db1efd68e3db.jpg",
    team: "Royal Challengers",
  },
  {
    id: 2,
    name: "James Richardson",
    basePrice: 150000,
    finalBid: 750000,
    role: "Bowler",
    imageUrl:
      "https://public.readdy.ai/ai/img_res/95997fa4c6e9f45ecf631bfead93518f.jpg",
    team: "Royal Challengers",
  },
  {
    id: 3,
    name: "Michael Thompson",
    basePrice: 300000,
    finalBid: 1200000,
    role: "All-rounder",
    imageUrl:
      "https://public.readdy.ai/ai/img_res/d73ab2d2c70c3b247676ac54a046599e.jpg",
    team: "Royal Challengers",
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
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Search players..."
            className="w-full pl-10 pr-4 py-2 border border-[#E8EAF6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0047AB] bg-[#202626] text-[#E8EAF6] placeholder-[#B0E0E6]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0E0E6]"></i>
        </div>
      </div>
      <div className="flex items-center space-x-4">
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
  </div>
);

const PlayerTable = ({ filteredPlayers, setSelectedPlayer }) => (
  <div className="bg-[#202626] backdrop-blur-sm rounded-lg shadow-md overflow-hidden border border-[#0047AB]">
    <table className="w-full">
      <thead className="bg-[#202626]">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-[#E8EAF6] uppercase tracking-wider">
            Player
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-[#E8EAF6] uppercase tracking-wider">
            Role
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-[#E8EAF6] uppercase tracking-wider">
            Team
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-[#E8EAF6] uppercase tracking-wider">
            Base Price
          </th>
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
          <tr
            key={player.id}
            // className="hover:bg-[#0047AB] transition-all duration-300"
          >
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
            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#E8EAF6]">
              ${player.basePrice.toLocaleString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-400">
              ${player.finalBid.toLocaleString()}
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
);

const BidHistoryModal = ({ selectedPlayer, setSelectedPlayer }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-[#202626] backdrop-blur-sm rounded-lg p-6 max-w-2xl w-full mx-4 border border-[#0047AB]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#E8EAF6]">Bid History</h2>
        <button
          onClick={() => setSelectedPlayer(null)}
          className="text-[#B0E0E6] hover:text-[#E8EAF6] !rounded-button whitespace-nowrap hover:cursor-pointer"
        >
          <FaTimes size={20} /> {/* Using the React icon for close */}
        </button>
      </div>
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={selectedPlayer.imageUrl}
          alt={selectedPlayer.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-bold text-[#E8EAF6]">
            {selectedPlayer.name}
          </h3>
          <p className="text-sm text-[#B0E0E6]">
            {selectedPlayer.role} - {selectedPlayer.team}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {bidHistory.map((bid, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-[#202626] rounded-lg"
          >
            <div>
              <p className="font-medium text-[#E8EAF6]">{bid.team}</p>
              <p className="text-sm text-[#B0E0E6]">{bid.time}</p>
            </div>
            <div className="text-lg font-bold text-emerald-400">
              ${bid.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Main App Component
const AuctionHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const chartRef = useRef(null);

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

  const filteredPlayers = players
    .filter(
      (player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedRole === "All" || player.role === selectedRole) &&
        (selectedTeam === null ||
          player.team === teams.find((t) => t.id === selectedTeam)?.name)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "basePrice":
          return b.basePrice - a.basePrice;
        case "finalBid":
          return b.finalBid - a.finalBid;
        default:
          return 0;
      }
    });

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
