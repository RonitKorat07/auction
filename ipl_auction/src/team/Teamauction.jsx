import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuctions, updateAuctionStatus } from "../store/auctionslice";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseconfig"; // Ensure Firebase is configured
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchTeamemail } from "../store/teamslice";

const Teamauction = () => {
  const [activeTab, setActiveTab] = useState("live");
  const navigate = useNavigate();
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
  const { auctions, loading: auctionsLoading } = useSelector(
    (state) => state.auction
  );

  useEffect(() => {
    dispatch(fetchAuctions());
  }, [dispatch]);

  const team = teams.length > 0 ? teams[0] : null;

  const handleJoinAuction = async (auction) => {
    const teamName = userTeam?.name; // Replace with actual team name logic
    const auctionRef = doc(db, "auctions", auction.id);

    // Check if team is already in the auction
    if (auction.teams.includes(teamName)) {
      alert("Your team has already joined this auction!");
      navigate(`/team/joinauction/${auction.id}`);
      return;
    }

    try {
      await updateDoc(auctionRef, {
        teams: [...auction.teams, teamName],
      });
      navigate(`/team/joinauction/${auction.id}`);
    } catch (error) {
      console.error("Error joining auction:", error);
      alert("Failed to join auction. Try again.");
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626]">
        <div
          className="animate-spin rounded-full h-16 w-16 border-t-4 border"
          style={{ borderColor: team?.color || "#0047AB" }} // Optional chaining with fallback // Use team.color if available, otherwise use default
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

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626]">
        <div className="text-[#E8EAF6]">No team data available.</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#202626] text-[#E8EAF6] pt-25 md:pt-25">
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
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Auctions
            </button>
          ))}
        </div>

        {/* Auction Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions
            .filter((auction) => auction.status === activeTab)
            .map((auction) => (
              <div
                key={auction.id}
                className="bg-[#202626] rounded-lg p-4 md:p-6 border border-[#B0E0E6]"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg md:text-xl font-semibold">
                    {auction.auctionName}
                  </h3>
                  {auction.isLive && (
                    <span className="bg-[#FF4500]/20 text-[#FF4500] px-2 py-1 rounded-full text-xs font-medium">
                      <i className="fas fa-circle text-xs mr-1"></i>
                      Live
                    </span>
                  )}
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-[#B0E0E6]">{auction.date}</p>
                  <p className="text-[#B0E0E6]">{auction.time}</p>
                  <p className="text-[#B0E0E6]">
                    {auction.selectedPlayers.length} Players Selected
                  </p>
                  <p className="text-[#B0E0E6]">
                    {auction.teams.length} Teams Joined
                  </p>
                </div>
                <div className="space-y-2">
                  {auction.status === "live" && (
                    <button
                      onClick={() => handleJoinAuction(auction)}
                      className="w-full bg-[#0047AB] hover:bg-[#003A8C] py-2 px-5 rounded text-white font-semibold hover:cursor-pointer"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      Join Auction
                    </button>
                  )}
                  {auction.status === "completed" && (
                    <Link to={`/admin/auction/history/${auction.id}`}>
                      <button className="w-full bg-[#0047AB] hover:bg-[#003A8C] py-2 px-5 rounded text-white font-semibold hover:cursor-pointer">
                        <i className="fas fa-eye mr-2"></i>
                        view Auction
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Teamauction;
