import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../config/firebaseconfig";
import { collection, addDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";

// Fetch Auctions from Firestore with real-time updates
export const fetchAuctions = createAsyncThunk(
  "auctions/fetchAuctions",
  async (_, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(
        collection(db, "auctions"),
        (querySnapshot) => {
          const auctions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          dispatch(setAuctions(auctions)); // Update Redux state
          resolve(auctions);
        },
        (error) => reject(error)
      );

      return () => unsubscribe();
    });
  }
);

// ✅ FIXED: Create Auction in Firestore
export const createAuction = createAsyncThunk(
  "auctions/createAuction",
  async (auctionData, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "auctions"), auctionData);
      return { id: docRef.id, ...auctionData }; // Return new auction data
    } catch (error) {
      console.error("Error creating auction:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateAuctionStatus = createAsyncThunk(
  "auctions/updateAuctionStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const auctionRef = doc(db, "auctions", id);
      await updateDoc(auctionRef, { status, isLive: status === "live" });
      return { id, status };
    } catch (error) {
      console.error("Error updating auction:", error);
      return rejectWithValue(error.message);
    }
  }
);

const auctionSlice = createSlice({
  name: "auctions",
  initialState: {
    auctions: [],
    loading: false,
    error: null,
  },
  reducers: {
    setAuctions: (state, action) => {
      state.auctions = action.payload; // Update state with new auctions
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuctions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuctions.fulfilled, (state, action) => {
        state.loading = false;
        state.auctions = action.payload;
      })
      .addCase(fetchAuctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Handle Create Auction Cases
      .addCase(createAuction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAuction.fulfilled, (state, action) => {
        state.loading = false;
        state.auctions.push(action.payload);
      })
      .addCase(createAuction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Handle Update Auction Status Cases
      .addCase(updateAuctionStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAuctionStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.auctions.findIndex((auction) => auction.id === action.payload.id);
        if (index !== -1) {
          state.auctions[index].status = action.payload.status;
          state.auctions[index].isLive = action.payload.status === "live";
        }
      })
      .addCase(updateAuctionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAuctions } = auctionSlice.actions;
export default auctionSlice.reducer;
