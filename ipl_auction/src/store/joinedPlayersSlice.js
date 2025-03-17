import { createSlice } from "@reduxjs/toolkit";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseconfig";

const initialState = {
  joinedPlayers: [],
  currentPlayer: null,
  loading: false,
  error: null,
  auctionStatus: "not-started",
  currentPlayerIndex: 0,
  timeLeft: 30,
  // currentBid: 2000000,
  auctionId: null,
  upcomingPlayers: [],
};

const joinedPlayersSlice = createSlice({
  name: "joinedPlayers",
  initialState,
  reducers: {
    setJoinedPlayers: (state, action) => {
      state.joinedPlayers = action.payload;
    },
    setCurrentPlayer: (state, action) => {
      state.currentPlayer = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setAuctionStatus: (state, action) => {
      state.auctionStatus = action.payload;
    },
    setCurrentPlayerIndex: (state, action) => {
      state.currentPlayerIndex = action.payload;
    },
    setTimeLeft: (state, action) => {
      state.timeLeft = action.payload;
    },
    setCurrentBid: (state, action) => {
      state.currentBid = action.payload;
    },
    setAuctionId: (state, action) => {
      state.auctionId = action.payload;
    },
    setUpcomingPlayers: (state, action) => {
      state.upcomingPlayers = action.payload;
    },
    decrementTimeLeft: (state) => {
      if (state.timeLeft > 0) state.timeLeft -= 1;
    },
    resetAuctionState: (state) => {
      state.joinedPlayers = [];
      state.currentPlayer = null;
      state.auctionStatus = "not-started";
      state.currentPlayerIndex = 0;
      state.timeLeft = 30;
      state.currentBid = 165000000;
      state.auctionId = null;
      state.upcomingPlayers = [];
    },
  },
});

export const {
  setJoinedPlayers,
  setCurrentPlayer,
  setLoading,
  setError,
  setAuctionStatus,
  setCurrentPlayerIndex,
  setTimeLeft,
  setCurrentBid,
  setAuctionId,
  setUpcomingPlayers,
  decrementTimeLeft,
  resetAuctionState,
} = joinedPlayersSlice.actions;

const handleFirestoreError = (error, dispatch) => {
  console.error("Firestore error:", error);
  dispatch(setError(error.message));
};

export const fetchJoinedPlayers = (auctionId, players = []) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setAuctionId(auctionId));

  const auctionDocRef = doc(db, "auctions", auctionId);
  const unsubscribe = onSnapshot(
    auctionDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const auctionData = docSnap.data();
        const allPlayers = auctionData.selectedPlayers || [];
        const updatedJoinedPlayers = allPlayers
          .map((playerId) => players.find((player) => player.id === playerId))
          .filter((p) => p !== undefined);
        dispatch(setJoinedPlayers(updatedJoinedPlayers));
        dispatch(fetchUpcomingPlayersRealtime(auctionId)); // Fetch upcoming players here
      }
      dispatch(setLoading(false));
    },
    (error) => {
      handleFirestoreError(error, dispatch);
      dispatch(setLoading(false));
    }
  );

  return unsubscribe;
};

export const fetchCurrentPlayer = (auctionId) => (dispatch) => {
  dispatch(setLoading(true));
  const currentPlayerRef = doc(db, "currentplayer", auctionId);
  const unsubscribe = onSnapshot(
    currentPlayerRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        dispatch(setCurrentPlayer(data.currentPlayer || null));
        dispatch(setCurrentBid(data?.currentPlayer?.auction_detail?.current_bid || data?.currentPlayer?.auction_detail?.base_price));
        dispatch(setTimeLeft(data.timeLeft || 30));
        dispatch(setAuctionStatus(data.auctionStatus || "not-started"));
      }
      dispatch(setLoading(false));
    },
    (error) => {
      handleFirestoreError(error, dispatch);
      dispatch(setLoading(false));
    }
  );

  return unsubscribe;
};

