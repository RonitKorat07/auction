import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlayers } from '../store/playerslice'; // Import the async thunk

// const Display = () => {
//   const dispatch = useDispatch();

//   // Access Redux state
//   const { players, loading, error } = useSelector((state) => state.player);

//   // Fetch players when the component mounts
//   useEffect(() => {
//     dispatch(fetchPlayers());
//   }, [dispatch]);

//   return (

//     <div className="h-auto bg-[#202626] flex justify-center items-center pt-20 w-full absolute">
//     <div className="container mx-auto px-4 py-8 flex justify-center w-full">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full max-w-6xl mx-auto">
//         {players.map((player, index) => (
//           <div key={index} className="bg-white/10 rounded-lg shadow-md overflow-hidden backdrop-blur-sm border border-white/20">
//             <img 
//               src={player.image} 
//               alt={player.name}
//               className="w-full h-90 object-cover"
//               onError={(e) => {
//                 e.target.src = 'https://via.placeholder.com/300x200?text=Player+Image'; // Fallback image
//               }}
//             />
//             <div className="p-4">
//               <h3 className="text-lg font-semibold text-white">{player.name}</h3>
//               <h3 className="text-lg font-semibold text-white">{player.id}</h3>
//               <h3 className="text-lg font-semibold text-white">{player.auction_detail?.base_price}</h3>
//               <p className="text-white/80">{player.player_role}</p>
//               <p className="text-sm text-white/60">{player.country}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>


//   );
// };

// export default Display;

import React, { useState } from "react";

