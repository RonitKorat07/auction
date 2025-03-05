import React, { useState, useEffect } from "react";
import { FaShieldAlt, FaWallet, FaUsers, FaPuzzlePiece } from "react-icons/fa";

const Auction = () => {
  const [currentBid, setCurrentBid] = useState(165000000);
  const [showBidModal, setShowBidModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [auctionStatus, setAuctionStatus] = useState("not-started"); // 'not-started', 'running', 'paused', 'ended'
  const [bidAmount, setBidAmount] = useState(currentBid); // Added state for bidAmount

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 30;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const teams = [
    {
      name: "Mumbai Indians",
      budget: "₹45.5 Cr",
      playersBought: 15,
      slotsLeft: 10,
    },
    {
      name: "Chennai Kings",
      budget: "₹38.8 Cr",
      playersBought: 18,
      slotsLeft: 7,
    },
    {
      name: "Delhi Capitals",
      budget: "₹52.2 Cr",
      playersBought: 12,
      slotsLeft: 13,
    },
    {
      name: "Royal Challengers",
      budget: "₹29.9 Cr",
      playersBought: 20,
      slotsLeft: 5,
    },
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
  ];

  const recentPurchases = [
    {
      name: "Shahrukh Khan",
      from: "Punjab Kings",
      price: "₹6 Crore",
      date: "February 25, 2024",
    },
    {
      name: "Vishnu Vinod",
      from: "Delhi Capitals",
      price: "₹50 Lakhs",
      date: "February 24, 2024",
    },
    {
      name: "Tymal Mills",
      from: "Rajasthan Royals",
      price: "₹1 Crore",
      date: "February 23, 2024",
    },
  ];

  const handleBid = () => {
    // Logic to handle the bid
    setShowBidModal(false);
  };

  return (
    <div className="min-h-screen bg-[#202626] w-full mt-6">
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-25">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Middle Column - Player Profile */}
          <div className="lg:col-span-8 w-full h-full">
            <div className="bg-[#2C2F32] rounded-lg shadow-lg overflow-hidden border-2 border-[#0047AB] h-full">
              <div className="flex flex-col sm:flex-row items-center justify-center p-4 sm:p-6">
                <img
                  src="https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1"
                  alt="Player in Action"
                  className="w-48 sm:w-60 h-auto mb-4 sm:mb-0 sm:mr-6 object-cover"
                />
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                    Hardik Pandya
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-200 mb-1">
                    All-rounder
                  </p>
                  <p className="text-sm sm:text-base text-gray-200">INDIA</p>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4  ">
                  {[
                    { label: "Matches", value: "125" },
                    { label: "Runs", value: "2,309" },
                    { label: "Wickets", value: "78" },
                    { label: "Strike Rate", value: "142.5" },
                    { label: "Batting Avg", value: "32.4" },
                    { label: "Economy", value: "8.24" },
                    { label: "Sixes", value: "112" },
                    { label: "Best Score", value: "91*" },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-[#2C2F32] rounded-lg p-3 text-center  "
                    >
                      <p className="text-sm sm:text-base text-gray-400 ">
                        {stat.label}
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <span className="text-lg sm:text-xl text-white">
                      Current Bid
                    </span>
                    <div className="bg-[#FF4500] text-white px-4 py-2 rounded-full flex items-center">
                      <span className="font-semibold">{timeLeft}s</span>
                    </div>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-[#0047AB]">
                    ₹{(currentBid / 100000).toFixed(2)} Crore
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Bid History */}
          <div className="lg:col-span-4 w-full h-full">
            <div className="bg-[#2C2F32] rounded-lg shadow-lg border border-[#0047AB] p-4 sm:p-6 h-full">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Bid History
              </h2>
              <div
                className="max-h-130 overflow-y-auto scrollbar-hide space-y-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {[
                  {
                    teamLogo:
                      "https://upload.wikimedia.org/wikipedia/en/4/4c/Chennai_Super_Kings_logo.png",
                    bidder: "Chennai Super Kings",
                    amount: "₹16.5 Crore",
                    time: "2 mins ago",
                  },
                  {
                    teamLogo:
                      "https://upload.wikimedia.org/wikipedia/en/6/6f/Royal_Challengers_Bangalore_logo.png",
                    bidder: "Royal Challengers Bangalore",
                    amount: "₹16.25 Crore",
                    time: "5 mins ago",
                  },
                  {
                    teamLogo:
                      "https://upload.wikimedia.org/wikipedia/en/8/8e/Kolkata_Knight_Riders_logo.png",
                    bidder: "Kolkata Knight Riders",
                    amount: "₹16 Crore",
                    time: "8 mins ago",
                  },
                  {
                    teamLogo:
                      "https://upload.wikimedia.org/wikipedia/en/3/3e/Delhi_Capitals_logo.png",
                    bidder: "Delhi Capitals",
                    amount: "₹15.75 Crore",
                    time: "12 mins ago",
                  },
                  {
                    teamLogo:
                      "https://upload.wikimedia.org/wikipedia/en/3/3e/Rajasthan_Royals_logo.png",
                    bidder: "Rajasthan Royals",
                    amount: "₹15.5 Crore",
                    time: "15 mins ago",
                  },
                  {
                    teamLogo:
                      "https://upload.wikimedia.org/wikipedia/en/3/3e/Rajasthan_Royals_logo.png",
                    bidder: "Rajasthan Royals",
                    amount: "₹15.5 Crore",
                    time: "15 mins ago",
                  },
                  {
                    teamLogo:
                      "https://upload.wikimedia.org/wikipedia/en/3/3e/Rajasthan_Royals_logo.png",
                    bidder: "Rajasthan Royals",
                    amount: "₹15.5 Crore",
                    time: "15 mins ago",
                  },
                  {
                    teamLogo:
                      "https://upload.wikimedia.org/wikipedia/en/3/3e/Rajasthan_Royals_logo.png",
                    bidder: "Rajasthan Royals",
                    amount: "₹15.5 Crore",
                    time: "15 mins ago",
                  },
                  {
                    teamLogo:
                      "https://upload.wikimedia.org/wikipedia/en/3/3e/Rajasthan_Royals_logo.png",
                    bidder: "Rajasthan Royals",
                    amount: "₹15.5 Crore",
                    time: "15 mins ago",
                  },
                  {
                    teamLogo:
                      "https://upload.wikimedia.org/wikipedia/en/3/3e/Rajasthan_Royals_logo.png",
                    bidder: "Rajasthan Royals",
                    amount: "₹15.5 Crore",
                    time: "15 mins ago",
                  },
                ].map((bid, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-[#202626] rounded-lg border border-blue-700 shadow-lg"
                  >
                    <img
                      src={bid.teamLogo}
                      alt={bid.bidder}
                      className="w-10 h-10 mr-3 rounded-full"
                    />
                    <div className="flex flex-col flex-grow ">
                      <p className="font-medium text-white text-sm">
                        {bid.bidder}
                      </p>
                    </div>
                    <span className="font-semibold text-[#B0E0E6] text-sm whitespace-nowrap">
                      {bid.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Purchases Section */}
        <div className="mt-8 bg-[#2C2F32] rounded-lg shadow-lg p-4 sm:p-6 border border-[#0047AB]">
          <h2 className="text-2xl font-semibold mb-6 text-white">
            Recent Purchases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPurchases.map((purchase, index) => (
              <div
                key={index}
                className="bg-[#2C2F32] rounded-lg overflow-hidden border border-[#0047AB] hover:shadow-xl transition-shadow"
              >
                <img
                  src={`https://readdy.ai/api/search-image?query=professional soccer player in manchester united red jersey celebrating goal victory moment dramatic stadium lighting&width=400&height=300&orientation=landscape&flag=912fa8b416ec5d3215e35a8d058b0af7`}
                  alt={purchase.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {purchase.name}
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "From", value: purchase.from },
                      {
                        label: "Transfer Fee",
                        value: purchase.price,
                        highlight: true,
                      },
                      { label: "Date", value: purchase.date },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-400">{item.label}</span>
                        <span
                          className={`font-medium ${
                            item.highlight ? "text-[#0047AB]" : "text-white"
                          }`}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teams Status */}
        <div className="mt-8 bg-[#2C2F32] rounded-lg shadow-lg p-4 sm:p-6 border border-[#0047AB]">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <FaShieldAlt className="text-[#0047AB]" />
            Teams Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {teams.map((team, index) => (
              <div
                key={index}
                className={`flex flex-col items-center bg-[#2C2F32] rounded-lg p-4 border border-[#0047AB] cursor-pointer hover:bg-[#0047AB]/10 transition-all ${
                  selectedTeam === team.name ? "ring-2 ring-[#0047AB]" : ""
                }`}
                onClick={() => setSelectedTeam(team.name)}
              >
                <img
                  src={`https://readdy.ai/api/search-image?query=modern minimalist cricket team logo design with ${team.name} theme, professional sports branding on dark background, centered composition&width=200&height=200&orientation=squarish`}
                  alt={team.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#0047AB] mb-4"
                />
                <h4 className="font-bold text-base sm:text-lg text-white text-center mb-4">
                  {team.name}
                </h4>
                <div className="w-full space-y-2">
                  {[
                    {
                      label: "Budget",
                      value: team.budget,
                      icon: <FaWallet className="text-[#0047AB]" />,
                      color: "text-green-400",
                    },
                    {
                      label: "Players",
                      value: team.playersBought,
                      icon: <FaUsers className="text-[#0047AB]" />,
                    },
                    {
                      label: "Slots",
                      value: team.slotsLeft,
                      icon: <FaPuzzlePiece className="text-[#0047AB]" />,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-[#2C2F32] rounded-lg p-2"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span className="text-gray-300 text-sm">
                          {item.label}
                        </span>
                      </div>
                      <span
                        className={`${
                          item.color || "text-white"
                        } font-semibold text-sm`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bid Confirmation Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2C2F32] rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Confirm Your Bid
            </h3>
            <p className="mb-4 text-white">
              Are you sure you want to place a bid of ₹
              {bidAmount.toLocaleString()}?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowBidModal(false)}
                className="px-4 py-2 text-gray-400 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBid}
                className="px-4 py-2 bg-[#0047AB] text-white hover:bg-[#003A8C] rounded-lg transition-colors"
              >
                Confirm Bid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auction;
