import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrophy, FaChartLine, FaUsers } from "react-icons/fa";
import { fetchTeamemail } from "../store/teamslice"; // Adjust the import path
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Add onAuthStateChanged
import { FaMapMarkerAlt, FaCalendar, FaRulerCombined } from "react-icons/fa";

const Teamdashboard = () => {
  const dispatch = useDispatch();
  const { teams, loading, error } = useSelector((state) => state.team);
  const [activeTab, setActiveTab] = useState("batsmen");
  const [userEmail, setUserEmail] = useState(null); // Track user email

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
      dispatch(fetchTeamemail(userEmail)); // Pass the email to fetchTeam
    }
  }, [dispatch, userEmail]);

  // Use the first team in the array (or handle multiple teams as needed)
  const team = teams.length > 0 ? teams[0] : null;

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

  const teamColor = team ? team.color : "#0047AB"; // Default color

  return (
    <div className="min-h-screen bg-[#202626] text-[#E8EAF6] mt-20">
      {/* Hero Section */}
      <div className="relative h-[600px]">
        <img
          src={
            "https://media.istockphoto.com/id/1466876589/photo/3d-technology-abstract-neon-light-background-empty-space-scene-spotlight-dark-night-virtual.jpg?s=612x612&w=0&k=20&c=aEIDxz-b5QWHwpynKWBXW7das2C5q6Jhaz-2MVnUy3I="
          }
          alt="Stadium"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[rgb(0,0,0,0.5)]">
          <div className="container mx-auto px-4 py-25">
            <div className="flex flex-col justify-center items-center pt-5">
              <img src={team.logo} alt="Team Logo" className="w-55 h-50 mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-[#E8EAF6]">
                {team.name}
              </h1>
              <div className="flex flex-col md:flex-row gap-4 text-[#E8EAF6] mt-4">
                <div>
                  <p className="text-sm">Total Players</p>
                  <p className="text-2xl font-bold">{team.players.length}</p>
                </div>
                <div>
                  <p className="text-sm">Remaining Budget</p>
                  <p className="text-2xl font-bold">
                    ₹{(team.remainingBudget / 1000000).toFixed(1)}CR
                  </p>
                </div>
                <div>
                  <p className="text-sm">Home Venue</p>
                  <p className="text-2xl font-bold">{team.homeVenue.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Ownership Details and Home Venue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Ownership Details */}
          <div
            className="bg-[#202626] rounded-lg  p-6 md:p-8 border text-center"
            style={{ borderColor: teamColor }}
          >
            <h2 className="text-2xl font-bold mb-6 text-[#E8EAF6]">
              Ownership Details
            </h2>
            <div className="flex flex-col items-center">
              <img
                src={team.ownerImage}
                alt="Owner"
                className="w-50 h-50 rounded-full object-cover mb-4 shadow-lg mx-auto"
              />
              <h3 className="text-2xl font-semibold text-[#E8EAF6]">
                {team.owner}
              </h3>
              <p className="text-[#B0E0E6] text-lg">{team.ownerCompanyName}</p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-center items-center">
                <FaTrophy className="mr-2" />
                <p className="text-[#B0E0E6] font-medium">
                  {team.teamChampions} IPL Championships
                </p>
              </div>
              <div className="flex justify-center items-center">
                <FaChartLine className="mr-2" />
                <p className="text-[#B0E0E6] font-medium">
                  Team Value:{" "}
                  <span className="font-bold">{team.teamValuation}</span>
                </p>
              </div>
              <div className="flex justify-center items-center">
                <FaUsers className="mr-2" />
                <p className="text-[#B0E0E6] font-medium">
                  Fan Base: <span className="font-bold">{team.fanBase}</span>
                </p>
              </div>
            </div>
            <div
              className="mt-4 pt-4  border-t  text-center "
              style={{ borderColor: teamColor }}
            >
              <p className="text-sm text-[#B0E0E6] font-semibold">
                Board of Directors
              </p>
              <div className="flex flex-wrap gap-2 mt-5 justify-center">
                {team.boardOfDirectors.map((director, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#202626] rounded-full text-xs text-[#B0E0E6] border"
                    style={{ borderColor: teamColor }}
                  >
                    {director}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Home Venue */}
          <div
            className="bg-[#202626] rounded-lg shadow-lg p-6 md:p-8 border text-center"
            style={{ borderColor: teamColor }}
          >
            <h2 className="text-2xl font-bold mb-6 text-[#E8EAF6]">
              Home Venue
            </h2>
            <img
              src={team.homeVenue.image}
              alt="Stadium"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="flex flex-col md:flex-row justify-center items-center">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-[#E8EAF6]">
                  {team.homeVenue.name}, {team.homeVenue.location}
                </h3>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center">
                    <FaMapMarkerAlt className=" mr-2" />
                    <p className="text-[#B0E0E6]">{team.homeVenue.location}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <FaUsers className=" mr-2" />
                    <p className="text-[#B0E0E6]">
                      Capacity: {team.homeVenue.capacity}
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <FaCalendar className=" mr-2" />
                    <p className="text-[#B0E0E6]">
                      Established: {team.homeVenue.established}
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <FaRulerCombined className=" mr-2" />
                    <p className="text-[#B0E0E6]">
                      Dimensions: {team.homeVenue.dimensions}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="mt-4 pt-4 border-t "
              style={{ borderColor: teamColor }}
            >
              <h4 className="text-sm font-semibold text-[#E8EAF6] mb-2">
                Facilities
              </h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {team.homeVenue.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#202626] rounded-full text-xs text-[#B0E0E6] border"
                    style={{ borderColor: teamColor }}
                  >
                    <i className="fas fa-parking mr-1"></i> {facility}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Auction Buys */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-[#E8EAF6]">
            Top Auction Buys
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.players.slice(0, 3).map((player, index) => (
              <div
                key={index}
                className="bg-[#202626] rounded-lg shadow-lg overflow-hidden border"
                style={{ borderColor: teamColor }}
              >
                <img
                  src={player.image}
                  alt={`Player ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#E8EAF6]">
                    {player.name}
                  </h3>
                  <p className="text-[#0047AB] font-bold text-lg">
                    ${(player.price / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-[#B0E0E6]">{player.role}</p>
                  <p className="text-sm text-[#B0E0E6]">
                    Previous: {player.previousTeam}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Gallery */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-[#E8EAF6]">
            Team Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.teamGallery.map((image, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden shadow-lg border"
                style={{ borderColor: teamColor }}
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Complete Squad */}
        <div>
          <h2 className="text-2xl font-bold mb-8 text-[#E8EAF6]">
            Complete Squad
          </h2>
          <div className="flex flex-wrap gap-4 mb-8 overflow-x-auto">
            {["Batsmen", "Bowlers", "All-rounders", "Wicket-keepers"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full whitespace-nowrap border ${
                    activeTab === tab.toLowerCase()
                      ? "text-white"
                      : "bg-[#202626] text-[#B0E0E6]"
                  }`}
                  style={{
                    backgroundColor:
                      activeTab === tab.toLowerCase() ? teamColor : "",
                    borderColor: teamColor,
                  }}
                >
                  {tab}
                </button>
              )
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {team.players.map((player, index) => (
              <div
                key={index}
                className="bg-[#202626] rounded-lg shadow-lg overflow-hidden border"
                style={{ borderColor: teamColor }}
              >
                <img
                  src={player.image}
                  alt={`Player ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#E8EAF6]">
                    {player.name}
                  </h3>
                  <p className="text-[#B0E0E6]">{player.role}</p>
                  <p className="text-sm text-[#B0E0E6]">
                    {player.battingStyle}
                  </p>
                  <p className="text-[#0047AB] font-bold mt-2">
                    ${(player.price / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teamdashboard;
