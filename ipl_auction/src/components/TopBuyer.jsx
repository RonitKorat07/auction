import React, { useEffect, useState } from "react";
import { FaTrophy } from "react-icons/fa";
import { db } from "../config/firebaseconfig";
import { collection, query, where, onSnapshot, documentId } from "firebase/firestore";

const TopBuyers = (userTeam) => {

  const [topBidPlayers, setTopBidPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const unsubscribe = async () => {
      try {
        console.log("Setting up real-time listener for live auction...");
        
        const auctionsRef = collection(db, "auctions");
        const liveAuctionQuery = query(auctionsRef, where("status", "==", "live"));
  
        const unsubscribeAuction = onSnapshot(liveAuctionQuery, async (auctionSnapshot) => {
          if (auctionSnapshot.empty) {
            setError("No live auction found");
            setLoading(false);
            return;
          }
  
          const liveAuction = auctionSnapshot.docs[0];
          console.log("Live auction ID (real-time):", liveAuction.id);
  
          const historyRef = collection(db, "auction_history");
          const historyQuery = query(
            historyRef,
            where(documentId(), "==", liveAuction.id)
          );
  
          const unsubscribeHistory = onSnapshot(historyQuery, (historySnapshot) => {
            console.log(`Real-time: Found ${historySnapshot.size} history documents`);
  
            const allPlayers = [];
  
            historySnapshot.forEach((doc) => {
              const data = doc.data();
              if (data.players && Array.isArray(data.players)) {
                data.players.forEach((player) => {
                  if (player.auctionDetails?.auctionStatus === "sold") {
                    allPlayers.push({
                      name: player.name,
                      team: player.auctionDetails.team,
                      playerImage: player.image,
                      bidAmount: player.auctionDetails.soldPrice,
                      playerId: player.playerId,
                    });
                  }
                });
              }
            });
  
            const topBids = allPlayers
              .sort((a, b) => b.bidAmount - a.bidAmount)
              .slice(0, 3);
  
            setTopBidPlayers(topBids);
            setLoading(false);
          });
  
          // Cleanup listener for history when live auction changes
          return () => unsubscribeHistory();
        });
  
        // Cleanup listener for live auction
        return () => unsubscribeAuction();
      } catch (err) {
        console.error("Error in real-time listener:", err);
        setError(err.message);
        setLoading(false);
      }
    };
  
    unsubscribe();
  }, []);
  

  const formatBidAmount = (amount) => {
    if (!amount) return "₹0";
    return amount < 10000000 
      ? `₹${(amount / 100000).toFixed(2)} L` 
      : `₹${(amount / 10000000).toFixed(2)} Cr`;
  };

  if (loading) {
    return (
      <div className="mt-8 bg-[#2C2F32] rounded-lg shadow-lg p-4 sm:p-6 border border-[#0047AB]">
        <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
          <FaTrophy className="text-yellow-400" />
          Top Bids
        </h2>
        <div className="text-white text-center py-8">Loading auction data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 bg-[#2C2F32] rounded-lg shadow-lg p-4 sm:p-6 border border-[#0047AB]">
        <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
          <FaTrophy className="text-yellow-400" />
          Top Bids
        </h2>
        <div className="text-red-400 text-center py-8">
          Error: {error}
          <div className="text-sm text-gray-400 mt-2">
            Check console for more details
          </div>
        </div>
      </div>
    );
  }

  if (topBidPlayers.length === 0) {
    return (
      <div className="mt-8 bg-[#2C2F32] rounded-lg shadow-lg p-4 sm:p-6 border border-[#0047AB]">
        <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
          <FaTrophy className="text-yellow-400" />
          Top Bids
        </h2>
        <div className="text-gray-400 text-center py-8">
          No sold players found in current auction
          <div className="text-sm mt-2">
            (Data might not be available yet)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
    className="mt-8 bg-[#2C2F32] rounded-lg shadow-lg p-4 sm:p-6 border" 
    style={{ borderColor: userTeam.userTeam?.color || "#0047AB" }}
  >
    <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
      <FaTrophy className="text-yellow-400" />
        Top Bids
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topBidPlayers.map((player, index) => (
                  <div
                  key={`${player.playerId}-${index}`}
                  className="bg-[#2C2F32] rounded-lg overflow-hidden border"
                  style={{ borderColor: userTeam.userTeam?.color || "#0047AB" }}
                >
      
            <div className="p-4 flex flex-col items-center">
              <div className="flex items-center justify-center w-full mb-4">
                <img
                  src={player.playerImage || "https://via.placeholder.com/150"}
                  alt={player.name}
                  className="w-24 h-24 rounded-full object-cover border-2 "
                  style={{ borderColor: userTeam.userTeam?.color || "#0047AB" }}

                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 text-center">
                {player.name || "Unknown Player"}
              </h3>
              
              <div className="flex items-center mb-4 gap-2">
                <span className="text-white text-sm font-bold">
                  {player.team || "No Team"}
                </span>
              </div>
              
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center bg-[#202626] p-2 rounded">
                  <span className="text-green-400 text-sm">Sold Price</span>
                  <span className="font-medium text-green-400">
                    {formatBidAmount(player.bidAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBuyers;