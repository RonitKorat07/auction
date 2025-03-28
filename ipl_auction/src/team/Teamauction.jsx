import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuctions } from "../store/auctionslice";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseconfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchTeamemail } from "../store/teamslice";

const Teamauction = () => {
  const [activeTab, setActiveTab] = useState("live");
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state selectors
  const { teams, loading: teamLoading, error: teamError } = useSelector((state) => state.team);
  const { auctions, loading: auctionsLoading, error: auctionsError } = useSelector(
    (state) => state.auction
  );

  // Get authenticated user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email || null);
    });
    return () => unsubscribe();
  }, []);

  // Fetch team data when userEmail changes
  useEffect(() => {
    if (userEmail) {
      dispatch(fetchTeamemail(userEmail));
    }
  }, [dispatch, userEmail]);

  // Fetch auctions on mount
  useEffect(() => {
    dispatch(fetchAuctions());
  }, [dispatch]);

  // Find user's team
  const userTeam = teams?.find((team) => team.email === userEmail);
  const filteredAuctions = auctions?.filter((auction) => auction.status === activeTab) || [];

  const handleJoinAuction = async (auction) => {
    if (!userTeam) {
      alert("You need to have a team to join an auction!");
      return;
    }

    const teamName = userTeam.name;
    const auctionRef = doc(db, "auctions", auction.id);

    if (auction.teams.includes(teamName)) {
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
      alert("Failed to join auction. Please try again.");
    }
  };

  // Loading states
  if (teamLoading || auctionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#0047AB]"></div>
      </div>
    );
  }

  // Error states
  if (teamError || auctionsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626] text-red-500">
        <p>Error: {teamError || auctionsError}</p>
      </div>
    );
  }

  // No team found
  if (!userTeam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#202626]">
        <div className="text-center">
          <p className="text-xl text-[#E8EAF6] mb-4">You don't have a team yet.</p>
          <Link 
            to="/team/create" 
            className="bg-[#0047AB] hover:bg-[#003A8C] text-white py-2 px-4 rounded"
          >
            Create Team
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#202626] text-[#E8EAF6] pt-25">
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
              className={`pb-2 px-2 font-medium transition-colors ${
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
                      <i className="fas fa-circle text-xs mr-1"></i>
                      Live
                    </span>
                  )}
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-[#B0E0E6]">
                    <i className="far fa-calendar-alt mr-2"></i>
                    {auction.date}
                  </p>
                  <p className="text-[#B0E0E6]">
                    <i className="far fa-clock mr-2"></i>
                    {auction.time}
                  </p>
                  <p className="text-[#B0E0E6]">
                    <i className="fas fa-users mr-2"></i>
                    {auction.selectedPlayers?.length || 0} Players
                  </p>
                  <p className="text-[#B0E0E6]">
                    <i className="fas fa-flag mr-2"></i>
                    {auction.teams?.length || 0} Teams
                  </p>
                </div>
                <div className="space-y-2">
                  {auction.status === "live" ? (
                    <button
                      onClick={() => handleJoinAuction(auction)}
                      className="w-full bg-[#0047AB] hover:bg-[#003A8C] py-2 px-5 rounded text-white font-semibold hover:cursor-pointer transition-colors"
                      disabled={!userTeam}
                    >
                      <i className="fas fa-sign-in-alt mr-2"></i>
                      {auction.teams?.includes(userTeam?.name) ? "Enter Auction" : "Join Auction"}
                    </button>
                  ) : (
                    <Link to={`/admin/auction/history/${auction.id}`}>
                      <button className="w-full bg-[#0047AB] hover:bg-[#003A8C] py-2 px-5 rounded text-white font-semibold hover:cursor-pointer transition-colors">
                        <i className="fas fa-eye mr-2"></i>
                        View Auction
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Teamauction;