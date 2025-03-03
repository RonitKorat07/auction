// store/auctionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../config/firebaseconfig";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";

// Fetch Auctions from Firestore
export const fetchAuctions = createAsyncThunk(
  "auctions/fetchAuctions",
  async () => {
    const querySnapshot = await getDocs(collection(db, "auctions"));
    const auctions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return auctions;
  }
);

// Create Auction in Firestore
export const createAuction = createAsyncThunk(
  "auctions/createAuction",
  async (auctionData) => {
    const docRef = await addDoc(collection(db, "auctions"), auctionData);
    return { id: docRef.id, ...auctionData };
  }
);

// Update Auction Status (e.g., start auction)
export const updateAuctionStatus = createAsyncThunk(
  "auctions/updateAuctionStatus",
  async ({ id, status }) => {
    const auctionRef = doc(db, "auctions", id);
    await updateDoc(auctionRef, { status, isLive: status === "live" });
    return { id, status };
  }
);

const auctionSlice = createSlice({
  name: "auctions",
  initialState: {
    auctions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Auctions
      .addCase(fetchAuctions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuctions.fulfilled, (state, action) => {
        state.loading = false;
        state.auctions = action.payload;
      })
      .addCase(fetchAuctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create Auction
      .addCase(createAuction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAuction.fulfilled, (state, action) => {
        state.loading = false;
        state.auctions.push(action.payload);
      })
      .addCase(createAuction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Auction Status
      .addCase(updateAuctionStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAuctionStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.auctions.findIndex(
          (auction) => auction.id === action.payload.id
        );
        if (index !== -1) {
          state.auctions[index].status = action.payload.status;
          state.auctions[index].isLive = action.payload.status === "live";
        }
      })
      .addCase(updateAuctionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default auctionSlice.reducer;