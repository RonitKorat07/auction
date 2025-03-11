import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeam } from "../store/teamslice";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Team = () => {
  const dispatch = useDispatch();
  const { teams, loading, error } = useSelector((state) => state.team);
  const mainRef = useRef(null);
  const teamCardsRef = useRef([]);

  useEffect(() => {
    dispatch(fetchTeam());
  }, [dispatch]);

  gsap.registerPlugin();
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
          <h2 className="text-3xl font-bold text-gray-100 mb-8 flex items-center justify-center">
            <i className="fas fa-trophy text-yellow-500 mr-3"></i>
            Cricket Teams
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teams
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((team, index) => (
                <div
                  key={team.id}
                  ref={(el) => (teamCardsRef.current[index] = el)}
                  className="bg-[#202626] from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 border border-[#0047AB]"
                >
                  <div className="p-6 relative group">
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

                    <Link
                      to={`/teamprofile/${team.id}`}
                      className="text-white font-bold hover:text-gray-300 p-2 transition-colors"
                    >
                      <button
                        className="w-full py-2 text-white rounded-full whitespace-nowrap transition-all duration-500 hover:shadow-lg relative overflow-hidden group hover:cursor-pointer"
                        style={{
                          backgroundColor: team.color,
                          transform: "translateZ(0)",
                        }}
                      >
                        View Details
                        <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                      </button>
                    </Link>
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