const Display = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedPlayer, setSelectedPlayer] = useState(null);


  const dispatch = useDispatch();

  // Access Redux state
  const { players, loading, error } = useSelector((state) => state.player);

  // Fetch players when the component mounts
  useEffect(() => {
    dispatch(fetchPlayers());
  }, [dispatch]);
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredPlayers = players
    .filter((player) => {
      const nameMatch = player.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const statusMatch =
        selectedStatus === "All" || player.player_role == selectedStatus;
      return nameMatch && statusMatch;
    })
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (typeof a[sortField] === "string") {
        return direction * a[sortField].localeCompare(b[sortField]);
      }
      return direction * (a[sortField] - b[sortField]);
    });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#202626] to-[#1a1f1f]">
      <div className="pt-20 min-h-screen bg-cover bg-fixed">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search players..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-blue-500 focus:border-blue-600 focus:ring-2 bg-white/10 focus:ring-blue-500 text-white backdrop-blur-sm transition-all"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">

              <select
                className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-blue-500 bg-[#202626] text-white backdrop-blur-sm transition-all focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <option value="All">All Players</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowlers</option>
                <option value="All-rounder">All Rounders</option>
              </select>
            </div>
          </div>

          <div className="rounded-lg shadow-2xl p-4 sm:p-8 text-gray-200 bg-white/5 backdrop-blur-sm">
            {/* Featured Player Card */}
            <div className="mb-8 bg-transparent rounded-xl p-6 sm:p-8 text-white relative h-10 justify-center flex">
              <h1 className=" absolute text-[30px] lg:text-[50px] md:text-[40px] top-0 text-gray-200 font-serif">IPL PLAYERS</h1>
            </div>

            {/* Players Table */}
            <div className="rounded-xl overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr className="text-gray-200 bg-darkgray/50 backdrop-blur-sm">
                    <th className="px-6 py-3 text-center text-l font-medium text-gray-300 uppercase tracking-wider w-1/6 cursor-pointer hover:text-blue-400 transition-colors" onClick={() => handleSort("id")}>
                      ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-3 text-center text-l font-medium text-gray-300 uppercase tracking-wider w-1/6 cursor-pointer hover:text-blue-400 transition-colors" onClick={() => handleSort("name")}>
                      Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-3 text-center text-l font-medium text-gray-300 uppercase tracking-wider w-1/6 cursor-pointer hover:text-blue-400 transition-colors">
                      Batting Style
                    </th>
                    <th className="px-6 py-3 text-center text-l font-medium text-gray-300 uppercase tracking-wider w-1/6 cursor-pointer hover:text-blue-400 transition-colors">
                      Bowling Style
                    </th>
                    <th className="px-6 py-3 text-center text-l font-medium text-gray-300 uppercase tracking-wider w-1/6 cursor-pointer hover:text-blue-400 transition-colors">
                      High Score
                    </th>
                    <th className="px-6 py-3 text-center text-l font-medium text-gray-300 uppercase tracking-wider w-1/6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/5 divide-y divide-gray-700">
                  {filteredPlayers.map((player) => (
                    <tr key={player.id} className="hover:bg-white/10 transition-all">
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{player.id}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex justify-left items-center">
                          <img className="h-15 w-15 rounded-full object-cover" src={player.image} alt={player.name} />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-300">{player.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">{player.batting_style}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">{player.bowling_style}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {player.player_role === "Batsman" || player.player_role === "Wicket-keeper batsman" ||
                          (player.player_role === "All-rounder" && player?.state?.ipl?.batting?.high_score >= 50)
                          ? player?.state?.ipl?.batting?.high_score
                          : player?.state?.ipl?.bowling?.best_bowling || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                      <button
                      className="text-gray-400 hover:text-gray-300 p-2 transition-colors"
                      onClick={() => setSelectedPlayer(player)}
                    >
                      View
                    </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
             
            </div>
            
          </div>
          {/* {selectedPlayer && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgb(0,0,0,0.5)] bg-opacity-100">
          <div className="bg-[#3A3F44] p-6 rounded-lg w-[80%] h-130 text-white relative flex ">
            <button className="absolute top-2 right-2 text-xl" onClick={() => setSelectedPlayer(null)}>✖</button>
            <img className="w-60 h-60 rounded-full  my-4 " src={selectedPlayer.image} alt={selectedPlayer.name} />
            <h2 className="text-xl font-bold ">NAME : {selectedPlayer.name}</h2>
              <p><strong>Role:</strong> {selectedPlayer.player_role}</p>
              <p><strong>Country:</strong> {selectedPlayer.country}</p>
              <p><strong>Batting Style:</strong> {selectedPlayer.batting_style}</p>
              <p><strong>Bowling Style:</strong> {selectedPlayer.bowling_style}</p>
              <p><strong>High Score:</strong> {selectedPlayer?.state?.ipl?.batting?.high_score || "N/A"}</p>
          </div>
        </div>
      )} */}
      {selectedPlayer && (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
<div className="bg-[#202626] border border-gray-700 rounded-xl p-8 max-w-6xl w-full mx-4">
  <div className="flex justify-between items-start mb-6">
    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
      {selectedPlayer.name} - Player Profile
    </h2>
    <button
      onClick={() => setSelectedPlayer(null)}
      className="text-gray-400 hover:text-white transition-colors"
    >
      close
    </button>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          <h3 className="text-lg font-semibold mb-3 text-purple-400">Player Info</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Team</span>
              <span className="text-white">{selectedPlayer.auction_detail.team == "" ? "N/A" : selectedPlayer.auction_detail.team}</span>
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
    <div className="md:col-span-2 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#2A3131] p-6 rounded-lg text-center">
          <i className="fas fa-cricket-bat-ball text-4xl text-purple-500 mb-2"></i>
          <p className="text-2xl font-bold text-white">{selectedPlayer?.state?.ipl?.batting?.match}</p>
          <p className="text-sm text-gray-400">Total Matches</p>
        </div>
        <div className="bg-[#2A3131] p-6 rounded-lg text-center">
          <i className="fas fa-running text-4xl text-blue-500 mb-2"></i>
          <p className="text-2xl font-bold text-white">{selectedPlayer?.state?.ipl?.batting?.runs}</p>
          <p className="text-sm text-gray-400">Total Runs</p>
        </div>
        <div className="bg-[#2A3131] p-6 rounded-lg text-center">
          <i className="fas fa-bullseye text-4xl text-green-500 mb-2"></i>
          <p className="text-2xl font-bold text-white">{selectedPlayer?.state?.ipl?.bowling?.wicket}</p>
          <p className="text-sm text-gray-400">Total Wickets</p>
        </div>
      </div>
      <div className="bg-[#2A3131] p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-purple-400">Key Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* {selectedPlayer.achievements.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-3 bg-[#202626] p-3 rounded-lg">
              <i className="fas fa-trophy text-yellow-500 text-xl"></i>
              <span className="text-white">{achievement}</span>
            </div>
          ))} */}
        </div>
      </div>
      <div className="bg-[#2A3131] p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-purple-400">Performance Radar</h3>
        <div id="statsChart" style={{ width: '100%', height: '300px' }}></div>
      </div>
    </div>
  </div>
</div>
</div>
)}
        </div>
      </div>
    </div>
    
  );
};

export default Display;
