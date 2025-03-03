import { configureStore } from '@reduxjs/toolkit';
import playerreducer from '../store/playerslice';
import teamreducer from '../store/teamslice'; 
import auctionReducer from "../store/auctionslice";

export const store = configureStore({
  reducer: {
    player: playerreducer,
    team: teamreducer,
    auction: auctionReducer,
  },
});

