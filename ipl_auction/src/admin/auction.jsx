import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlayers } from "../store/playerslice";
import {
  fetchAuctions,
  createAuction,
  updateAuctionStatus,
} from "../store/auctionslice";
import { Link } from "react-router-dom";

const Adminauction = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const { players, loading: playersLoading } = useSelector(
    (state) => state.player
  );
  const {
    auctions,
    loading: auctionsLoading,
    error,
  } = useSelector((state) => state.auction);

  useEffect(() => {
    dispatch(fetchPlayers());
    dispatch(fetchAuctions());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
  });

  // Check if there's any live auction
  const liveAuction = auctions?.find(
    (auction) => auction.status === "live" && auction.isLive
  );

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAuction = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.date || !formData.time) {
      alert("Please fill all required fields");
      return;
    }

    if (selectedPlayers.length === 0) {
      alert("Please select at least one player");
      return;
    }

    const newAuction = {
      auctionName: formData.name.trim(),
      date: formData.date,
      time: formData.time,
      selectedPlayers: selectedPlayers.map((player) => player.id),
      teams: [],
      Players: [],
      status: "upcoming",
      isLive: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await dispatch(createAuction(newAuction));
      setShowModal(false);
      setFormData({ name: "", date: "", time: "" });
      setSelectedPlayers([]);
      dispatch(fetchAuctions()); // Refresh the auctions list
    } catch (err) {
      console.error("Failed to create auction:", err);
      alert("Failed to create auction. Please try again.");
    }
  };

  const handleStartAuction = (id) => {
    if (!liveAuction) {
      dispatch(updateAuctionStatus({ id, status: "live", isLive: true }));
    }
  };

  const handlePlayerSelection = (player) => {
    setSelectedPlayers((prev) =>
      prev.some((p) => p.id === player.id)
        ? prev.filter((p) => p.id !== player.id)
        : [...prev, player]
    );
  };

  const handleSelectAllPlayers = (e) => {
    if (e.target.checked) {
      setSelectedPlayers(filteredPlayers);
    } else {
      setSelectedPlayers([]);
    }
  };

  // Filter auctions based on active tab
  const filteredAuctions = auctions?.filter((auction) => {
    switch (activeTab) {
      case "live":
        return auction.status === "live" && auction.isLive;
      case "upcoming":
        return auction.status === "upcoming" && !auction.isLive;
      case "completed":
        return auction.status === "completed";
      default:
        return false;
    }
  });

  if (auctionsLoading || playersLoading) {
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
    <div className="min-h-screen bg-[#202626] text-[#E8EAF6] pt-20 md:pt-25">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Auctions</h1>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 md:mt-0 bg-[#0047AB] hover:bg-[#003A8C] px-4 py-2 rounded text-white font-semibold transition-colors"
          >
            <i className="fas fa-plus mr-2"></i> Create Auction
          </button>
        </div>

        <div className="flex gap-4 mb-8 border-b border-[#B0E0E6]">
          {["live", "upcoming", "completed"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 px-2 font-medium transition-colors ${
                activeTab === tab
                  ? "text-[#0047AB] border-b-2 border-[#0047AB]"
                  : "text-[#B0E0E6] hover:text-[#E8EAF6]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Auctions
            </button>
          ))}
        </div>

        {liveAuction && activeTab !== "live" && activeTab !== "completed" && (
          <div className="mb-6 p-4 bg-[#0047AB]/20 border border-[#0047AB] rounded-lg flex items-center">
            <i className="fas fa-info-circle text-[#0047AB] mr-3"></i>
            <span>
              Auction "{liveAuction.auctionName}" is currently live. You cannot
              start new auctions until it's completed.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions?.length === 0 ? (
            <div className="col-span-full text-center py-12 text-[#B0E0E6]">
              <i className="fas fa-box-open text-4xl mb-4"></i>
              <p>No {activeTab} auctions found</p>
            </div>
          ) : (
            filteredAuctions?.map((auction) => (
              <div
                key={auction.id}
                className="bg-[#202626] rounded-lg p-4 md:p-6 border border-[#B0E0E6]"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold truncate">
                    {auction.auctionName}
                  </h3>
                  {auction.isLive && (
                    <span className="bg-[#FF4500]/20 text-[#FF4500] px-3 py-1 rounded-full text-xs font-medium flex items-center">
                      <i className="fas fa-circle text-xs mr-2 animate-pulse"></i>
                      Live
                    </span>
                  )}
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-[#B0E0E6]">
                    <i className="far fa-calendar-alt mr-2 w-5"></i>
                    <span>{auction.date}</span>
                  </div>
                  <div className="flex items-center text-[#B0E0E6]">
                    <i className="far fa-clock mr-2 w-5"></i>
                    <span>{auction.time}</span>
                  </div>
                  <div className="flex items-center text-[#B0E0E6]">
                    <i className="fas fa-gavel mr-2 w-5"></i>
                    <span>{auction.bidHistory?.length || 0} Total Bids</span>
                  </div>
                  <div className="flex items-center text-[#B0E0E6]">
                    <i className="fas fa-users mr-2 w-5"></i>
                    <span>{auction.selectedPlayers?.length || 0} Players</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {auction.status === "upcoming" && (
                    <button
                      onClick={() => handleStartAuction(auction.id)}
                      disabled={!!liveAuction}
                      className={`w-full py-2 rounded text-white font-semibold transition-colors flex items-center justify-center ${
                        liveAuction
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-[#0047AB] hover:bg-[#003A8C]"
                      }`}
                    >
                      <i className="fas fa-play mr-2"></i>
                      {liveAuction ? "Auction in Progress" : "Start Auction"}
                    </button>
                  )}
                  {auction.status === "live" && (
                    <Link to={`/admin/auction/auctionhandel/${auction.id}`}>
                      <button className="w-full bg-[#0047AB] hover:bg-[#003A8C] py-2 rounded text-white font-semibold transition-colors flex items-center justify-center">
                        <i className="fas fa-eye mr-2"></i> Manage Auction
                      </button>
                    </Link>
                  )}
                  {auction.status === "completed" && (
                    <Link to={`/admin/auction/history/${auction.id}`}>
                      <button className="w-full bg-[#0047AB] hover:bg-[#003A8C] py-2 rounded text-white font-semibold transition-colors flex items-center justify-center">
                        <i className="fas fa-history mr-2"></i> View History
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Auction Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center p-4 z-2">
            <div className="bg-[#2D3748] rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Create New Auction</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedPlayers([]);
                  }}
                  className="text-[#B0E0E6] hover:text-white"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleCreateAuction}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Auction Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#1A202C] rounded-lg px-4 py-2 text-white border border-[#3A4556] focus:border-[#0047AB] focus:outline-none"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full bg-[#1A202C] rounded-lg px-4 py-2 text-white border border-[#3A4556] focus:border-[#0047AB] focus:outline-none"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    className="w-full bg-[#1A202C] rounded-lg px-4 py-2 text-white border border-[#3A4556] focus:border-[#0047AB] focus:outline-none"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPlayerModal(true)}
                  className="w-full bg-[#0047AB] hover:bg-[#003A8C] text-white py-2 rounded-lg transition-colors mb-4 flex items-center justify-center"
                >
                  <i className="fas fa-users mr-2"></i>
                  {selectedPlayers.length > 0
                    ? `${selectedPlayers.length} Players Selected`
                    : "Select Players"}
                </button>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedPlayers([]);
                    }}
                    className="flex-1 bg-[#4A5568] hover:bg-[#3C4556] text-white py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#0047AB] hover:bg-[#003A8C] text-white py-2 rounded-lg transition-colors"
                    disabled={selectedPlayers.length === 0}
                  >
                    Create Auction
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Player Selection Modal */}
        {showPlayerModal && (
          <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#2D3748] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Select Players</h2>
                <button
                  onClick={() => setShowPlayerModal(false)}
                  className="text-[#B0E0E6] hover:text-white"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-[#B0E0E6]"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search players..."
                  className="w-full bg-[#1A202C] rounded-lg pl-10 pr-4 py-2 text-white border border-[#3A4556] focus:border-[#0047AB] focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="selectAll"
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-[#0047AB] focus:ring-[#0047AB]"
                  checked={
                    filteredPlayers.length > 0 &&
                    selectedPlayers.length === filteredPlayers.length
                  }
                  onChange={handleSelectAllPlayers}
                />
                <label htmlFor="selectAll" className="text-sm text-[#B0E0E6]">
                  Select All ({filteredPlayers.length} players)
                </label>
              </div>
              <div className="overflow-y-auto flex-1">
                {filteredPlayers.length === 0 ? (
                  <div className="text-center py-8 text-[#B0E0E6]">
                    No players found matching your search
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPlayers.map((player) => (
                      <div
                        key={player.id}
                        className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-center ${
                          selectedPlayers.some((p) => p.id === player.id)
                            ? "border-[#0047AB] bg-[#0047AB]/20"
                            : "border-[#3A4556] hover:border-[#0047AB]"
                        }`}
                        onClick={() => handlePlayerSelection(player)}
                      >
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">
                            {player.name}
                          </h3>
                          <p className="text-sm text-[#B0E0E6] truncate">
                            {player.player_role}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm text-[#B0E0E6]">Base Price</p>
                          <p className="font-medium">
                            {(player.auction_detail?.base_price || 0) / 100000}L
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="ml-3 h-4 w-4 rounded border-gray-300 text-[#0047AB] focus:ring-[#0047AB]"
                          checked={selectedPlayers.some(
                            (p) => p.id === player.id
                          )}
                          onChange={() => {}}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#3A4556]">
                <div className="text-[#B0E0E6]">
                  {selectedPlayers.length} players selected
                </div>
                <button
                  className="bg-[#0047AB] hover:bg-[#003A8C] text-white px-6 py-2 rounded-lg transition-colors"
                  onClick={() => setShowPlayerModal(false)}
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Adminauction;
