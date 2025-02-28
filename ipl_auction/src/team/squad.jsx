import React from "react";

const Squad = () => {
  const players = [
    // Batsmen
    {
      name: "William Anderson",
      role: "Batsman",
      matches: 156,
      average: 48.5,
      speciality: "Right-handed Opening Batsman",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/98bb037f864d64e4d83822db177f3460.jpg",
      nationality: "England",
      achievements: "5000+ runs, Average: 48.5",
    },
    {
      name: "James Richardson",
      role: "Batsman",
      matches: 142,
      average: 45.8,
      speciality: "Left-handed Middle Order",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/d70658149ad2ea295f211ef2c19aad67.jpg",
      nationality: "Australia",
      achievements: "4800+ runs, Average: 45.8",
    },
    {
      name: "Rohit Sharma",
      role: "Batsman",
      matches: 198,
      average: 49.2,
      speciality: "Right-handed Opening Batsman",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/e33f6f2ad12abe40d2c15bc3346ce8d1.jpg",
      nationality: "India",
      achievements: "6500+ runs, Average: 49.2",
    },
    {
      name: "Kane Williamson",
      role: "Batsman",
      matches: 165,
      average: 52.3,
      speciality: "Right-handed Top Order",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/3971e4332a588c931e88b6df645e6975.jpg",
      nationality: "New Zealand",
      achievements: "7000+ runs, Average: 52.3",
    },
    {
      name: "David Warner",
      role: "Batsman",
      matches: 187,
      average: 46.8,
      speciality: "Left-handed Opening Batsman",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/998369c154e3a2082c699442c9a53e1f.jpg",
      nationality: "Australia",
      achievements: "5800+ runs, Average: 46.8",
    },
    {
      name: "Babar Azam",
      role: "Batsman",
      matches: 145,
      average: 50.1,
      speciality: "Right-handed Top Order",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/c9367335178e8ab74b550a44e339ca26.jpg",
      nationality: "Pakistan",
      achievements: "5200+ runs, Average: 50.1",
    },
    {
      name: "Quinton de Kock",
      role: "Batsman",
      matches: 154,
      average: 44.7,
      speciality: "Left-handed Wicket-keeper Batsman",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/8afbdda1c33dffb9fa6f6cdc0813df4a.jpg",
      nationality: "South Africa",
      achievements: "4900+ runs, Average: 44.7",
    },
    {
      name: "Tom Latham",
      role: "Batsman",
      matches: 134,
      average: 42.3,
      speciality: "Left-handed Wicket-keeper Batsman",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/c735ea6b73813d3a0f43818ac21b14aa.jpg",
      nationality: "New Zealand",
      achievements: "4500+ runs, Average: 42.3",
    },
    // All-Rounders
    {
      name: "Michael Thompson",
      role: "All-Rounder",
      matches: 178,
      average: 38.6,
      speciality: "Right-handed Batsman & Medium Fast Bowler",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/fc95cd02ec584827d88614f3cc1c9910.jpg",
      nationality: "South Africa",
      achievements: "5000+ runs, 200+ wickets",
    },
    {
      name: "Christopher Davis",
      role: "All-Rounder",
      matches: 134,
      average: 35.2,
      speciality: "Left-arm All-rounder",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/8b6e0730c50cc3607120432e37b98316.jpg",
      nationality: "New Zealand",
      achievements: "4500+ runs, 180+ wickets",
    },
    {
      name: "Ben Stokes",
      role: "All-Rounder",
      matches: 167,
      average: 41.5,
      speciality: "Left-handed Batsman & Right-arm Fast",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/04b02b58d357a3e74ef32dced772df12.jpg",
      nationality: "England",
      achievements: "5500+ runs, 190+ wickets",
    },
    {
      name: "Ravindra Jadeja",
      role: "All-Rounder",
      matches: 156,
      average: 36.8,
      speciality: "Left-handed Batsman & Left-arm Spin",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/8ed16934d015fb9c1b7a54aebf6b58e6.jpg",
      nationality: "India",
      achievements: "4000+ runs, 250+ wickets",
    },
    {
      name: "Mitchell Marsh",
      role: "All-Rounder",
      matches: 142,
      average: 34.9,
      speciality: "Right-handed Batsman & Medium Fast",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/a06c3f085c18c8270e12817c8e932ce6.jpg",
      nationality: "Australia",
      achievements: "3800+ runs, 160+ wickets",
    },
    // Bowlers
    {
      name: "Stuart Mitchell",
      role: "Bowler",
      matches: 145,
      average: 24.3,
      speciality: "Right-arm Fast Bowler",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/153f0777967c9ffbefcccad4fe5c9441.jpg",
      nationality: "England",
      achievements: "300+ wickets, Best figures: 7/42",
    },
    {
      name: "Daniel Wilson",
      role: "Bowler",
      matches: 128,
      average: 25.1,
      speciality: "Left-arm Spin Bowler",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/8c29d2f94f28f6047f501a6d3369cbd8.jpg",
      nationality: "India",
      achievements: "250+ wickets, Best figures: 6/35",
    },
    {
      name: "Pat Cummins",
      role: "Bowler",
      matches: 156,
      average: 22.8,
      speciality: "Right-arm Fast",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/278e173da14c10dc0b83def33ddcda3a.jpg",
      nationality: "Australia",
      achievements: "320+ wickets, Best figures: 8/38",
    },
    {
      name: "Kagiso Rabada",
      role: "Bowler",
      matches: 143,
      average: 23.4,
      speciality: "Right-arm Fast",
      imageUrl:
        "https://public.readdy.ai/ai/img_res/4d8bf8b8c13f7a0f834b76fab02405b6.jpg",
      nationality: "South Africa",
      achievements: "280+ wickets, Best figures: 7/32",
    },
  ];

  return (
    <div className="min-h-screen bg-[#202626]">
      <div className="max-w-[1440px] mx-auto px-8 py-25">
        <div>
          {/* Batsmen Section */}
          <div className="mb-16">
            <div className="flex flex-col items-center mb-12">
              <div className="flex items-center gap-4">
                <i className="fas fa-bat text-4xl text-blue-400"></i>
                <h2 className="text-4xl font-bold text-white">Batsmen</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {players
                .filter((player) => player.role === "Batsman")
                .map((player, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-b from-[#1F2937] to-[#111827] rounded-2xl overflow-hidden relative group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      <span className="text-white/70 bg-black/20 backdrop-blur-sm p-2 rounded-full">
                        <i className="fas fa-bat text-sm"></i>
                      </span>
                    </div>
                    <div className="relative overflow-hidden">
                      <img
                        src={player.imageUrl}
                        alt={player.name}
                        className="w-full h-[200px] sm:h-[250px] object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6 bg-gradient-to-b from-transparent to-black/40">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                          {player.name}
                        </h3>
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full border border-blue-500/20 backdrop-blur-sm">
                          {player.nationality}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">
                        {player.speciality}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-blue-300/80 text-sm font-medium">
                          {player.achievements}
                        </p>
                        <button className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-all duration-300 backdrop-blur-sm">
                          <i className="fas fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* All-Rounders Section */}
          <div className="mb-8">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-4xl font-bold text-white">All-Rounders</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {players
                .filter((player) => player.role === "All-Rounder")
                .map((player, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-b from-[#1F2937] to-[#111827] rounded-2xl overflow-hidden relative group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      <span className="text-white/70 bg-black/20 backdrop-blur-sm p-2 rounded-full">
                        <i className="fas fa-bat text-sm"></i>
                      </span>
                    </div>
                    <div className="relative overflow-hidden">
                      <img
                        src={player.imageUrl}
                        alt={player.name}
                        className="w-full h-[200px] sm:h-[250px] object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6 bg-gradient-to-b from-transparent to-black/40">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                          {player.name}
                        </h3>
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full border border-blue-500/20 backdrop-blur-sm">
                          {player.nationality}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">
                        {player.speciality}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-blue-300/80 text-sm font-medium">
                          {player.achievements}
                        </p>
                        <button className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-all duration-300 backdrop-blur-sm">
                          <i className="fas fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Bowlers Section */}
          <div className="mb-8">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-4xl font-bold text-white">Bowlers</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {players
                .filter((player) => player.role === "Bowler")
                .map((player, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-b from-[#1F2937] to-[#111827] rounded-2xl overflow-hidden relative group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      <span className="text-white/70 bg-black/20 backdrop-blur-sm p-2 rounded-full">
                        <i className="fas fa-bat text-sm"></i>
                      </span>
                    </div>
                    <div className="relative overflow-hidden">
                      <img
                        src={player.imageUrl}
                        alt={player.name}
                        className="w-full h-[200px] sm:h-[250px] object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6 bg-gradient-to-b from-transparent to-black/40">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                          {player.name}
                        </h3>
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full border border-blue-500/20 backdrop-blur-sm">
                          {player.nationality}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">
                        {player.speciality}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-blue-300/80 text-sm font-medium">
                          {player.achievements}
                        </p>
                        <button className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-all duration-300 backdrop-blur-sm">
                          <i className="fas fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Squad;
