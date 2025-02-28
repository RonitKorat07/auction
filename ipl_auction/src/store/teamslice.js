import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseconfig"; // Adjust the path as needed

// Async thunk to fetch team data from Firestore
export const fetchTeamemail = createAsyncThunk(
  "team/fetch",
  async (email) => {
    const teamRef = collection(db, "teams");
    const q = query(teamRef, where("email", "==", email)); // Query to match email
    const data = await getDocs(q);
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);
export const fetchTeam = createAsyncThunk(
  "team/fetch",
  async () => {
    const teamRef = collection(db, "teams");
  
    const data = await getDocs(teamRef);
    return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
);

// Initial state
const initialState = {
  teams: [],
  loading: false,
  error: null,
};

// Redux slice
const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {}, // No synchronous reducers needed
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
  },
});

export default teamSlice.reducer;