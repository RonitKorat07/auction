import React, { useState, useEffect } from "react";
import { FaShieldAlt, FaWallet, FaUsers, FaPuzzlePiece } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAuctions } from "../store/auctionslice";
import { fetchTeam } from "../store/teamslice";
import { fetchCurrentPlayer } from "../store/joinedPlayersSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import cricket_logo from "../assets/cricklogo.png";
import TopBuyers from "../components/TopBuyer";
import TeamStatus from "../components/TeamStatus";
import { fetchPlayers } from "../store/playerslice";

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
  const {
    players,
    loading: playersLoading,
    error: playersError,
  } = useSelector((state) => state.player);

  const { currentPlayer } = useSelector((state) => state.joinedPlayers);
  const [userEmail, setUserEmail] = useState(null);
  const bidHistory = currentPlayer?.auction_detail?.bid_history || [];
  const reversedBidHistory = [...bidHistory].reverse();
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

 const userTeam = teams?.find((team) => team.email === userEmail);
  useEffect(() => {
    dispatch(fetchPlayers());
    dispatch(fetchAuctions());
    dispatch(fetchTeam());
  }, [dispatch, id]);

  // Find the selected auction based on the ID
  const selectedauction = auctions.find(
    (auction) => auction.id.toString() === id
  );

  // Compute joinedteams dynamically

  

  useEffect(() => {
    // Fetch teams, auctions, and current player when the component mounts or when the ID changes
    dispatch(fetchTeam());
    dispatch(fetchAuctions());
    if (id) {
      dispatch(fetchCurrentPlayer(id));
    }
  }, [dispatch, id]);



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

 

  const handleBid = () => {
    // Logic to handle the bid
    setShowBidModal(false);
  };

  if (auctionsLoading || teamsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#0047AB]"></div>
      </div>
    );
  }

  if (teamsError) {
    return <div className="text-red-500 text-center">Error: {teamsError}</div>;
  }

  return (
    <div className="min-h-screen bg-[#202626] w-full mt-6">
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-25">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Middle Column - Player Profile */}
          <div className="col-span-10 lg:col-span-8 w-full h-full">
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
                        className="bg-[#2C2F32] rounded-lg p-3 text-center border border-[#0047AB]"
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
                    ₹
                      {currentPlayer.auction_detail.current_bid < 10000000
                        ? (currentPlayer.auction_detail.current_bid / 100000).toFixed(2) + ' L'
                        : (currentPlayer.auction_detail.current_bid / 10000000).toFixed(2) + ' Cr'
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Bid History */}
          <div className="col-span-10 lg:col-span-4 bg-[#2C2F32] rounded-lg shadow-lg border border-[#0047AB] p-5">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Bid History
            </h2>
            <div
              className="max-h-140 overflow-y-auto scrollbar-hide space-y-3"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {reversedBidHistory.length === 0 ? (
                <p className="text-gray-400 text-center">No bids placed yet.</p>
              ) : (
                reversedBidHistory.map((bid, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-[#202626] rounded-lg border border-[#0047AB] shadow-lg"
                  >
                    <img
                      src={bid.teamLogo}
                      alt={bid.teamName}
                      className="w-10 h-10 mr-3 bg-transparent "
                    />
                    <div className="flex flex-col flex-grow">
                      <p className="font-medium text-white text-sm">
                        {bid.teamName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(bid.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="font-semibold text-[#B0E0E6] text-sm whitespace-nowrap">
                    ₹{
                        bid.bidAmount < 10000000
                          ? (bid.bidAmount / 100000).toFixed(2) + ' Lakh'
                          : (bid.bidAmount / 10000000).toFixed(2) + ' Cr'
                      }
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Purchases Section */}
     
        <TopBuyers />


        {/* Teams Status */}
        <TeamStatus 
          teams={teams} 
          players={players} 
          selectedauction={selectedauction} 
        />
      </main>
    </div>
  );
};

export default Auction;
