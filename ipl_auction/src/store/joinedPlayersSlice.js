import { createSlice } from "@reduxjs/toolkit";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseconfig";

const initialState = {
  joinedPlayers: [],
  currentPlayer: null,
  loading: false,
  error: null,
  auctionStatus: "not-started", // 'not-started', 'running', 'paused', 'ended'
  currentPlayerIndex: 0,
  timeLeft: 30, // Timer in seconds
  currentBid: 2000000, // Default bid amount
  auctionId: null,
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
  decrementTimeLeft,
  resetAuctionState,
} = joinedPlayersSlice.actions;

const handleFirestoreError = (error, dispatch) => {
  console.error("Firestore error:", error);
  dispatch(setError(error.message));
};

// Fetch joined players with real-time updates
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
      }
      dispatch(setLoading(false));
    },
    (error) => {
      handleFirestoreError(error, dispatch);
      dispatch(setLoading(false));
    }
  );

  // Return the unsubscribe function for the component to manage
  return unsubscribe;
};

// Fetch current player data with real-time updates
export const fetchCurrentPlayer = (auctionId) => (dispatch) => {
  dispatch(setLoading(true));
  const currentPlayerRef = doc(db, "currentplayer", auctionId);
  const unsubscribe = onSnapshot(
    currentPlayerRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        dispatch(setCurrentPlayer(data.currentPlayer || null));
        dispatch(setCurrentBid(data?.currentPlayer?.auction_detail?.base_price));
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

  // Return the unsubscribe function for the component to manage
  return unsubscribe;
};

// Start auction
export const startAuction = (auctionId, initialPlayer, players = []) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(resetAuctionState());

    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await setDoc(
      currentPlayerRef,
      {
        currentPlayer: initialPlayer,
        currentBid: 165000000,
        timeLeft: 30,
        auctionStatus: "running",
      },
      { merge: true }
    );

    dispatch(fetchJoinedPlayers(auctionId, players));
    dispatch(fetchCurrentPlayer(auctionId));
  } catch (error) {
    handleFirestoreError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

// Pause auction
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

// Resume auction
export const resumeAuction = (auctionId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await updateDoc(currentPlayerRef, { auctionStatus: "running" });
  } catch (error) {
    handleFirestoreError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

// End auction
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

// Move to next player
export const nextPlayer = (auctionId) => async (dispatch, getState) => {
  const { joinedPlayers, currentPlayerIndex } = getState().joinedPlayers;
  if (currentPlayerIndex < joinedPlayers.length - 1) {
    const newIndex = currentPlayerIndex + 1;
    const nextPlayerData = joinedPlayers[newIndex];
    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await updateDoc(currentPlayerRef, {
      currentPlayer: nextPlayerData,
      currentBid: 165000000,
      timeLeft: 30,
    });
    dispatch(setCurrentPlayerIndex(newIndex));
  } else {
    dispatch(endAuction(auctionId));
  }
};

// Timer logic
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