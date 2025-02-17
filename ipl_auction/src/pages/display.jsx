import React, { useState, useEffect } from 'react';
import {db} from '../config/firebaseconfig';
import {collection, getDocs} from 'firebase/firestore'

const Display = () => {
  const [player, setPlayers] = useState([]);

  // useEffect(() => {
  //   try {
  //     if (playerData && playerData.players) {
  //       setPlayers(playerData.players);
  //     } else {
  //       console.error('Invalid data structure in data.json');
  //       setPlayers([]);
  //     }
  //   } catch (error) {
  //     console.error('Error loading player data:', error);
  //     setPlayers([]);
  //   }
  // }, []);

  const playrref = collection(db,"players");

  useEffect(()=>{
    const getplayers = async() =>{
        const data = await getDocs(playrref)
       const playerr = data.docs.map((doc)=>({...doc.data()}))
       setPlayers(playerr)
    }
    getplayers();
  },[])


  

  return (
    <div className="h-auto bg-[#202626] flex justify-center items-center pt-20 w-full absolute">
    <div className="container mx-auto px-4 py-8 flex justify-center w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full max-w-6xl mx-auto">
        {player.map((player, index) => (
          <div key={index} className="bg-white/10 rounded-lg shadow-md overflow-hidden backdrop-blur-sm border border-white/20">
            <img 
              src={player.image} 
              alt={player.name}
              className="w-full h-90 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Player+Image'; // Fallback image
              }}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white">{player.name}</h3>
              <h3 className="text-lg font-semibold text-white">{player.id}</h3>
              <h3 className="text-lg font-semibold text-white">{player.auction_detail?.base_price}</h3>
              <p className="text-white/80">{player.player_role}</p>
              <p className="text-sm text-white/60">{player.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  

  );
};

export default Display;
