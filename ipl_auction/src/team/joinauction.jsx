import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamemail } from "../store/teamslice";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Teamjoinauction = () => {
  const [currentBid, setCurrentBid] = useState(200000);
  const [bidAmount, setBidAmount] = useState(167500000);
  const [showBidModal, setShowBidModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalSpent, setTotalSpent] = useState(0); // Track total spent
  const [userEmail, setUserEmail] = useState(null); // Track user email

  const { teams, loading, error } = useSelector((state) => state.team);
  const dispatch = useDispatch();

  // Get the logged-in user's email using onAuthStateChanged
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); // Set user email
      } else {
        setUserEmail(null); // No user logged in
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Fetch team data when the userEmail changes
  useEffect(() => {
    if (userEmail) {
      dispatch(fetchTeamemail(userEmail));
    }
  }, [dispatch, userEmail]);

  const userTeam = teams?.find((team) => team.email === userEmail);

  const totalBudget = userTeam?.budget || 0; // Total budget from userTeam
  const remainingBudget = totalBudget - totalSpent; // Remaining budget

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
    if (bidAmount <= currentBid) {
      return;
    }
    setCurrentBid(bidAmount);
    setTotalSpent((prevSpent) => prevSpent + bidAmount); // Update total spent
    setShowBidModal(false);
  };

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

  return (
    <div className="min-h-screen bg-[#202626] pt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Team Details */}
          <div className="col-span-12 lg:col-span-3 bg-[#2C2F32] rounded-lg shadow-lg p-6 border border-[#0047AB]">
            <div className="flex flex-col items-center mb-6">
              <img
                src={userTeam?.logo}
                alt={userTeam?.teamName}
                className="w-35 h-30 mb-3 object-contain "
              />
              <h2 className="text-xl font-bold text-white text-center">
                {userTeam?.name}
              </h2>
            </div>
            <div className="relative mb-6">
              <div className="w-full h-16 bg-[#B0E0E6] rounded-lg flex flex-col items-center justify-center">
                <div className="text-sm text-gray-800">Remaining Budget</div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-green-600 mr-1">
                    ₹{(remainingBudget / 100000).toFixed(2)}
                  </span>
                  <span className="text-base font-semibold text-green-600">
                    Crore
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-[#2C2F32] rounded-lg px-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Total Budget</span>
                  <span className="font-semibold text-white">
                    ₹{(totalBudget / 100000).toFixed(2)} Crore
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Spent</span>
                  <span className="font-semibold text-[#0047AB]">
                    ₹{(totalSpent / 100000).toFixed(2)} Crore
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
            <div className="bg-[#2C2F32] rounded-lg shadow-lg overflow-hidden border-2 border-[#0047AB]">
              <div className="flex flex-col lg:flex-row items-center p-3">
                <img
                  src="https://scores.iplt20.com/ipl/playerimages/MS%20Dhoni.png?v=1"
                  alt="Player in Action"
                  className="w-40 h-40 md:w-60 md:h-60 object-cover"
                />
                <div className="mt-4 md:mt-0 md:ml-6 text-center lg:text-center">
                  <h1 className="text-3xl font-bold text-white">
                    Hardik Pandya
                  </h1>
                  <p className="text-xl text-gray-200">All-rounder</p>
                  <p className="text-md text-gray-200">INDIA</p>
                </div>
              </div>
              <div className="px-6 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                      className="text-center bg-[#2C2F32] rounded-lg p-3"
                    >
                      <p className="text-gray-400">{stat.label}</p>
                      <p className="text-xl font-bold text-white">
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
                    <span className="text-3xl font-bold text-[#0047AB]">
                      ₹{(currentBid / 100000).toFixed(2)} Crore
                    </span>
                  </div>
                  <div className="space-y-4 pb-5">
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      className="w-full p-4 border border-gray-600 rounded-lg text-lg font-medium text-white bg-[#2C2F32] focus:outline-none focus:ring-2 focus:ring-[#0047AB] focus:border-transparent"
                      min={currentBid + 50000}
                      step={50000}
                    />
                    <div className="flex flex-wrap gap-2">
                      {[
                        { amount: 1000000, label: "₹10L" },
                        { amount: 2500000, label: "₹25L" },
                        { amount: 5000000, label: "₹50L" },
                      ].map((button, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setBidAmount(currentBid + button.amount)
                          }
                          className="flex-1 bg-[#B0E0E6] hover:bg-[#E8EAF6] px-4 py-2 text-base font-semibold text-[#0047AB] rounded-lg transition-colors"
                        >
                          <i className="fas fa-plus-circle mr-1"></i>
                          {button.label}
                        </button>
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
          </div>

          {/* Right Column - Bid History */}
          <div className="col-span-12 lg:col-span-3 bg-[#2C2F32] rounded-lg shadow-lg border border-[#0047AB] p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Bid History
            </h2>
            <div className="max-h-130 overflow-y-auto space-y-4">
              {[
                {
                  teamLogo: "https://upload.wikimedia.org/wikipedia/en/4/4c/Chennai_Super_Kings_logo.png",
                  bidder: "Chennai Super Kings",
                  amount: "₹16.5 Crore",
                  time: "2 mins ago",
                },
                {
                  teamLogo: "https://upload.wikimedia.org/wikipedia/en/6/6f/Royal_Challengers_Bangalore_logo.png",
                  bidder: "Royal Challengers Bangalore",
                  amount: "₹16.25 Crore",
                  time: "5 mins ago",
                },
                {
                  teamLogo: "https://upload.wikimedia.org/wikipedia/en/8/8e/Kolkata_Knight_Riders_logo.png",
                  bidder: "Kolkata Knight Riders",
                  amount: "₹16 Crore",
                  time: "8 mins ago",
                },
                {
                  teamLogo: "https://upload.wikimedia.org/wikipedia/en/3/3e/Delhi_Capitals_logo.png",
                  bidder: "Delhi Capitals",
                  amount: "₹15.75 Crore",
                  time: "12 mins ago",
                },
                {
                  teamLogo: "https://upload.wikimedia.org/wikipedia/en/3/3e/Rajasthan_Royals_logo.png",
                  bidder: "Rajasthan Royals",
                  amount: "₹15.5 Crore",
                  time: "15 mins ago",
                },
                {
                  teamLogo: "https://upload.wikimedia.org/wikipedia/en/3/3e/Rajasthan_Royals_logo.png",
                  bidder: "Rajasthan Royals",
                  amount: "₹15.5 Crore",
                  time: "15 mins ago",
                },
                {
                  teamLogo: "https://upload.wikimedia.org/wikipedia/en/3/3e/Rajasthan_Royals_logo.png",
                  bidder: "Rajasthan Royals",
                  amount: "₹15.5 Crore",
                  time: "15 mins ago",
                },
                {
                  teamLogo: "https://upload.wikimedia.org/wikipedia/en/3/3e/Rajasthan_Royals_logo.png",
                  bidder: "Rajasthan Royals",
                  amount: "₹15.5 Crore",
                  time: "15 mins ago",
                },
                {
                  teamLogo: "https://upload.wikimedia.org/wikipedia/en/3/3e/Rajasthan_Royals_logo.png",
                  bidder: "Rajasthan Royals",
                  amount: "₹15.5 Crore",
                  time: "15 mins ago",
                },
                {
                  teamLogo: "https://upload.wikimedia.org/wikipedia/en/3/3e/Rajasthan_Royals_logo.png",
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
                    className="w-10 h-10 mr-3"
                  />
                  <div className="flex justify-between w-full">
                    <p className="font-medium text-white">{bid.bidder}</p>
                    <span className="font-semibold text-[#B0E0E6] justify-right">{bid.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Purchases Section */}
        <div className="mt-8 bg-[#2C2F32] rounded-lg shadow-lg p-6 border border-[#0047AB]">
          <h2 className="text-2xl font-semibold mb-6 text-white">
            Recent Purchases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recentPurchases.map((purchase, index) => (
              <div
                key={index}
                className="bg-[#2C2F32] rounded-lg overflow-hidden border border-[#0047AB]"
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
        <div className="mt-8 bg-[#2C2F32] rounded-lg shadow-lg p-6 border border-[#0047AB]">
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
              <tbody className="divide-y divide-[#0047AB]">
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
                  // Add more players here...
                ].map((player, index) => (
                  <tr key={index}>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-4">
                        <img
                          src="https://public.readdy.ai/ai/img_res/7ef4f29068f1540d64cc7eb86183279f.jpg"
                          alt={player.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#0047AB]"
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