import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { FaGavel, FaClock, FaUserAlt, FaCalendar, FaRunning, FaGlobe, FaTag, FaHistory, FaShoppingCart, FaShieldAlt, FaWallet, FaUsers, FaPuzzlePiece } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
const Adminauction = () => {
  // const [currentTime, setCurrentTime] = useState(new Date());
  // const [selectedTeam, setSelectedTeam] = useState(null);
  // const statsChartRef = useRef(null);

  // const currentPlayer = {
  //   name: 'Marcus Stoinis',
  //   age: 28,
  //   role: 'All-rounder',
  //   basePrice: '200,000 USD',
  //   currentBid: '850,000 USD',
  //   status: 'In-auction',
  //   previousTeams: ['Delhi Capitals', 'Royal Challengers Bangalore'],
  //   stats: {
  //     matches: 98,
  //     runs: 2450,
  //     wickets: 89,
  //     average: 32.5,
  //     strikeRate: 145.8,
  //   },
  // };

  // const bidHistory = [
  //   { team: 'Mumbai Indians', amount: '₹7.2 Cr', bidCount: 5, timestamp: '2 mins ago' },
  //   { team: 'Chennai Kings', amount: '₹6.8 Cr', bidCount: 3, timestamp: '3 mins ago' },
  //   { team: 'Delhi Capitals', amount: '₹6.4 Cr', bidCount: 2, timestamp: '4 mins ago' },
  // ];

  // const teams = [
  //   { name: 'Mumbai Indians', budget: '₹45.5 Cr', playersBought: 15, slotsLeft: 10 },
  //   { name: 'Chennai Kings', budget: '₹38.8 Cr', playersBought: 18, slotsLeft: 7 },
  //   { name: 'Delhi Capitals', budget: '₹52.2 Cr', playersBought: 12, slotsLeft: 13 },
  //   { name: 'Royal Challengers', budget: '₹29.9 Cr', playersBought: 20, slotsLeft: 5 },
  //   { name: 'Rajasthan Royals', budget: '₹61.1 Cr', playersBought: 10, slotsLeft: 15 },
  //   { name: 'Kolkata Knights', budget: '4.2M USD', playersBought: 16, slotsLeft: 9 },
  //   { name: 'Punjab Kings', budget: '5.5M USD', playersBought: 14, slotsLeft: 11 },
  //   { name: 'Sunrisers Hyderabad', budget: '3.9M USD', playersBought: 17, slotsLeft: 8 },
  //   { name: 'Gujarat Titans', budget: '4.8M USD', playersBought: 13, slotsLeft: 12 },
  //   { name: 'Lucknow Giants', budget: '4.1M USD', playersBought: 19, slotsLeft: 6 },
  // ];

  // const recentPurchases = [
  //   { name: 'David Warner', price: '1.2M USD', team: 'Delhi Capitals' },
  //   { name: 'Jos Buttler', price: '950K USD', team: 'Rajasthan Royals' },
  //   { name: 'Glenn Maxwell', price: '1.5M USD', team: 'Royal Challengers' },
  // ];

  // useEffect(() => {
  //   const timer = setInterval(() => setCurrentTime(new Date()), 1000);

  //   if (statsChartRef.current) {
  //     const chart = echarts.init(statsChartRef.current);
  //     const option = {
  //       tooltip: { trigger: 'axis' },
  //       xAxis: { type: 'category', data: ['Matches', 'Runs', 'Wickets', 'Average', 'SR'] },
  //       yAxis: { type: 'value' },
  //       series: [
  //         {
  //           type: 'bar',
  //           data: [
  //             currentPlayer.stats.matches,
  //             currentPlayer.stats.runs,
  //             currentPlayer.stats.wickets,
  //             currentPlayer.stats.average,
  //             currentPlayer.stats.strikeRate,
  //           ],
  //           itemStyle: { color: '#6366f1' },
  //         },
  //       ],
  //     };
  //     chart.setOption(option);
  //   }

  //   return () => clearInterval(timer);
  // }, []);

  // return (
  //   <div className="min-h-screen bg-[#202626] text-gray-100">
  //     {/* Header
  //     <header className="bg-black py-6 border-b border-gray-800">
  //       <div className="container mx-auto px-4 flex justify-between items-center">
  //         <div className="flex items-center gap-3">
  //           <FaGavel className="text-3xl text-blue-400" />
  //           <h1 className="text-3xl font-bold text-blue-400">Live Player Auction 2025</h1>
  //         </div>
  //         <div className="text-xl font-semibold text-blue-400 flex items-center gap-2">
  //           <FaClock />
  //           {currentTime.toLocaleTimeString()}
  //         </div>
  //       </div>
  //     </header> */}

  //     {/* Main Content */}
  //     <main className="container mx-auto pt-24 px-4 py-8">
  //       {/* Current Player Section */}
  //       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
  //         <div className="lg:col-span-7 bg-gradient-to-br from-black to-gray-900 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-gray-800">
  //           <div className="mb-6">
  //             <img
  //               src="https://public.readdy.ai/ai/img_res/69ffd0b27171e7f2dfd1cc222c68bab8.jpg"
  //               alt={currentPlayer.name}
  //               className="w-full h-48 md:h-64 lg:h-80 object-cover rounded-lg"
  //             />
  //             <h2 className="text-3xl font-bold mt-4">{currentPlayer.name}</h2>
  //           </div>
  //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  //             {[
  //               { label: 'Name', value: currentPlayer.name, icon: <FaUserAlt className="text-blue-400" /> },
  //               { label: 'DOB', value: '16 Aug 1989', icon: <FaCalendar className="text-blue-400" /> },
  //               { label: 'Role', value: currentPlayer.role, icon: <FaRunning className="text-blue-400" /> },
  //               { label: 'Country', value: 'Australia', icon: <FaGlobe className="text-blue-400" /> },
  //               { label: 'Base Price', value: '₹2.0 Cr', icon: <FaTag className="text-blue-400" /> },
  //               { label: 'Current Price', value: '₹8.5 Cr', icon: <FaGavel className="text-blue-400" />, color: 'text-green-400' },
  //             ].map((item, index) => (
  //               <div key={index} className="bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
  //                 <div className="flex items-center gap-3 mb-2">
  //                   {item.icon}
  //                   <p className="text-gray-300">{item.label}</p>
  //                 </div>
  //                 <p className={`font-semibold text-xl ${item.color || 'text-white'}`}>
  //                   {item.value}
  //                 </p>
  //               </div>
  //             ))}
  //           </div>
  //         </div>

  //         {/* Bid History */}
  //         <div className="lg:col-span-5">
  //           <div className="bg-gradient-to-br from-black to-gray-900 backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-gray-800 h-[680px] overflow-y-auto">
  //             <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
  //               <FaHistory className="text-purple-500" />
  //               Bid History
  //             </h3>
  //             <div className="space-y-3">
  //               {bidHistory.map((bid, index) => (
  //                 <div key={index} className="bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm border border-gray-700">
  //                   <div className="flex justify-between items-center mb-2">
  //                     <div className="flex items-center gap-2">
  //                       <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
  //                         <FaGavel className="text-blue-500" />
  //                       </div>
  //                       <h4 className="font-semibold text-white">{bid.team}</h4>
  //                     </div>
  //                     <p className="text-emerald-500 font-semibold">{bid.amount}</p>
  //                   </div>
  //                   <div className="flex justify-between items-center text-sm">
  //                     <div className="flex items-center gap-1 text-gray-400">
  //                       <span>{bid.bidCount} bids</span>
  //                     </div>
  //                     <span className="text-gray-400">{bid.timestamp}</span>
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Recent Purchases */}
  //       <div className="bg-gradient-to-br from-black to-gray-900 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-gray-800 mb-8">
  //         <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
  //           <FaShoppingCart className="text-blue-400" />
  //           Recent Purchases
  //         </h3>
  //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  //           {recentPurchases.map((purchase, index) => (
  //             <div key={index} className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-700">
  //               <div className="flex flex-col items-center text-center">
  //                 <img
  //                   src={`https://readdy.ai/api/search-image?query=professional cricket player portrait in white jersey, confident pose with dark background, sports photography&width=80&height=80&orientation=squarish&flag=79614bb1607cb6b771850fbf851cb93c`}
  //                   alt={purchase.name}
  //                   className="w-16 h-16 rounded-full border-2 border-blue-500 mb-3"
  //                 />
  //                 <h4 className="text-lg font-bold text-white">{purchase.name}</h4>
  //                 <p className="text-blue-500 font-semibold text-sm mt-1">₹{purchase.price}</p>
  //                 <span className="mt-2 px-3 py-1 bg-gray-700/50 rounded-full text-xs font-semibold text-white">
  //                   {purchase.team}
  //                 </span>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>

  //       {/* Teams Status */}
  //       <div className="bg-gradient-to-br from-black to-gray-900 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-gray-800">
  //         <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
  //           <FaShieldAlt className="text-blue-400" />
  //           Teams Status
  //         </h3>
  //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
  //           {teams.map((team, index) => (
  //             <div
  //               key={index}
  //               className={`flex flex-col items-center bg-gradient-to-br from-black to-gray-900 backdrop-blur-lg rounded-xl cursor-pointer border border-gray-800 p-6 ${
  //                 selectedTeam === team.name ? 'ring-2 ring-blue-500' : ''
  //               }`}
  //               onClick={() => setSelectedTeam(team.name)}
  //             >
  //               <img
  //                 src={`https://readdy.ai/api/search-image?query=modern minimalist cricket team logo design with ${team.name} theme, professional sports branding on dark background, centered composition&width=200&height=200&orientation=squarish`}
  //                 alt={team.name}
  //                 className="w-32 h-32 rounded-full border-4 border-blue-400 mb-4"
  //               />
  //               <h4 className="font-bold text-lg text-white text-center mb-4">{team.name}</h4>
  //               <div className="w-full space-y-2">
  //                 {[
  //                   { label: 'Budget', value: team.budget, icon: <FaWallet className="text-blue-400" />, color: 'text-green-400' },
  //                   { label: 'Players', value: team.playersBought, icon: <FaUsers className="text-blue-400" /> },
  //                   { label: 'Slots', value: team.slotsLeft, icon: <FaPuzzlePiece className="text-blue-400" /> },
  //                 ].map((item, idx) => (
  //                   <div key={idx} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-2">
  //                     <div className="flex items-center gap-2">
  //                       {item.icon}
  //                       <span className="text-gray-300 text-sm">{item.label}</span>
  //                     </div>
  //                     <span className={`${item.color || 'text-white'} font-semibold text-sm`}>
  //                       {item.value}
  //                     </span>
  //                   </div>
  //                 ))}
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     </main>
  //   </div>
  // );
  const [activeTab, setActiveTab] = useState('live');
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Track login status
  const navigate = useNavigate();
  const auth = getAuth();
  const liveAuctions = [
    {
      id: '1',
      name: 'IPL 2025 Mega Auction',
      date: '2025-02-28',
      time: '04:44 PM',
      totalBids: 156,
    },
    {
      id: '2',
      name: 'Big Bash League Player Draft',
      date: '2025-02-28',
      time: '05:30 PM',
      totalBids: 89,
    },
    {
      id: '3',
      name: 'Caribbean Premier League Auction',
      date: '2025-02-28',
      time: '06:15 PM',
      totalBids: 124,
    },
  ];

  const upcomingAuctions = [
    {
      id: '4',
      name: 'The Hundred Draft 2025',
      date: '2025-03-01',
      time: '02:00 PM',
    },
    {
      id: '5',
      name: 'Pakistan Super League Auction',
      date: '2025-03-02',
      time: '03:30 PM',
    },
    {
      id: '6',
      name: 'International T20 League Draft',
      date: '2025-03-03',
      time: '01:00 PM',
    },
  ];

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set state based on user authentication
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const handleViewAuction = (id) => {
    if (isLoggedIn === false) {
      navigate('/login'); // Redirect only if explicitly not logged in
    } else {
      console.log(`Viewing auction ${id}`);
    }
  };

  return (
    <div className="min-h-[1024px] bg-[#202626] mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-8">Auctions</h1>
          <div className="flex space-x-2 sm:space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('live')}
              className={`pb-2 sm:pb-4 px-3 sm:px-6 font-medium text-base sm:text-lg !rounded-button whitespace-nowrap transition-colors duration-300 ${
                activeTab === 'live'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-white hover:text-gray-700'
              }`}
            >
              Live Auctions
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-2 sm:pb-4 px-3 sm:px-6 font-medium text-base sm:text-lg !rounded-button whitespace-nowrap transition-colors duration-300 ${
                activeTab === 'upcoming'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-white hover:text-gray-700'
              }`}
            >
              Upcoming Auctions
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {activeTab === 'live'
              ? liveAuctions.map((auction) => (
                  <div
                    key={auction.id}
                    className="bg-[#202626] rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl border border-blue-500"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-white">{auction.name}</h3>
                      <span className="flex items-center px-2 sm:px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs sm:text-sm font-medium">
                        <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                        Live
                      </span>
                    </div>

                    <div className="space-y-2 mb-4 sm:mb-6">
                      <div className="flex items-center text-blue-300">
                        <i className="fas fa-calendar-alt mr-2 sm:mr-3"></i>
                        <span className="text-sm sm:text-base">{auction.date}</span>
                      </div>
                      <div className="flex items-center text-blue-300">
                        <i className="fas fa-clock mr-2 sm:mr-3"></i>
                        <span className="text-sm sm:text-base">{auction.time}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <i className="fas fa-gavel mr-2 sm:mr-3"></i>
                        <span className="text-sm sm:text-base">{auction.totalBids} Total Bids</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewAuction(auction.id)}
                      className="w-full py-2 px-4 text-center !rounded-button whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 text-sm sm:text-base"
                    >
                      View Auction
                    </button>
                  </div>
                ))
              : upcomingAuctions.map((auction) => (
                  <div
                    key={auction.id}
                    className="bg-[#202626] rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl border border-blue-500"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-white">{auction.name}</h3>
                    </div>

                    <div className="space-y-2 mb-4 sm:mb-6">
                      <div className="flex items-center text-blue-300">
                        <i className="fas fa-calendar-alt mr-2 sm:mr-3"></i>
                        <span className="text-sm sm:text-base">{auction.date}</span>
                      </div>
                      <div className="flex items-center text-blue-300">
                        <i className="fas fa-clock mr-2 sm:mr-3"></i>
                        <span className="text-sm sm:text-base">{auction.time}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewAuction(auction.id)}
                      className="w-full py-2 px-4 text-center !rounded-button whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors duration-300 text-sm sm:text-base"
                    >
                      View Auction
                    </button>
                  </div>
                ))}
          </div>

          {/* Empty State Messages */}
          {activeTab === 'live' && liveAuctions.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-400 text-lg">No live auctions at the moment</p>
            </div>
          )}

          {activeTab === 'upcoming' && upcomingAuctions.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-400 text-lg">No upcoming auctions scheduled</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Adminauction;