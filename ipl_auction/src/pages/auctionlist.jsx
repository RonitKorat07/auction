import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlayers } from "../store/playerslice";
import { fetchAuctions } from "../store/auctionslice";
import { Link } from "react-router-dom";

const Auctionlist = () => {
  const [activeTab, setActiveTab] = useState("live");
  const dispatch = useDispatch();

  // Fetch players and auctions from Redux store
  const { players, loading: playersLoading, error: playersError } = useSelector(
    (state) => state.player
  );
  const { auctions, loading: auctionsLoading, error: auctionsError } = useSelector(
    (state) => state.auction
  );

  useEffect(() => {
    dispatch(fetchPlayers());
    dispatch(fetchAuctions());
  }, [dispatch]);

  if (auctionsLoading || playersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#0047AB]"></div>
      </div>
    );
  }

  if (auctionsError || playersError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626] text-red-500">
        <p>Error loading data: {auctionsError || playersError}</p>
      </div>
    );
  }

  const filteredAuctions = auctions?.filter((auction) => auction.status === activeTab) || [];

  return (
    <div className="min-h-screen bg-[#202626] text-[#E8EAF6] pt-20 md:pt-25">
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
              aria-current={activeTab === tab ? "page" : undefined}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Auctions
            </button>
          ))}
        </div>

        {/* Auction Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.length === 0 ? (
            <div className="col-span-full text-center py-12 text-[#B0E0E6]">
              <i className="fas fa-box-open text-4xl mb-4"></i>
              <p>No {activeTab} auctions found</p>
            </div>
          ) : (
            filteredAuctions.map((auction) => (
              <div
                key={auction.id}
                className="bg-[#202626] rounded-lg p-4 md:p-6 border border-[#B0E0E6] hover:border-[#0047AB] transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg md:text-xl font-semibold">
                    {auction.auctionName}
                  </h3>
                  {auction.isLive && (
                    <span className="bg-[#FF4500]/20 text-[#FF4500] px-2 py-1 rounded-full text-xs font-medium">
                      <i className="fas fa-circle text-xs mr-1"></i> Live
                    </span>
                  )}
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-[#B0E0E6]">{auction.date}</p>
                  <p className="text-[#B0E0E6]">{auction.time}</p>
                  <p className="text-[#B0E0E6]">
                    {auction.bidHistory?.length || 0} Total Bids
                  </p>
                  <p className="text-[#B0E0E6]">
                    {auction.selectedPlayers?.length || 0} Players Selected
                  </p>
                </div>
                <div className="space-y-2">
                  <Link 
                    to={
                      auction.status === "completed" 
                        ? `/admin/auction/history/${auction.id}`
                        : `/auctionpage/${auction.id}`
                    }
                  >
                    <button 
                      className="w-full bg-[#0047AB] hover:bg-[#003A8C] py-2 rounded text-white font-semibold hover:cursor-pointer transition-colors"
                      aria-label={`View ${auction.auctionName} auction`}
                    >
                      <i className="fas fa-eye mr-2"></i> View Auction
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Auctionlist;