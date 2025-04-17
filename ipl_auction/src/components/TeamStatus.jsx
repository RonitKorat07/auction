import React, { useEffect, useState } from "react";
import {
  FaShieldAlt,
  FaWallet,
  FaUsers,
  FaPuzzlePiece,
} from "react-icons/fa";
import { db } from "../config/firebaseconfig"; // Import your Firebase config
import { collection, onSnapshot } from "firebase/firestore";

const TeamStatus = ({ selectedauction }) => {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [joinedteams, setJoinedteams] = useState([]);
    
  useEffect(() => {
    // Set up real-time listener for teams
    const teamsUnsub = onSnapshot(collection(db, "teams"), (snapshot) => {
      const teamsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeams(teamsData);
    });

    // Set up real-time listener for players
    const playersUnsub = onSnapshot(collection(db, "players"), (snapshot) => {
      const playersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlayers(playersData);
    });

    return () => {
      teamsUnsub();
      playersUnsub();
    };
  }, []);

  useEffect(() => {
    if (selectedauction && teams.length > 0) {
      const allteams = selectedauction.teams || [];
      const updatedJoinedteams = allteams.map((teamname) =>
        teams.find((team) => team.name === teamname)
      );
      setJoinedteams(updatedJoinedteams);
    }
  }, [selectedauction, teams]);

  return (
    <div className="mt-8 bg-[#2C2F32] rounded-lg shadow-lg p-4 sm:p-6 border border-[#0047AB]">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
        <FaShieldAlt className="text-[#0047AB]" />
        Teams Status
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {joinedteams.map((team, index) => {
          const teamPlayers = players.filter(player => 
            player.auction_detail?.team === team?.name
          );
          const playerCount = teamPlayers.length;

          const formatCurrency = (amount) => {
            if (!amount) return "₹0";
            return amount < 10000000 
              ? `₹${(amount / 100000).toFixed(2)} L` 
              : `₹${(amount / 10000000).toFixed(2)} Cr`;
          };

          return (
            <div
              key={team?.id || index}
              className="flex flex-col items-center bg-[#2C2F32] rounded-lg p-4 border border-[#0047AB] hover:bg-[#0047AB]/10 transition-all"
            >
              <img
                src={team?.logo}
                alt={team?.name}
                className="w-20 h-20 sm:w-24 sm:h-24 mb-4 object-contain"
              />
              <h4 className="font-bold text-base sm:text-lg text-white text-center mb-4">
                {team?.name}
              </h4>
              <div className="w-full space-y-2">
                {[
                  {
                    label: "Budget",
                    value: formatCurrency(team?.budget),
                    icon: <FaWallet className="text-[#0047AB]" />,
                    color: "text-green-400",
                  },
                  {
                    label: "Players",
                    value: `${playerCount}/25`,
                    icon: <FaUsers className="text-[#0047AB]" />,
                  },
                  {
                    label: "Total Spent",
                    value: formatCurrency(team?.totalSpent),
                    icon: <FaPuzzlePiece className="text-[#0047AB]" />,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-[#2C2F32] rounded-lg p-2"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="text-gray-300 text-sm">
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={`${
                        item.color || "text-white"
                      } font-semibold text-sm`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamStatus;