// auction_historyslice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseconfig';

export const history_fetchAuctionDetails = createAsyncThunk(
  'historyplayer/fetchAuctionDetails',
  async (auctionId) => {
    try {
      const docRef = doc(db, 'auction_history', auctionId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const auctionData = docSnap.data();
        
        // Process players array
        const players = auctionData.players || [];
        const processedPlayers = players.map((player) => ({
          id: player.playerId,
          name: player.name || 'Unknown Player',
          role: player.role || 'Unknown Role',
          team: player.auctionDetails?.team || 'No Team',
          auctionStatus: player.auctionDetails?.auctionStatus || 'No status',
          bidHistory: player.auctionDetails?.bidHistory || [],
          finalBid: player.auctionDetails?.soldPrice || 0,
          imageUrl: player.image || 'default-player-image.jpg',
          auctionId: auctionId
        }));
        
        // Process teams array
        const teams = auctionData.teams || [];
        const processedTeams = teams.map((team) => ({
          id: team.teamId || 'unknown-team-id',
          name: team.name || 'Unknown Team',
          owner: team.owner || 'Unknown Owner',
          logo: team.logo || 'default-team-logo.jpg',
          budget: team.budgetDetails?.initialBudget || 0,
          remainingBudget: team.budgetDetails?.remainingBudget || 0,
          totalSpent: team.budgetDetails?.totalSpent || 0 ,
          playersCount: team.totalPlayers || 0,
          roleCounts: {
            "All-rounder": team.roleCounts?.allRounders || 0,
            "Batsman": team.roleCounts?.batsman || 0,
            "Bowler": team.roleCounts?.bowlers || 0
          },
          auctionId: auctionId
        }));
        
        return {
          id: auctionId,
          ...auctionData,
          players: processedPlayers,
          teams: processedTeams  // Add the processed teams array to the returned object
        };
      } else {
        throw new Error("Auction not found");
      }
    } catch (error) {
      console.error("Error fetching auction details:", error);
      throw error;
    }
  }
);

const initialState = {
  currentAuction: null,
  status: 'idle',
  error: null
};

const history_playerSlice = createSlice({
  name: 'historyplayer',
  initialState,
  reducers: {
    clearCurrentAuction: (state) => {
      state.currentAuction = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(history_fetchAuctionDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(history_fetchAuctionDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentAuction = action.payload;
      })
      .addCase(history_fetchAuctionDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { clearCurrentAuction } = history_playerSlice.actions;
export default history_playerSlice.reducer;