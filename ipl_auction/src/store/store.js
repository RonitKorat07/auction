import { configureStore } from '@reduxjs/toolkit';
import playerreducer from '../store/playerslice';
import teamreducer from '../store/teamslice'; 
import auctionReducer from "../store/auctionslice";
import joinedPlayersReducer from "../store/joinedPlayersSlice";

import history_playerReducer  from '../store/auction_historyslice';

import playersReducer from '../store/playerslice'; // Make sure this import exists



export const store = configureStore({
  reducer: {
    player: playerreducer,
    team: teamreducer,
    auction: auctionReducer,
    joinedPlayers : joinedPlayersReducer,

    historyplayer : history_playerReducer,

    players: playersReducer // This key must match what you use in useSelector


  },
});

