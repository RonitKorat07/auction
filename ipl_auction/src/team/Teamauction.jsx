import React, { useState } from "react";
import { Link } from "react-router-dom";

const Teamauction = () => {
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
                  {auction.status === "live" && (
                    <Link
                      to={"/team/joinauction"}
                      className="w-full bg-[#0047AB] hover:bg-[#003A8C] py-2 px-5 rounded text-white font-semibold "
                    >
                      <i className="fas fa-eye mr-2 "></i>
                      Join Auction
                    </Link>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Teamauction;
