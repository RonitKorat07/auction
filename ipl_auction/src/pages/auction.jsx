import React, { useState, useEffect } from "react";
import { FaShieldAlt, FaWallet, FaUsers, FaPuzzlePiece } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAuctions } from "../store/auctionslice";
import { fetchTeam } from "../store/teamslice";
import { fetchCurrentPlayer } from "../store/joinedPlayersSlice";

const Auction = () => {
  const [currentBid, setCurrentBid] = useState(165000000);
  const [showBidModal, setShowBidModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [auctionStatus, setAuctionStatus] = useState("not-started");
  const [bidAmount, setBidAmount] = useState(currentBid);
  const { id } = useParams();
  const dispatch = useDispatch();

  // Fetch auctions and teams from Redux store
  const { auctions, loading: auctionsLoading } = useSelector(
    (state) => state.auction
  );
  const {
    teams,
    loading: teamsLoading,
    error: teamsError,
  } = useSelector((state) => state.team);

  const { currentPlayer } = useSelector((state) => state.joinedPlayers);

  // Find the selected auction based on the ID
  const selectedauction = auctions.find(
    (auction) => auction.id.toString() === id
  );

  // Compute joinedteams dynamically
  const [joinedteams, setJoinedteams] = useState([]);

  useEffect(() => {
    // Fetch teams, auctions, and current player when the component mounts or when the ID changes
    dispatch(fetchTeam());
    dispatch(fetchAuctions());
    if (id) {
      dispatch(fetchCurrentPlayer(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedauction && teams.length > 0) {
      // Recompute joinedteams whenever selectedauction or teams changes
      const allteams = selectedauction.teams || [];
      const updatedJoinedteams = allteams.map((teamname) =>
        teams.find((team) => team.name === teamname)
      );
      setJoinedteams(updatedJoinedteams);
    }
  }, [selectedauction, teams]);

  // Timer logic
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

  if (auctionsLoading || teamsLoading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (teamsError) {
    return <div className="text-red-500 text-center">Error: {teamsError}</div>;
  }

  return (
    <div className="min-h-screen bg-[#202626] w-full mt-6">
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-25">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Middle Column - Player Profile */}
          <div className="lg:col-span-8 w-full h-full">
            {currentPlayer && (
              <div className="bg-[#2C2F32] rounded-lg shadow-lg overflow-hidden border-2 border-[#0047AB] h-full">
                <div className="flex flex-col sm:flex-row items-center justify-center p-4 sm:p-6">
                  <img
                    src={
                      currentPlayer.image ||
                      "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1"
                    }
                    alt="Player in Action"
                    className="w-48 sm:w-60 h-auto mb-4 sm:mb-0 sm:mr-6 object-cover"
                  />
                  <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                      {currentPlayer.name}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-200 mb-1">
                      {currentPlayer.player_role}
                    </p>
                    <p className="text-sm sm:text-base text-gray-200">
                      {currentPlayer.country}
                    </p>
                  </div>
                </div>
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Matches",
                        value: currentPlayer?.state?.ipl?.batting?.match,
                      },
                      {
                        label: "Runs",
                        value: currentPlayer?.state?.ipl?.batting?.runs,
                      },
                      {
                        label: "Wickets",
                        value: currentPlayer?.state?.ipl?.bowling?.wicket,
                      },
                      {
                        label: "Strike Rate",
                        value: currentPlayer?.state?.ipl?.batting?.strike_rate,
                      },
                      {
                        label: "Batting Avg",
                        value: currentPlayer?.state?.ipl?.batting?.average,
                      },
                      {
                        label: "Economy",
                        value: currentPlayer?.state?.ipl?.bowling?.eco,
                      },
                      {
                        label: "Best Wickets",
                        value:
                          currentPlayer?.state?.ipl?.bowling?.best_bowling ||
                          "N/A",
                      },
                      {
                        label: "Best Score",
                        value: currentPlayer?.state?.ipl?.batting?.high_score,
                      },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="bg-[#2C2F32] rounded-lg p-3 text-center"
                      >
                        <p className="text-sm sm:text-base text-gray-400">
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
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold text-[#0047AB]">
                      ₹{(currentBid / 100000).toFixed(2)} Crore
                    </span>
                  </div>
                </div>
              </div>
            )}
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
                    <div className="flex flex-col flex-grow">
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
            {joinedteams.map((team, index) => (
              <div
                key={index}
                className={`flex flex-col items-center bg-[#2C2F32] rounded-lg p-4 border border-[#0047AB] cursor-pointer hover:bg-[#0047AB]/10 transition-all "ring-2 ring-[#0047AB]" : ""}`}
              >
                <img
                  src={team?.logo}
                  alt={team.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 mb-4"
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
                      value: "0",
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
    </div>
  );
};

export default Auction;
