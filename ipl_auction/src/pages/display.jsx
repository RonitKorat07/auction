import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlayers } from '../store/playerslice';

import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Display = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");


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
                      Best Performance
                    </th>
                    <th className="px-6 py-3 text-center text-l font-medium text-gray-300 uppercase tracking-wider w-1/10">
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/5 divide-y divide-gray-700">
                  {filteredPlayers.map((player) => (
                    <tr key={player.id} className="hover:bg-white/10 transition-all">
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-300">{player.id}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex justify-left items-center">
                          <img className="h-20 w-20 rounded-full object-cover" src={player.image} alt={player.name} />
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

                        <Link
                          to={`/playerprofile/${player.id}`}
                          style={{ color: "white" }}
                          className="text-gray-400 hover:text-gray-300 p-2 transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>

          </div>



        </div>
      </div>
    </div>

  );
};

export default Display;
