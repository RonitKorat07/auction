import React, { useState, useEffect } from "react";
import {
  FaGavel,
  FaShieldAlt,
  FaWallet,
  FaUsers,
  FaPuzzlePiece,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchJoinedPlayers,
  fetchCurrentPlayer,
  startAuction,
  pauseAuction,
  resumeAuction,
  endAuction,
  nextPlayer,
  updateSoldStatus,
} from "../store/joinedPlayersSlice";
import { fetchPlayers } from "../store/playerslice";
import { fetchAuctions } from "../store/auctionslice";
import Timer from "../components/Timer"; // Import the Timer component
import { fetchTeam } from "../store/teamslice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import TopBuyers from "../components/TopBuyer";
import TeamStatus from "../components/TeamStatus";

const Auctionhandel = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { auctions, loading: auctionsLoading } = useSelector(
    (state) => state.auction
  );
  const {
    players,
    loading: playersLoading,
    error: playersError,
  } = useSelector((state) => state.player);

  const {
    joinedPlayers,
    loading: joinedPlayersLoading,
    error: joinedPlayersError,
    currentPlayer,
    currentBid,
    auctionStatus,
  } = useSelector((state) => state.joinedPlayers);

  const [showBidModal, setShowBidModal] = useState(false);
  // const [selectedTeam, setSelectedTeam] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const bidHistory = currentPlayer?.auction_detail?.bid_history || [];

  const reversedBidHistory = [...bidHistory].reverse();

  // Fetch logged-in user's email
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

  const {
    teams,
    loading: teamsLoading,
    error: teamsError,
  } = useSelector((state) => state.team);


  const selectedauction = auctions.find(
    (auction) => auction.id.toString() === id
  );

  const userTeam = teams?.find((team) => team.email === userEmail);
  useEffect(() => {
    dispatch(fetchPlayers());
    dispatch(fetchAuctions());
    dispatch(fetchTeam());
  }, [dispatch, id]);



  useEffect(() => {
    if (id && players.length > 0) {
      dispatch(fetchJoinedPlayers(id, players));
      dispatch(fetchCurrentPlayer(id));
    }
  }, [dispatch, id, players]);

  
  
  const handleStartAuction = () => {
    if (joinedPlayers.length > 0) {
      dispatch(startAuction(id, joinedPlayers[0], players));
    }
  };

  const handlePauseAuction = () => dispatch(pauseAuction(id));
  const handleResumeAuction = () => dispatch(resumeAuction(id));
  const handleEndAuction = () => dispatch(endAuction(id));
  const handleNextPlayer = () => dispatch(nextPlayer(id));
 const handlesoldunsold = () => dispatch(updateSoldStatus(id));

  const handleBid = () => {
    setShowBidModal(false);
    // Add bid logic here if needed
  };

  if (auctionsLoading || playersLoading || joinedPlayersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#0047AB]"></div>
      </div>
    );
  }

  if (playersError || joinedPlayersError) {
    return (
      <div className="text-red-500 text-center">
        Error: {playersError || joinedPlayersError}
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-[#202626] w-full">
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-25">
        {/* Auction Controls */}
        <div className="mb-8 bg-[#2C2F32] rounded-lg shadow-lg p-6 border border-[#0047AB]">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
            <FaGavel className="text-[#0047AB]" />
            Auction Controls
          </h3>
          <div className="flex flex-wrap gap-4 item-centure">
            <button
              onClick={handleStartAuction}
              className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto transition-all duration-300 ${
                auctionStatus === "running" || !joinedPlayers.length
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={auctionStatus === "running" || !joinedPlayers.length}
            >
              Start Auction
            </button>
            <button
              onClick={handlePauseAuction}
              className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto transition-all duration-300 ${
                auctionStatus !== "running"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={auctionStatus !== "running"}
            >
              Pause Auction
            </button>
            <button
              onClick={handleResumeAuction}
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto transition-all duration-300 ${
                auctionStatus !== "paused"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={auctionStatus !== "paused"}
            >
              Resume Auction
            </button>
            <button
              onClick={handleEndAuction}
              className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto transition-all duration-300 ${
                auctionStatus === "ended" ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={auctionStatus === "ended"}
            >
              End Auction
            </button>
            {auctionStatus === "running" && joinedPlayers.length > 1 && (
              <button
                onClick={handleNextPlayer}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto transition-all duration-300"
              >
                Next Player
              </button>
            )}{auctionStatus === "running" && currentPlayer &&  (
               <button
                  onClick={handlesoldunsold}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto transition-all duration-300"
               >
                  Sold/Unsold
               </button>
            )}
          </div>
        </div>

        {/* Player Profile */}
        {auctionStatus === "running"  && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="col-span-10 lg:col-span-8  h-full">
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4  ">
                    {[
                      {
                        label: "Matches",
                        value:
                          currentPlayer?.state?.ipl?.batting?.match || "N/A",
                      },
                      {
                        label: "Runs",
                        value:
                          currentPlayer?.state?.ipl?.batting?.runs || "N/A",
                      },
                      {
                        label: "Wickets",
                        value:
                          currentPlayer?.state?.ipl?.bowling?.wicket || "N/A",
                      },
                      {
                        label: "Strike Rate",
                        value:
                          currentPlayer?.state?.ipl?.batting?.strike_rate ||
                          "N/A",
                      },
                      {
                        label: "Batting Avg",
                        value:
                          currentPlayer?.state?.ipl?.batting?.average || "N/A",
                      },
                      {
                        label: "Economy",
                        value: currentPlayer?.state?.ipl?.bowling?.eco || "N/A",
                      },
                      {
                        label: "Best Wickets",
                        value:
                          currentPlayer?.state?.ipl?.bowling?.best_bowling ||
                          "N/A",
                      },
                      {
                        label: "Best Score",
                        value:
                          currentPlayer?.state?.ipl?.batting?.high_score ||
                          "N/A",
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
                      {/* Timer Component */}
                      <Timer auctionId={id} isAuctionActive={auctionStatus === "running"}/>
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
            </div>

            {/* Bid History */}
            <div className="col-span-10 lg:col-span-4 bg-[#2C2F32] rounded-lg shadow-lg border border-[#0047AB] p-5">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Bid History
              </h2>
              <div
                className="max-h-140 overflow-y-auto scrollbar-hide space-y-3"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {reversedBidHistory.length === 0 ? (
                  <p className="text-gray-400 text-center">
                    No bids placed yet.
                  </p>
                ) : (
                  reversedBidHistory.map((bid, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-[#202626] rounded-lg border border-[#0047AB] shadow-lg"
                    >
                      <img
                        src={bid.teamLogo}
                        alt={bid.teamName}
                        className="w-10 h-10 mr-3 "
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
        )}

        {/* Recent Purchases */}
        
        <TopBuyers/>

       {/* Teams Status */}
       <TeamStatus 
          teams={teams} 
          players={players} 
          selectedauction={selectedauction} 
        />

      </main>

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2C2F32] rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Confirm Your Bid
            </h3>
            <p className="mb-4 text-white">
              Are you sure you want to place a bid of ₹
              {(currentBid / 10000000).toFixed(2)} Crore?
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

export default Auctionhandel;