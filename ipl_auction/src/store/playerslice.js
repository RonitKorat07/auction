import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebaseconfig';

const playersRef = collection(db, "players");

// Original fetch all players
export const fetchPlayers = createAsyncThunk('players/fetchAll', async () => {
    const data = await getDocs(playersRef);
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

// New: Fetch players by team
export const fetchPlayersByTeam = createAsyncThunk(
    'players/fetchByTeam',
    async (teamName, { rejectWithValue }) => {
      try {
        // Validate teamName
        if (!teamName || typeof teamName !== 'string') {
          throw new Error('Invalid team name provided');
        }
  
        // Trim whitespace from team name
        const trimmedTeamName = teamName.trim();
        
        // Query nested field
        const q = query(
          playersRef,
          where("auction_detail.team", "==", trimmedTeamName)
        );
        
        const querySnapshot = await getDocs(q);
        
        // Debug logging
        console.log(`Found ${querySnapshot.size} players for team: ${trimmedTeamName}`);
        
        if (querySnapshot.empty) {
          console.warn(`No players found for team: ${trimmedTeamName}`);
          return [];
        }
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching players by team:', error);
        return rejectWithValue(error.message);
      }
    }
  );

// Enhanced initial state
const initialState = {
    players: [],          // All players or team-specific players
    loading: false,
    error: null,
    currentTeam: null,    // Track current team filter
    allPlayers: [],       // Store all players separately
    filteredPlayers: []   // Store filtered results
};

const playerSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        // Action to set current team filter
        setTeamFilter: (state, action) => {
            state.currentTeam = action.payload;
            if (action.payload) {
                state.filteredPlayers = state.allPlayers.filter(
                    player => player.team === action.payload
                );
            } else {
                state.filteredPlayers = state.allPlayers;
            }
        },
        // Action to clear filters
        clearFilters: (state) => {
            state.currentTeam = null;
            state.filteredPlayers = state.allPlayers;
        }
    },
    extraReducers: (builder) => {
        builder
            // Original fetch all players
            .addCase(fetchPlayers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlayers.fulfilled, (state, action) => {
                state.loading = false;
                state.players = action.payload;
                state.allPlayers = action.payload;
                state.filteredPlayers = action.payload;
            })
            .addCase(fetchPlayers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // New: Fetch by team
            .addCase(fetchPlayersByTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlayersByTeam.fulfilled, (state, action) => {
                state.loading = false;
                state.players = action.payload;
                state.filteredPlayers = action.payload;
            })
            .addCase(fetchPlayersByTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Export the new actions
export const { setTeamFilter, clearFilters } = playerSlice.actions;

export default playerSlice.reducer;