export const updateCurrentBid = ({ auctionId, bidAmount, teamName, teamLogo }) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    console.log("Updating Firestore with auctionId:", auctionId, "and bidAmount:", bidAmount);

    const currentPlayerRef = doc(db, "currentplayer", auctionId);

    // Get the current bid history
    const currentPlayerDoc = await getDoc(currentPlayerRef);
    if (!currentPlayerDoc.exists()) {
      throw new Error("Current player document does not exist.");
    }

    const currentBidHistory = currentPlayerDoc.data()?.currentPlayer?.auction_detail?.bidHistory || [];

    // Add the new bid to the bid history
    const newBidEntry = {
      teamName,
      teamLogo,
      bidAmount,
      timestamp: new Date().toISOString(),
    };

    const updatedBidHistory = [...currentBidHistory, newBidEntry];

    // Update Firestore with the new bid and bid history
    await updateDoc(currentPlayerRef, {
      "currentPlayer.auction_detail.current_bid": bidAmount,
      "currentPlayer.auction_detail.bid_history": updatedBidHistory,
    });

    console.log("Firestore update successful");
    dispatch(setCurrentBid(bidAmount));
  } catch (error) {
    console.error("Firestore update error:", error);
    throw error; // Re-throw the error to be caught by handleBid
  } finally {
    dispatch(setLoading(false));
  }
};

// Start auction
export const fetchUpcomingPlayersRealtime = (auctionId) => (dispatch) => {
  const currentPlayerRef = doc(db, "currentplayer", auctionId);

  return onSnapshot(currentPlayerRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Fetch upcomingPlayers directly from Firestore
      const upcomingPlayers = data.upcomingPlayers || [];

      dispatch(setUpcomingPlayers(upcomingPlayers));
    }
  });
};



export const startAuction = (auctionId, initialPlayer, players = []) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(resetAuctionState());

    // Get upcoming players (next 4 players after initialPlayer)
    const upcomingPlayers = players.slice(1, 5);

    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await setDoc(
      currentPlayerRef,
      {
        currentPlayer: initialPlayer,
        timeLeft: 30,
        auctionStatus: "running",
        upcomingPlayers:upcomingPlayers, // Store upcoming players in Firestore
      },
      { merge: true }
    );

    dispatch(fetchJoinedPlayers(auctionId, players));
    dispatch(fetchCurrentPlayer(auctionId));
    dispatch(setUpcomingPlayers(upcomingPlayers));

  } catch (error) {
    handleFirestoreError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};


export const pauseAuction = (auctionId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await updateDoc(currentPlayerRef, { auctionStatus: "paused" });
  } catch (error) {
    handleFirestoreError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

export const resumeAuction = (auctionId) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await updateDoc(currentPlayerRef, { auctionStatus: "running" });

    const { joinedPlayers, currentPlayerIndex, upcomingPlayers } = getState().joinedPlayers;
    
    if (upcomingPlayers.length === 0) {
      const newUpcomingPlayers = joinedPlayers.slice(currentPlayerIndex + 1, currentPlayerIndex + 5);
      dispatch(setUpcomingPlayers(newUpcomingPlayers));
      
      // Update Firestore with new upcoming players
      await updateDoc(currentPlayerRef, { upcomingPlayers: newUpcomingPlayers });
    }

  } catch (error) {
    handleFirestoreError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};



export const endAuction = (auctionId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await updateDoc(currentPlayerRef, { auctionStatus: "ended" });
  } catch (error) {
    handleFirestoreError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

export const nextPlayer = (auctionId) => async (dispatch, getState) => {
  const { joinedPlayers, currentPlayerIndex } = getState().joinedPlayers;
  
  if (currentPlayerIndex < joinedPlayers.length - 1) {
    const newIndex = currentPlayerIndex + 1;
    const nextPlayerData = joinedPlayers[newIndex];

    dispatch(setCurrentPlayerIndex(newIndex));

    // Get new upcoming players
    const newUpcomingPlayers = joinedPlayers.slice(newIndex + 1, newIndex + 5);

    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await updateDoc(currentPlayerRef, {
      currentPlayer: nextPlayerData,
      "currentPlayer.auction_detail.current_bid": nextPlayerData.auction_detail.base_price,
      timeLeft: 30,
      upcomingPlayers: newUpcomingPlayers, // Update upcoming players in Firestore
    });

    dispatch(setCurrentPlayer(nextPlayerData));
    dispatch(setUpcomingPlayers(newUpcomingPlayers));

  } else {
    dispatch(endAuction(auctionId));
  }
};

export const startTimer = (auctionId) => (dispatch, getState) => {
  const timer = setInterval(async () => {
    const { auctionStatus, timeLeft } = getState().joinedPlayers;
    if (auctionStatus !== "running") {
      clearInterval(timer);
      return;
    }
    if (timeLeft > 0) {
      dispatch(decrementTimeLeft());
      const currentPlayerRef = doc(db, "currentplayer", auctionId);
      await updateDoc(currentPlayerRef, { timeLeft: timeLeft - 1 });
    } else {
      clearInterval(timer);
      dispatch(nextPlayer(auctionId));
    }
  }, 1000);
};

export default joinedPlayersSlice.reducer;