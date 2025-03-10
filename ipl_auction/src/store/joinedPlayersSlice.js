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
  currentBid: 165000000, // Default bid amount
  auctionId: null,
  unsubscribeJoinedPlayers: null,
  unsubscribeCurrentPlayer: null,
};

const joinedPlayersSlice = createSlice({
  name: "joinedPlayers",
  initialState,
  reducers: {
    setJoinedPlayers: (state, action) => { state.joinedPlayers = action.payload; },
    setCurrentPlayer: (state, action) => { state.currentPlayer = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
    setAuctionStatus: (state, action) => { state.auctionStatus = action.payload; },
    setCurrentPlayerIndex: (state, action) => { state.currentPlayerIndex = action.payload; },
    setTimeLeft: (state, action) => { state.timeLeft = action.payload; },
    setCurrentBid: (state, action) => { state.currentBid = action.payload; },
    setAuctionId: (state, action) => { state.auctionId = action.payload; },
    decrementTimeLeft: (state) => {
      state.timeLeft = state.timeLeft > 0 ? state.timeLeft - 1 : 30;
    },
    setUnsubscribeJoinedPlayers: (state, action) => {
      if (state.unsubscribeJoinedPlayers) state.unsubscribeJoinedPlayers();
      state.unsubscribeJoinedPlayers = action.payload;
    },
    setUnsubscribeCurrentPlayer: (state, action) => {
      if (state.unsubscribeCurrentPlayer) state.unsubscribeCurrentPlayer();
      state.unsubscribeCurrentPlayer = action.payload;
    },
    resetAuctionState: (state) => {
      state.joinedPlayers = [];
      state.currentPlayer = null;
      state.auctionStatus = "not-started";
      state.currentPlayerIndex = 0;
      state.timeLeft = 30;
      state.currentBid = 165000000;
      state.auctionId = null;
      if (state.unsubscribeJoinedPlayers) state.unsubscribeJoinedPlayers();
      if (state.unsubscribeCurrentPlayer) state.unsubscribeCurrentPlayer();
      state.unsubscribeJoinedPlayers = null;
      state.unsubscribeCurrentPlayer = null;
    },
  },
});

export const {
  setJoinedPlayers, setCurrentPlayer, setLoading, setError, setAuctionStatus,
  setCurrentPlayerIndex, setTimeLeft, setCurrentBid, setAuctionId, decrementTimeLeft,
  setUnsubscribeJoinedPlayers, setUnsubscribeCurrentPlayer, resetAuctionState,
} = joinedPlayersSlice.actions;

const handleFirestoreError = (error, dispatch) => {
  console.error("Firestore error:", error);
  dispatch(setError(error.message));
};

export const fetchJoinedPlayers = (auctionId, players = []) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setAuctionId(auctionId));

    const auctionDocRef = doc(db, "auctions", auctionId);
    const unsubscribe = onSnapshot(auctionDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const auctionData = docSnap.data();
        const allPlayers = auctionData.selectedPlayers || [];
        const updatedJoinedPlayers = allPlayers.map(playerId =>
          players.find(player => player.id === playerId)
        ).filter(p => p);
        dispatch(setJoinedPlayers(updatedJoinedPlayers));
      }
    }, (error) => handleFirestoreError(error, dispatch));

    dispatch(setUnsubscribeJoinedPlayers(unsubscribe));
  } catch (error) {
    handleFirestoreError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchCurrentPlayer = (auctionId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    const unsubscribe = onSnapshot(currentPlayerRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        dispatch(setCurrentPlayer(data.currentPlayer || null));
        dispatch(setCurrentBid(data.currentBid || 165000000));
        dispatch(setTimeLeft(data.timeLeft || 30));
        dispatch(setAuctionStatus(data.auctionStatus || "not-started"));
      } else {
        setDoc(currentPlayerRef, {
          currentPlayer: null,
          currentBid: 165000000,
          timeLeft: 30,
          auctionStatus: "not-started",
        });
      }
    }, (error) => handleFirestoreError(error, dispatch));

    dispatch(setUnsubscribeCurrentPlayer(unsubscribe));
  } catch (error) {
    handleFirestoreError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

export const startAuction = (auctionId, initialPlayer, players = []) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(resetAuctionState());

    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await setDoc(currentPlayerRef, {
      currentPlayer: initialPlayer,
      currentBid: 165000000,
      timeLeft: 30,
      auctionStatus: "running",
    }, { merge: true });

    dispatch(fetchJoinedPlayers(auctionId, players));
    dispatch(fetchCurrentPlayer(auctionId));
    dispatch(setAuctionStatus("running"));
    dispatch(setCurrentPlayerIndex(0));
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
    dispatch(setAuctionStatus("paused"));
  } catch (error) {
    handleFirestoreError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

export const resumeAuction = (auctionId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await updateDoc(currentPlayerRef, { auctionStatus: "running" });
    dispatch(setAuctionStatus("running"));
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
    dispatch(setAuctionStatus("ended"));
    dispatch(resetAuctionState());
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
    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await updateDoc(currentPlayerRef, {
      currentPlayer: nextPlayerData,
      currentBid: 165000000,
      timeLeft: 30,
    });
    dispatch(setCurrentPlayerIndex(newIndex));
    dispatch(setCurrentPlayer(nextPlayerData));
    dispatch(setCurrentBid(165000000));
    dispatch(setTimeLeft(30));
  } else {
    dispatch(endAuction(auctionId));
  }
};

export const startTimer = (auctionId) => (dispatch, getState) => {
  const { auctionStatus } = getState().joinedPlayers;
  if (auctionStatus !== "running") return;

  const timer = setInterval(async () => {
    const { timeLeft, auctionStatus: currentStatus } = getState().joinedPlayers;
    if (currentStatus !== "running") {
      clearInterval(timer);
      return;
    }
    if (timeLeft > 0) {
      dispatch(decrementTimeLeft());
      const currentPlayerRef = doc(db, "currentplayer", auctionId);
      await updateDoc(currentPlayerRef, { timeLeft: timeLeft - 1 });
    } else {
      dispatch(nextPlayer(auctionId));
      clearInterval(timer);
    }
  }, 1000);
  return () => clearInterval(timer);
};

export default joinedPlayersSlice.reducer;