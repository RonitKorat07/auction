import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseconfig'; // Ensure correct import

// Reference to "team" collection in Firestore
const teamRef = collection(db, "teams");

// Async thunk to fetch team data
export const fetchTeam = createAsyncThunk('team/fetch', async () => {
    const data = await getDocs(teamRef);
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

// Initial state
const initialState = {
    teams: [],
    loading: false,
    error: null
};

// Redux slice
const teamslice = createSlice({
    name: 'team',
    initialState,
    reducers: {}, // You can add synchronous reducers if needed
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeam.fulfilled, (state, action) => {
                state.loading = false;
                state.teams = action.payload;
            })
            .addCase(fetchTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default teamslice.reducer;
