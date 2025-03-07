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
  auctionId: null, // Store auction ID
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
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      } else {
        state.timeLeft = 30; // Reset timer to 30 seconds
      }
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
} = joinedPlayersSlice.actions;

// Fetch joined players and sync real-time updates
export const fetchJoinedPlayers = (auctionId, players) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    dispatch(setAuctionId(auctionId));

    const auctionDocRef = doc(db, "auctions", auctionId);
    const unsubscribe = onSnapshot(auctionDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const auctionData = docSnap.data();
        const allPlayers = auctionData.selectedPlayers || [];

        if (players.length > 0) {
          const updatedJoinedPlayers = allPlayers.map((playerId) =>
            players.find((player) => player.id === playerId)
          );
          const validPlayers = updatedJoinedPlayers.filter((p) => p !== undefined);

          dispatch(setJoinedPlayers(validPlayers));

          // Set the current player based on index
          const currentPlayerIndex = getState().joinedPlayers.currentPlayerIndex;
          dispatch(setCurrentPlayer(validPlayers[currentPlayerIndex]));
        }
      }
    });

    return unsubscribe;
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

// Fetch the current player, currentBid, and timeLeft in real-time
export const fetchCurrentPlayer = (auctionId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    const unsubscribe = onSnapshot(currentPlayerRef, (docSnap) => {
      if (docSnap.exists()) {
        const currentPlayerData = docSnap.data();
        dispatch(setCurrentPlayer(currentPlayerData.currentPlayer));
        dispatch(setCurrentBid(currentPlayerData.currentBid || 165000000)); // Default bid
        dispatch(setTimeLeft(currentPlayerData.timeLeft || 30)); // Default time
        dispatch(setAuctionStatus(currentPlayerData.auctionStatus || "not-started")); // Default status
      } else {
        console.warn("CurrentPlayer document does not exist. Creating one...");
        setDoc(currentPlayerRef, {
          currentPlayer: null,
          currentBid: 165000000,
          timeLeft: 30,
          auctionStatus: "not-started",
        });
      }
    });

    return unsubscribe;
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

// Start the auction and initialize the current player, currentBid, and timeLeft
export const startAuction = (auctionId, initialPlayer) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

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

    dispatch(setAuctionStatus("running"));
    dispatch(setCurrentPlayerIndex(0));
    dispatch(setTimeLeft(30));
    dispatch(setCurrentBid(165000000));
    dispatch(setCurrentPlayer(initialPlayer));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

// Pause the auction
export const pauseAuction = (auctionId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await updateDoc(currentPlayerRef, {
      auctionStatus: "paused",
    });

    dispatch(setAuctionStatus("paused"));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

// Resume the auction
export const resumeAuction = (auctionId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await updateDoc(currentPlayerRef, {
      auctionStatus: "running",
    });

    dispatch(setAuctionStatus("running"));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

// End the auction
export const endAuction = (auctionId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await updateDoc(currentPlayerRef, {
      auctionStatus: "ended",
    });

    dispatch(setAuctionStatus("ended"));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

// Move to the next player and update Firestore
export const nextPlayer = () => async (dispatch, getState) => {
  const { joinedPlayers, currentPlayerIndex, auctionId } = getState().joinedPlayers;

  if (!auctionId) {
    console.error("Auction ID is missing!");
    return;
  }

  if (currentPlayerIndex < joinedPlayers.length - 1) {
    const newIndex = currentPlayerIndex + 1;
    const nextPlayer = joinedPlayers[newIndex];

    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await updateDoc(currentPlayerRef, {
      currentPlayer: nextPlayer,
      currentBid: 165000000, // Reset bid for the next player
      timeLeft: 30, // Reset timer for the next player
    });

    dispatch(setCurrentPlayerIndex(newIndex));
    dispatch(setCurrentPlayer(nextPlayer));
    dispatch(setCurrentBid(165000000));
    dispatch(setTimeLeft(30));
  } else {
    dispatch(endAuction(auctionId));
  }
};

// Decrement time left and reset when it reaches 0
export const startTimer = () => async (dispatch, getState) => {
  const { auctionId, auctionStatus } = getState().joinedPlayers;

  if (auctionStatus !== "running") {
    return; // Only run the timer if the auction is running
  }

  const timer = setInterval(async () => {
    const { timeLeft } = getState().joinedPlayers;

    if (timeLeft > 0) {
      dispatch(decrementTimeLeft());

      // Update Firestore with the new timeLeft
      const currentPlayerRef = doc(db, "currentplayer", auctionId);
      await updateDoc(currentPlayerRef, {
        timeLeft: timeLeft - 1,
      });
    } else {
      clearInterval(timer); // Stop the timer when it reaches 0
      dispatch(setTimeLeft(30)); // Reset timer to 30 seconds

      // Update Firestore with the reset timeLeft
      const currentPlayerRef = doc(db, "currentplayer", auctionId);
      await updateDoc(currentPlayerRef, {
        timeLeft: 30,
      });
    }
  }, 1000);
};

export default joinedPlayersSlice.reducer;