import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeam } from "../store/teamslice";
import { FaHandshake } from "react-icons/fa6";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Team = () => {
  const dispatch = useDispatch();
  const mainRef = useRef(null);
  const teamCardsRef = useRef([]);

  const { teams, loading, error } = useSelector((state) => state.team);

  useEffect(() => {
    dispatch(fetchTeam());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && teams.length > 0) {
      // Animate main content from bottom
      gsap.fromTo(
        mainRef.current,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: mainRef.current,
            start: "top center+=100",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate team cards with stagger and scroll
      teamCardsRef.current.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            y: 100,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.1,
            delay: index * 0.03,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top bottom-=100",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }
  }, [loading, teams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#202626] to-[#1a1f1f]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#202626] to-[#1a1f1f]">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="h-auto relative w-full bg-[#202626]">
      <main ref={mainRef} className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-8 px-2 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-100 flex items-center text-center sm:text-left">
              <i className="fas fa-trophy text-yellow-500 mr-3 text-lg sm:text-xl md:text-2xl lg:text-3xl"></i>
              Cricket Teams
            </h2>
            <button className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 hover:cursor-pointer text-sm sm:text-base">
              <FaPlus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Add Team
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teams
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((team, index) => (
                <div
                  key={team.id}
                  ref={(el) => (teamCardsRef.current[index] = el)}
                  className="bg-[#202626] from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 border border-gray-700/50"
                >
                  <div className="p-6 relative group">
                    <div className="absolute top-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors bg-gray-800/50 rounded-lg hover:cursor-pointer"
                        onClick={() => handleEditTeam(team.id)}
                        title="Edit Team"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        className="p-2 text-red-400 hover:text-red-300 transition-colors bg-gray-800/50 rounded-lg hover:cursor-pointer"
                        onClick={() => handleDeleteTeam(team.id)}
                        title="Delete Team"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                    <div
                      className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-opacity-20 flex items-center justify-center bg-white"
                      style={{ borderColor: team.color }}
                    >
                      <img
                        src={
                          team.logo ||
                          `https://readdy.ai/api/search-image?query=A professional high quality modern minimalist cricket team logo with ${team.color} colors`
                        }
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
                        transform: "translateZ(0)",
                      }}
                    >
                      <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                        View Details
                      </span>
                      <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
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
