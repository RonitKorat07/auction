import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../config/firebaseconfig";
import { collection, addDoc, doc, updateDoc, onSnapshot, query, getDocs } from "firebase/firestore";

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
          dispatch(setAuctions(auctions));
          resolve(auctions);
        },
        (error) => reject(error)
      );
      return () => unsubscribe();
    });
  }
);

export const createAuction = createAsyncThunk(
  "auctions/createAuction",
  async (auctionData, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "auctions"), auctionData);
      return { id: docRef.id, ...auctionData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPreviousAuctionData = createAsyncThunk(
  "auctions/resetData",
  async (_, { rejectWithValue }) => {
    try {
      // Reset players
      const playersQuery = query(collection(db, "players"));
      const playersSnapshot = await getDocs(playersQuery);
      
      const playerPromises = playersSnapshot.docs.map(doc => 
        updateDoc(doc.ref, {
          "auction_detail.auction_status": "",
          "auction_detail.sold_price": 0,
          "auction_detail.team": "",
        })
      );
      
      // Reset teams
      const teamsQuery = query(collection(db, "teams"));
      const teamsSnapshot = await getDocs(teamsQuery);
      
      const teamPromises = teamsSnapshot.docs.map(doc => 
        updateDoc(doc.ref, {
          "totalSpent": 0,
          "remainingBudget": 1200000000
        })
      );
      
      await Promise.all([...playerPromises, ...teamPromises]);
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAuctionStatus = createAsyncThunk(
  "auctions/updateAuctionStatus",
  async ({ id, status }, { rejectWithValue, dispatch }) => {
    try {
      const auctionRef = doc(db, "auctions", id);
      await updateDoc(auctionRef, { status, isLive: status === "live" });

      if (status === "live") {
        await dispatch(resetPreviousAuctionData()).unwrap();
      }

      return { id, status };
    } catch (error) {
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
      state.auctions = action.payload;
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