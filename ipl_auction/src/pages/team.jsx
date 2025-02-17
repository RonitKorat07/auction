import React, { useEffect, useState } from 'react';
import { db } from '../config/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';

const Team = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const teamCollection = collection(db, 'teams');
      const teamSnapshot = await getDocs(teamCollection);
      const teamList = teamSnapshot.docs.map((doc) => doc.data());
      setTeams(teamList);
    };

    fetchTeams();
  }, []);

  const sponsors = [
    { name: 'Tata Motors', logo: 'https://seeklogo.com/images/T/TATA-logo-B17191F4CA-seeklogo.com.png' },
    { name: 'Adidas', logo: 'https://images.seeklogo.com/logo-png/30/1/jio-logo-png_seeklogo-305444.png' },
    { name: 'CEAT Tyres', logo: 'https://images.seeklogo.com/logo-png/2/1/ceat-tyres-logo-png_seeklogo-27738.png' },
    { name: 'Dream11', logo: 'https://seeklogo.com/images/D/dream11-logo-A5D7BB9B54-seeklogo.com.png' },
  ];

  return (
    <div className="h-auto absolute w-full bg-gray-900">
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-100 mb-8 flex items-center justify-center">
            <i className="fas fa-trophy text-yellow-500 mr-3"></i>
            Cricket Teams
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teams.sort((a, b) => a.name.localeCompare(b.name)).map((team) => (
              <div
                key={team.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 border border-gray-700/50"
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

         {/* Sponsors Section */}
         <div className="max-w-7xl mx-auto mt-20 mb-16 bg-gray-800 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-100 mb-12 flex items-center justify-center">
            <i className="fas fa-handshake text-blue-400 mr-3"></i>
            Our Trusted Sponsors
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 flex items-center justify-center border border-gray-200 shadow-md hover:scale-105 hover:opacity-80 transform transition-all duration-300"
              >
                <img
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  className="w-20 h-20 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Team;
