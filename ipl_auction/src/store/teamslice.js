import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseconfig"; // Ensure correct path

// Async thunk to fetch team data from Firestore
export const fetchTeam = createAsyncThunk("team/fetch", async () => {
    const teamRef = collection(db, "teams");
    const data = await getDocs(teamRef);
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Returns an array of teams
});

// Initial state
const initialState = {
    id: null, // Set as null instead of number
    teams: [],
    loading: false,
    error: null,
};

// Redux slice
const teamSlice = createSlice({
    name: "team",
    initialState,
    reducers: {}, // Remove if no synchronous reducers are needed
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeam.fulfilled, (state, action) => {
                state.loading = false;
                state.teams = action.payload;
                if (action.payload.length > 0) {
                    state.id = action.payload // Set first team ID
                }
            })
            .addCase(fetchTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default teamSlice.reducer;
