import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeam } from '../store/teamslice'; 
import { FaHandshake } from "react-icons/fa6";


const Team = () => {
  const dispatch = useDispatch();
  
  // Get team data and loading state from Redux store
  const {teams} = useSelector((state) => state.team);

  useEffect(() => {
    dispatch(fetchTeam());
  }, [dispatch]);


  return (
    <div className="h-auto relative w-full bg-[#202626]">
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-100 mb-8 flex items-center justify-center">
            <i className="fas fa-trophy text-yellow-500 mr-3"></i>
            Cricket Teams
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teams.slice().sort((a, b) => a.name.localeCompare(b.name)).map((team) => (
              <div
                key={team.id}
                className="bg-[#202626] from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 border border-gray-700/50"
              >
                <div className="p-6 relative group">
                  <div
                    className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-opacity-20 flex items-center justify-center bg-white"
                    style={{ borderColor: team.color }}
                  >
                    <img
                      src={team.logo || `https://readdy.ai/api/search-image?query=A professional high quality modern minimalist cricket team logo with ${team.color} colors`}
                      alt={`${team.name} logo`}
                      className="w-[80%] h-[80%] object-contain transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2 text-white group-hover:text-blue-400 transition-colors duration-300 truncate px-2 mx-auto">
                    {team.name}
                  </h3>
                  <div
                    className="w-16 h-2 mx-auto mb-4 rounded-full transition-all duration-500 group-hover:w-24"
                    style={{ backgroundColor: team.color }}
                  ></div>
                  <button
                    className="w-full py-2 text-white rounded-full whitespace-nowrap transition-all duration-500 hover:shadow-lg relative overflow-hidden group"
                    style={{
                      backgroundColor: team.color,
                      transform: 'translateZ(0)',
                    }}
                  >
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">View Details</span>
                    <div
                      className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                    ></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Team;
