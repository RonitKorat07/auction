import React, { useState } from "react";

const Adminauction = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("live");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const players = [
    {
      id: 1,
      name: "Mitchell Starc",
      role: "Bowler",
      basePrice: "$200,000",
      image:
        "https://public.readdy.ai/ai/img_res/284a6c97bfae6d5bcd0f423fb26cd005.jpg",
    },
    {
      id: 2,
      name: "Ben Stokes",
      role: "All-rounder",
      basePrice: "$250,000",
      image:
        "https://public.readdy.ai/ai/img_res/ddd07055bf9047ca4e0d3519073fa777.jpg",
    },
  ];

  const [auctions, setAuctions] = useState([
    {
      id: 1,
      name: "IPL 2025 Mega Auction",
      date: "2025-02-28",
      time: "04:44 PM",
      totalBids: 156,
      isLive: true,
      status: "live",
      players: ["Virat Kohli", "Steve Smith", "Kane Williamson", "Babar Azam"],
    },
    {
      id: 2,
      name: "Big Bash League Player Draft",
      date: "2025-02-28",
      time: "05:30 PM",
      totalBids: 89,
      isLive: true,
      status: "live",
      players: [
        "David Warner",
        "Mitchell Starc",
        "Glenn Maxwell",
        "Pat Cummins",
      ],
    },
    {
      id: 3,
      name: "Caribbean Premier League Auction",
      date: "2025-02-28",
      time: "06:15 PM",
      totalBids: 124,
      isLive: true,
      status: "live",
      players: [
        "Chris Gayle",
        "Andre Russell",
        "Kieron Pollard",
        "Dwayne Bravo",
      ],
    },
    {
      id: 4,
      name: "The Hundred Draft 2025",
      date: "2025-03-15",
      time: "02:00 PM",
      totalBids: 0,
      isLive: false,
      status: "upcoming",
      players: ["Jos Buttler", "Ben Stokes", "Joe Root", "Eoin Morgan"],
    },
    {
      id: 5,
      name: "PSL 2025 Draft",
      date: "2025-03-20",
      time: "03:30 PM",
      totalBids: 0,
      isLive: false,
      status: "upcoming",
      players: [
        "Shaheen Afridi",
        "Mohammad Rizwan",
        "Shadab Khan",
        "Fakhar Zaman",
      ],
    },
    {
      id: 6,
      name: "T20 Global League Auction 2024",
      date: "2024-12-15",
      time: "01:00 PM",
      totalBids: 245,
      isLive: false,
      status: "completed",
      players: [
        "Rohit Sharma",
        "AB de Villiers",
        "Mitchell Marsh",
        "Trent Boult",
      ],
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    playerList: "",
  });

  const handleCreateAuction = (e) => {
    e.preventDefault();
    const newAuction = {
      id: auctions.length + 1,
      name: formData.name,
      date: formData.date,
      time: formData.time,
      totalBids: 0,
      isLive: false,
      status: "upcoming",
      players: formData.playerList
        .split("\n")
        .filter((player) => player.trim() !== ""),
    };
    setAuctions([...auctions, newAuction]);
    setShowModal(false);
    setFormData({ name: "", date: "", time: "", playerList: "" });
  };

  const handleStartAuction = (id) => {
    const updatedAuctions = auctions.map((auction) =>
      auction.id === id ? { ...auction, status: "live", isLive: true } : auction
    );
    setAuctions(updatedAuctions);
  };

  const handlePlayerSelection = (player) => {
    if (selectedPlayers.some((p) => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  return (
    <div className="min-h-screen bg-[#202626] text-[#E8EAF6] pt-25 md:pt-25">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Auctions</h1>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 md:mt-0 bg-[#0047AB] hover:bg-[#003A8C] px-4 py-2 rounded text-white font-semibold"
          >
            <i className="fas fa-plus mr-2"></i>
            Create Auction
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#B0E0E6]">
          {["live", "upcoming", "completed"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 px-2 font-medium ${
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

        {/* Auction Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions
            .filter((auction) => auction.status === activeTab)
            .map((auction) => (
              <div
                key={auction.id}
                className="bg-[#202626] rounded-lg p-4 md:p-6 border border-[#B0E0E6]"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg md:text-xl font-semibold">
                    {auction.name}
                  </h3>
                  {auction.isLive && (
                    <span className="bg-[#FF4500]/20 text-[#FF4500] px-2 py-1 rounded-full text-xs font-medium">
                      <i className="fas fa-circle text-xs mr-1"></i>
                      Live
                    </span>
                  )}
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-[#B0E0E6]">{auction.date}</p>
                  <p className="text-[#B0E0E6]">{auction.time}</p>
                  <p className="text-[#B0E0E6]">
                    {auction.totalBids} Total Bids
                  </p>
                  <p className="text-[#B0E0E6]">
                    {selectedPlayers.length} Players Selected
                  </p>
                </div>
                <div className="space-y-2">
                  {auction.status === "upcoming" && (
                    <button
                      onClick={() => handleStartAuction(auction.id)}
                      className="w-full bg-[#0047AB] hover:bg-[#003A8C] py-2 rounded text-white font-semibold"
                    >
                      <i className="fas fa-play mr-2"></i>
                      Start Auction
                    </button>
                  )}
                  {auction.status === "live" && (
                    <button className="w-full bg-[#0047AB] hover:bg-[#003A8C] py-2 rounded text-white font-semibold ">
                      <i className="fas fa-eye mr-2"></i>
                      View Auction
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Create Auction Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-[#202626] rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Create New Auction</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Auction Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#202626] rounded-lg px-4 py-2 text-white border-none"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full bg-[#202626] rounded-lg px-4 py-2 text-white border-none"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <input
                    type="time"
                    className="w-full bg-[#202626] rounded-lg px-4 py-2 text-white border-none"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                  />
                </div>
                <button
                  className="w-full bg-[#0047AB] hover:bg-[#003A8C] text-white py-2 rounded-lg transition-colors mt-4"
                  onClick={() => setShowPlayerModal(true)}
                >
                  Select Players
                </button>
                <div className="flex space-x-4 mt-6">
                  <button
                    className="flex-1 bg-[#B0E0E6] hover:bg-[#A0C4C8] text-white py-2 rounded-lg transition-colors"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 bg-[#0047AB] hover:bg-[#003A8C] text-white py-2 rounded-lg transition-colors"
                    onClick={handleCreateAuction}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Player Selection Modal */}
        {showPlayerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-[#202626] rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold">Select Players</h2>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedPlayers.length === players.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPlayers(players);
                        } else {
                          setSelectedPlayers([]);
                        }
                      }}
                    />
                    <span className="text-sm text-[#B0E0E6]">Select All</span>
                  </label>
                </div>
                <button
                  className="text-[#B0E0E6] hover:text-[#E8EAF6]"
                  onClick={() => setShowPlayerModal(false)}
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search players..."
                  className="w-full bg-[#202626] rounded-lg pl-10 pr-4 py-2 text-white border-none"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0E0E6]"></i>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center p-4 hover:bg-[#B0E0E6]/20 rounded-lg cursor-pointer"
                    onClick={() => handlePlayerSelection(player)}
                  >
                    <img
                      src={player.image}
                      alt={player.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium">{player.name}</h3>
                      <p className="text-sm text-[#B0E0E6]">{player.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#B0E0E6]">Base Price</p>
                      <p className="font-medium">{player.basePrice}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedPlayers.some((p) => p.id === player.id)}
                      className="ml-4"
                      onChange={() => handlePlayerSelection(player)}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-6">
                <p>{selectedPlayers.length} players selected</p>
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
