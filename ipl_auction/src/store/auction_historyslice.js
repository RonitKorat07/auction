import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseconfig'; 


export const history_fetchPlayers = createAsyncThunk(
  'historyplayer/fetchPlayers',
  async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'auction_history'));
      
      let allPlayers = [];
      querySnapshot.forEach((doc) => {
        const playersArray = doc.data().players || []; // players array nikalna hoga
        playersArray.forEach((player) => {
          allPlayers.push({
            id: player.playerId || doc.id,
            name: player.name || 'Unknown Player',
            role: player.role || 'Unknown Role',

            team: player.auctionDetails?.team || 'No Team',
            auctionStatus: player.auctionDetails?.auctionStatus || 'No status',
            bidHistory: player.auctionDetails?.bidHistory || 'No bidHistory',
            // basePrice: player.auctionDetails?.soldPrice || 0,
            finalBid: player.auctionDetails?.soldPrice || 0,
            imageUrl: player.image || 'default-player-image.jpg',
          });
        });
      });

      return allPlayers;
    } catch (error) {
      console.error("Error fetching players:", error);
      throw error;
    }
  }
);


const initialState = {
  players: [],  // Changed from 'data' to 'players' to match your initial state
  status: 'idle',
  error: null
};

const history_playerSlice = createSlice({
  name: 'historyplayer',  // Changed from 'players' to 'historyplayer' to match your store
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(history_fetchPlayers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(history_fetchPlayers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.players = action.payload;
      })
      .addCase(history_fetchPlayers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default history_playerSlice.reducer;