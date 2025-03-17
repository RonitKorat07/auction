import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamemail } from "../store/teamslice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchCurrentPlayer, fetchJoinedPlayers, fetchUpcomingPlayersRealtime, updateCurrentBid } from "../store/joinedPlayersSlice";
import { useParams } from "react-router-dom";
import { fetchPlayers } from "../store/playerslice";

const Teamjoinauction = () => {
  const [currentBid, setCurrentBid] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);
  const [showBidModal, setShowBidModal] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  const [userEmail, setUserEmail] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isManualBid, setIsManualBid] = useState(false);
  

  const dispatch = useDispatch();
  const { id } = useParams();

  const { teams, loading, error } = useSelector((state) => state.team);
  const { players } = useSelector((state) => state.player);
  const { currentPlayer, upcomingPlayers } = useSelector((state) => state.joinedPlayers);
  const bidHistory = currentPlayer?.auction_detail?.bidHistory || [];
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

  // Fetch team and player data
  useEffect(() => {
    if (userEmail) {
      dispatch(fetchTeamemail(userEmail));
    }
    if (id) {
      dispatch(fetchPlayers());
      dispatch(fetchJoinedPlayers(id, players));
      dispatch(fetchCurrentPlayer(id));
      dispatch(fetchUpcomingPlayersRealtime(id));
    }
  }, [dispatch, userEmail, id]);

  useEffect(() => {
    if (currentPlayer && currentPlayer.auction_detail?.base_price) {
      const { base_price, current_bid } = currentPlayer.auction_detail;
      const newBidAmount = current_bid > base_price ? current_bid : base_price;

      // Reset isManualBid when a new player is up for auction
      setIsManualBid(false);

      // Only update bidAmount if it hasn't been manually set by the user
      if (!isManualBid) {
        setBidAmount(newBidAmount);
      }

      setCurrentBid(current_bid);
      setTimeLeft(30);
    }
  }, [currentPlayer]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Find the user's team
  const userTeam = teams?.find((team) => team.email === userEmail);
  const totalBudget = userTeam?.budget || 0;
  const remainingBudget = totalBudget - totalSpent;

  // Handle bid submission
  const handleBid = async () => {
    if (bidAmount <= currentBid) {
      alert("Bid amount must be higher than the current bid.");
      return;
    }

    try {
      // Update local state immediately
      setCurrentBid(bidAmount);
      setTotalSpent((prevSpent) => prevSpent + bidAmount);
      setShowBidModal(false);
      setTimeLeft(30); // Reset timer

      // Update Firestore
      await dispatch(updateCurrentBid({
        auctionId: id,
        bidAmount,
        teamName: userTeam.name,
        teamLogo: userTeam.logo,
      }));
    } catch (error) {
      console.error("Error updating bid:", error);

      // Provide specific error messages
      if (error.message.includes("Firestore update error")) {
        alert("Failed to update Firestore. Please check your connection.");
      } else if (error.message.includes("Current player document does not exist")) {
        alert("Auction data not found. Please refresh the page.");
      } else {
        alert("Failed to place bid. Please try again.");
      }

      // Revert local state if Firestore update fails
      setCurrentBid((prev) => prev - bidAmount);
      setTotalSpent((prevSpent) => prevSpent - bidAmount);
    }
  };

  // Handle bid button clicks
  const handleBidButtonClick = (amount) => {
    setIsManualBid(true); // Mark bid as manual
    setBidAmount((prevBidAmount) => prevBidAmount + amount);
  };

  // Handle input change
  const handleBidInputChange = (e) => {
    setIsManualBid(true); // Mark bid as manual
    setBidAmount(Number(e.target.value));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626]">

        <div
          className="animate-spin rounded-full h-16 w-16 border-t-4 border"
          style={{ borderColor: userTeam?.color || "#0047AB" }}
        ></div>

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

  if (!userTeam) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border border-[#0047AB]"></div>
      </div>
    );
  }
  // Hardcoded data for demonstration
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

  // const upcomingPlayers = [
  //   {
  //     name: "Virat Kohli",
  //     basePrice: "₹2 Crore",
  //     logo: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
  //   },
  //   {
  //     name: "Rohit Sharma",
  //     basePrice: "₹2 Crore",
  //     logo: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
  //   },
  //   {
  //     name: "KL Rahul",
  //     basePrice: "₹1.5 Crore",
  //     logo: "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1",
  //   },
  // ];

  return (
    <div className="min-h-screen bg-[#202626] pt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Team Details */}
          <div
            className="col-span-12 lg:col-span-3 bg-[#2C2F32] rounded-lg shadow-lg p-6 border"
            style={{ borderColor: userTeam.color || "#0047AB" }}
          >
            <div className="flex flex-col items-center mb-6 ">
              <img
                src={userTeam.logo}
                alt={userTeam.teamName}
                className="w-35 h-30 mb-3 object-contain"
              />
              <h2 className="text-xl font-bold text-white text-center">
                {userTeam.name}
              </h2>
            </div>
            <div className="relative mb-6">
              <div
                className="w-full h-16 bg-[#B0E0E6] rounded-lg flex flex-col items-center justify-center border-2"
                style={{ borderColor: userTeam.color || "#0047AB" }}
              >
                <div className="text-sm text-gray-800">Remaining Budget</div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-green-600 mr-1">
                    ₹{(remainingBudget / 100000).toFixed(2)}
                  </span>
                  <span className="text-2xl font-semibold text-green-600">
                    L
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-[#2C2F32] rounded-lg px-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Total Budget</span>
                  <span className="font-semibold text-white">
                    ₹{(totalBudget / 100000).toFixed(2)} L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Spent</span>
                  <span className="font-semibold text-[#B0E0E6]">
                    ₹{(totalSpent / 100000).toFixed(2)} L
                  </span>
                </div>
              </div>
              <div className="bg-[#2C2F32] rounded-lg px-4">
                <h3 className="text-lg font-semibold mb-3 text-white">
                  Squad Composition
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="fas fa-bat-ball mr-2 text-[#0047AB]"></i>
                      <span className="text-white">Batsmen</span>
                    </div>
                    <span className="font-semibold text-white">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="fas fa-bowling-ball mr-2 text-[#0047AB]"></i>
                      <span className="text-white">Bowlers</span>
                    </div>
                    <span className="font-semibold text-white">9</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="fas fa-running mr-2 text-[#0047AB]"></i>
                      <span className="text-white">All-rounders</span>
                    </div>
                    <span className="font-semibold text-white">5</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-600">
                    <div className="flex items-center">
                      <i className="fas fa-users mr-2 text-[#0047AB]"></i>
                      <span className="text-white">Total Players</span>
                    </div>
                    <span className="font-semibold text-white">22/25</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Player Profile */}
          <div className="col-span-12 lg:col-span-6">
            {currentPlayer && (
              <div
                className="bg-[#2C2F32] rounded-lg shadow-lg overflow-hidden border-2"
                style={{ borderColor: userTeam.color || "#0047AB" }}
              >
                <div className="flex flex-col lg:flex-row items-center p-3">
                  <img
                    src={
                      currentPlayer.image ||
                      "https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1"
                    }
                    alt="Player in Action"
                    className="w-40 h-40 md:w-60 md:h-60 object-cover"
                  />
                  <div className="mt-4 md:mt-0 md:ml-6 text-center lg:text-center">
                    <h1 className="text-3xl font-bold text-white">
                      {currentPlayer.name}
                    </h1>
                    <p className="text-xl text-gray-200">
                      {currentPlayer.player_role}
                    </p>
                    <p className="text-md text-gray-200">
                      {currentPlayer.country}
                    </p>
                  </div>
                </div>
                <div className="px-6 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 ">
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
                        className="bg-[#2C2F32] rounded-lg p-3 text-center border"
                        style={{ borderColor: userTeam.color || "#0047AB" }}
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
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                      <div className="flex items-center mb-4 sm:mb-0">
                        <span className="text-xl text-white">Current Bid</span>
                        <div className="ml-4 bg-[#FF4500] text-white px-3 py-1 rounded-full flex items-center">
                          <i className="fas fa-clock mr-2"></i>
                          <span id="timer" className="font-semibold">
                            {timeLeft}s 
                          </span>
                        </div>
                      </div>
                      <span className="text-3xl font-bold text-[#B0E0E6]">₹{(currentPlayer.auction_detail.current_bid / 100000).toFixed(2)} L</span>

                    </div>
                    <div className="space-y-4 pb-5">
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={handleBidInputChange}
                        className="w-full p-4 border rounded-lg text-lg font-medium text-white bg-[#2C2F32] focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                        style={{ borderColor: userTeam.color || "#0047AB" }}
                        min={currentBid + 50000}
                        step={50000}
                      />
                      <div className="flex flex-wrap gap-2">

                      {[
                        { amount: 1000000, label: "₹10L" },
                        { amount: 2500000, label: "₹25L" },
                        { amount: 5000000, label: "₹50L" },
                      ].map((button, index) => (
                        currentPlayer.auction_detail.base_price <= currentPlayer.auction_detail.current_bid ? (
                        <button
                          key={index}
                          onClick={() => handleBidButtonClick(button.amount)}
                          className="flex-1 px-4 py-2 text-base font-semibold text-black rounded-lg transition-colors"
                          style={{
                            backgroundColor: userTeam.color || "#B0E0E6",
                          }}
                        >
                          <i className="fas fa-plus-circle mr-1"></i>
                          {button.label}
                        </button>):null
                      ))}
                        <button
                          onClick={() => setShowBidModal(true)}
                          className="flex-1 bg-[#0047AB] text-white px-4 py-2 text-base font-semibold hover:bg-[#003A8C] rounded-lg transition-colors flex items-center justify-center"
                        >
                          <i className="fas fa-gavel mr-2"></i>
                          Place Bid
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Bid History */}
          <div
            className="col-span-12 lg:col-span-3 bg-[#2C2F32] rounded-lg shadow-lg border p-3"
            style={{ borderColor: userTeam.color || "#0047AB" }}
          >
            <h2 className="text-xl font-semibold mb-4 text-white">Bid History</h2>
            <div
              className="max-h-140 overflow-y-auto scrollbar-hide space-y-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {reversedBidHistory.length === 0 ? (
                <p className="text-gray-400 text-center">No bids placed yet.</p>
              ) : (
                reversedBidHistory.map((bid, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-[#202626] rounded-lg border shadow-lg"
                    style={{ borderColor: userTeam.color || "#0047AB" }}
                  >
                    <img
                      src={bid.teamLogo}
                      alt={bid.teamName}
                      className="w-10 h-10 mr-3 "
                    />
                    <div className="flex flex-col flex-grow">
                      <p className="font-medium text-white text-sm">{bid.teamName}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(bid.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="font-semibold text-[#B0E0E6] text-sm whitespace-nowrap">
                      ₹{(bid.bidAmount / 100000).toFixed(2)} L
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>        
        </div>

        {/* Upcoming Players */}
        <div
          className="mt-8 bg-[#2C2F32] rounded-lg p-6 border"
          style={{ borderColor: userTeam.color || "#0047AB" }}
        >
          <h2 className="text-xl font-bold text-white mb-6">
            Upcoming Players
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {upcomingPlayers.map((player, index) => (
              <div
                key={index}
                className="bg-[#202626] rounded-lg p-2 hover:bg-gray-600 transition-colors duration-300 text-white border"
                style={{ borderColor: userTeam.color || "#0047AB" }}
              >
                <div className="flex justify-center items-center mb-4">
                  <img
                    className="w-20 h-20 object-contain rounded-full"
                    src={player.image || "https://via.placeholder.com/150"}
                    alt={player.name}
                  />
                  <div className="flex-col items-center justify-center mt-4 pl-5">
                    <h3 className="text-xl font-bold">{player.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-semibold">
                        ₹{(player.auction_detail.base_price / 100000).toFixed(2)} L
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Purchases Section */}
        <div
          className="mt-8 bg-[#2C2F32] rounded-lg shadow-lg p-6 border"
          style={{ borderColor: userTeam.color || "#0047AB" }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-white">
            Recent Purchases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recentPurchases.map((purchase, index) => (
              <div
                key={index}
                className="bg-[#2C2F32] rounded-lg overflow-hidden border"
                style={{ borderColor: userTeam.color || "#0047AB" }}
              >
                <img
                  src={`https://readdy.ai/api/search-image?query=professional soccer player in manchester united red jersey celebrating goal victory moment dramatic stadium lighting&width=400&height=300&orientation=landscape&flag=912fa8b416ec5d3215e35a8d058b0af7`}
                  alt={purchase.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white">
                    {purchase.name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">From</span>
                      <span className="font-medium text-white">
                        {purchase.from}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Transfer Fee</span>
                      <span className="font-medium text-[#0047AB]">
                        {purchase.price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date</span>
                      <span className="font-medium text-white">
                        {purchase.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Squad Section */}
        <div
          className="mt-8 bg-[#2C2F32] rounded-lg shadow-lg p-6 border"
          style={{ borderColor: userTeam.color || "#0047AB" }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-white">Team Squad</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-lg">
              <thead>
                <tr className="bg-[#2C2F32]">
                  <th className="px-6 py-5 text-left text-white">Player</th>
                  <th className="px-6 py-5 text-left text-white">Role</th>
                  <th className="px-6 py-5 text-left text-white">Age</th>
                  <th className="px-6 py-5 text-left text-white">
                    Nationality
                  </th>
                  <th className="px-6 py-5 text-left text-white">Matches</th>
                  <th className="px-6 py-5 text-left text-white">Runs</th>
                  <th className="px-6 py-5 text-left text-white">Wickets</th>
                  <th className="px-6 py-5 text-left text-white">
                    Strike Rate
                  </th>
                  <th className="px-6 py-5 text-left text-white">Economy</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  {
                    name: "Rohit Sharma",
                    position: "Batsman",
                    age: 36,
                    nationality: "India",
                    matches: 243,
                    runs: 6211,
                    wickets: 0,
                    strikeRate: 130.5,
                    economy: 0,
                  },
                  {
                    name: "Virat Kohli",
                    position: "Batsman",
                    age: 34,
                    nationality: "India",
                    matches: 250,
                    runs: 7500,
                    wickets: 0,
                    strikeRate: 135.0,
                    economy: 0,
                  },
                ].map((player, index) => (
                  <tr
                    key={index}
                    style={{ borderColor: userTeam.color || "#0047AB" }}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-4">
                        <img
                          src="https://public.readdy.ai/ai/img_res/7ef4f29068f1540d64cc7eb86183279f.jpg"
                          alt={player.name}
                          className="w-12 h-12 rounded-full object-cover border-2"
                          style={{ borderColor: userTeam.color || "#0047AB" }}
                        />
                        <div>
                          <span className="font-medium text-white">
                            {player.name}
                          </span>
                          <p className="text-sm text-gray-400">
                            {player.nationality}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-white">{player.position}</td>
                    <td className="px-6 py-5 text-white">{player.age}</td>
                    <td className="px-6 py-5 text-white">
                      {player.nationality}
                    </td>
                    <td className="px-6 py-5 text-white">{player.matches}</td>
                    <td className="px-6 py-5 text-white">{player.runs}</td>
                    <td className="px-6 py-5 text-white">{player.wickets}</td>
                    <td className="px-6 py-5 text-white">
                      {player.strikeRate}
                    </td>
                    <td className="px-6 py-5 text-white">{player.economy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Bid Confirmation Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#2C2F32] rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Confirm Your Bid
            </h3>
            <p className="mb-4 text-white">
              Are you sure you want to place a bid of ₹
              {bidAmount.toLocaleString()}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowBidModal(false)}
                className="px-4 py-2 text-gray-400 hover:bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleBid}
                className="px-4 py-2 bg-[#0047AB] text-white hover:bg-[#003A8C] rounded-lg"
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

export default Teamjoinauction;
