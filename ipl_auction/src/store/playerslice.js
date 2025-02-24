import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseconfig'; // Ensure correct import

// Reference to "players" collection in Firestore
const playrRef = collection(db, "players");

// Async thunk to fetch player data
export const fetchPlayers = createAsyncThunk('players/fetch', async () => {
    const data = await getDocs(playrRef);
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

// Initial state
const initialState = {
    players: [],
    loading: false,
    error: null
};

// Redux slice
const playerSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {}, // You can add synchronous reducers if needed
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlayers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlayers.fulfilled, (state, action) => {
                state.loading = false;
                state.players = action.payload;
            })
            .addCase(fetchPlayers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default playerSlice.reducer;
