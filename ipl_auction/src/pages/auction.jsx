import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuctions } from "../store/auctionslice";
import { FaPuzzlePiece, FaShieldAlt, FaUsers, FaWallet } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { fetchTeam } from "../store/teamslice";

const Auction = () => {
  const [currentBid, setCurrentBid] = useState(165000000);
  const [showBidModal, setShowBidModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [auctionStatus, setAuctionStatus] = useState("not-started");
  const [bidAmount, setBidAmount] = useState(currentBid);
  const { id } = useParams();
  const dispatch = useDispatch();

  // Fetch auctions and teams from Redux store
  const { auctions, loading: auctionsLoading } = useSelector((state) => state.auction);
  const { teams, loading: teamsLoading, error: teamsError } = useSelector((state) => state.team);

  // Find the selected auction based on the ID
  const selectedauction = auctions.find((auction) => auction.id.toString() === id);

  // Compute joinedteams dynamically
  const [joinedteams, setJoinedteams] = useState([]);

  useEffect(() => {
    // Fetch teams and auctions when the component mounts or when the ID changes
    dispatch(fetchTeam());
    dispatch(fetchAuctions());
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

  // Handle bid submission
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
                  <p className="text-lg sm:text-xl text-gray-200 mb-1">All-rounder</p>
                  <p className="text-sm sm:text-base text-gray-200">INDIA</p>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Matches", value: "125" },
                    { label: "Runs", value: "2,309" },
                    { label: "Wickets", value: "78" },
                    { label: "Strike Rate", value: "142.5" },
                    { label: "Batting Avg", value: "32.4" },
                    { label: "Economy", value: "8.24" },
                    { label: "Sixes", value: "112" },
                    { label: "Best Score", value: "91*" }
                  ].map((stat, index) => (
                    <div key={index} className="bg-[#2C2F32] rounded-lg p-3 text-center">
                      <p className="text-sm sm:text-base text-gray-400">{stat.label}</p>
                      <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <span className="text-lg sm:text-xl text-white">Current Bid</span>
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
              <h2 className="text-xl font-semibold mb-6 text-white">Bid History</h2>
              <div className="space-y-4">
                {[
                  {
                    bidder: "Chennai Super Kings",
                    amount: "₹16.5 Crore",
                    time: "2 mins ago",
                  },
                  {
                    bidder: "Royal Challengers Bangalore",
                    amount: "₹16.25 Crore",
                    time: "5 mins ago",
                  },
                  {
                    bidder: "Kolkata Knight Riders",
                    amount: "₹16 Crore",
                    time: "8 mins ago",
                  },
                  {
                    bidder: "Delhi Capitals",
                    amount: "₹15.75 Crore",
                    time: "12 mins ago",
                  },
                  {
                    bidder: "Rajasthan Royals",
                    amount: "₹15.5 Crore",
                    time: "15 mins ago",
                  },
                ].map((bid, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-[#2C2F32] rounded-lg hover:bg-[#353839] transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-white">{bid.bidder}</p>
                      <p className="text-sm text-gray-400">{bid.time}</p>
                    </div>
                    <span className="font-semibold text-white">{bid.amount}</span>
                  </div>
                ))}
              </div>
            </div>
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
                className={`flex flex-col items-center bg-[#2C2F32] rounded-lg p-4 border border-[#0047AB] cursor-pointer hover:bg-[#0047AB]/10 transition-all "ring-2 ring-[#0047AB]" : ""
                }`}
              >
                <img
                  src={team.logo}
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
                        <span className="text-gray-300 text-sm">{item.label}</span>
                      </div>
                      <span className={`${item.color || "text-white"} font-semibold text-sm`}>
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