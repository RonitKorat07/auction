import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlayers } from "../store/playerslice";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const PlayerList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  const dispatch = useDispatch();
  const { players, loading, error } = useSelector((state) => state.player);

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
        selectedStatus === "All" || player.player_role === selectedStatus;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#0047AB]"></div>
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

  return (
    <div className="min-h-screen w-full bg-[#202626]">
      <div className="pt-20 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search players..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#0047AB] focus:border-[#0047AB] focus:ring-2 bg-[#202626] focus:ring-[#0047AB] text-[#E8EAF6] transition-all"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link
                to="/addplayer"
                className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-[#0047AB] bg-[#202626] text-[#E8EAF6] transition-all hover:bg-[#0047AB] hover:text-[#E8EAF6] focus:ring-2 focus:ring-[#0047AB] text-center"
              >
                Add Player
              </Link>
              <select
                className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-[#0047AB] bg-[#202626] text-[#E8EAF6] transition-all focus:ring-2 focus:ring-[#0047AB]"
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

          <div className="rounded-lg shadow-2xl p-4 sm:p-8 text-[#E8EAF6] bg-[#202626] border border-[#0047AB]">
            <div className="mb-8 rounded-xl p-6 sm:p-8 relative h-10 justify-center flex">
              <h1 className="absolute text-[30px] lg:text-[50px] md:text-[40px] top-0 text-[#B0E0E6] font-serif">
                PLAYERS
              </h1>
            </div>

            <div className="rounded-xl overflow-x-auto">
              <table className="min-w-full divide-y divide-[#0047AB]/30">
                <thead>
                  <tr className="text-[#E8EAF6] bg-[#202626]">
                    <th
                      className="px-6 py-3 text-center text-l font-medium uppercase tracking-wider w-1/6 cursor-pointer hover:text-[#B0E0E6] transition-colors"
                      onClick={() => handleSort("id")}
                    >
                      ID{" "}
                      {sortField === "id" &&
                        (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-6 py-3 text-center text-l font-medium uppercase tracking-wider w-1/6 cursor-pointer hover:text-[#B0E0E6] transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      Name{" "}
                      {sortField === "name" &&
                        (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-3 text-center text-l font-medium uppercase tracking-wider w-1/7 cursor-pointer hover:text-[#B0E0E6] transition-colors">
                      Batting Style
                    </th>
                    <th className="px-6 py-3 text-center text-l font-medium uppercase tracking-wider w-1/7 cursor-pointer hover:text-[#B0E0E6] transition-colors">
                      Bowling Style
                    </th>
                    <th className="px-6 py-3 text-center text-l font-medium uppercase tracking-wider w-1/7 cursor-pointer hover:text-[#B0E0E6] transition-colors">
                      Best Performance
                    </th>
                    <th className="px-6 py-3 text-center text-l font-medium uppercase tracking-wider w-1/7">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#202626] divide-y divide-[#0047AB]/30">
                  {filteredPlayers.map((player) => (
                    <tr
                      key={player.id}
                      className="hover:bg-[#202626]/80 transition-all"
                    >
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-[#E8EAF6]">
                        {player.id}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex justify-left items-center">
                          <img
                            className="h-20 w-20 rounded-full object-cover border-2 border-[#0047AB]"
                            src={player.image}
                            alt={player.name}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[#E8EAF6]">
                              {player.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-[#E8EAF6]">
                        {player.batting_style}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-wrap text-[#E8EAF6]">
                        {player.bowling_style || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-[#E8EAF6]">
                        {player.player_role === "Batsman" ||
                        player.player_role === "Wicket-keeper batsman" ||
                        (player.player_role === "All-rounder" &&
                          player?.state?.ipl?.batting?.high_score >= 50)
                          ? player?.state?.ipl?.batting?.high_score
                          : player?.state?.ipl?.bowling?.best_bowling || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm">
                        <div className="flex justify-center space-x-2">
                          <Link
                            to={`/playerprofile/${player.id}`}
                            className="text-[#0047AB] hover:text-[#B0E0E6] p-2 transition-colors"
                            title="View Player"
                          >
                            <FaEye />
                          </Link>
                          <button
                            className="text-[#0047AB] hover:text-[#B0E0E6] p-2 transition-colors"
                            title="Edit Player"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-[#FF4500] hover:text-[#B0E0E6] p-2 transition-colors"
                            title="Delete Player"
                          >
                            <FaTrash />
                          </button>
                        </div>
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

export default PlayerList;
