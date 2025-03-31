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
  auctionId: null,
  upcomingPlayers: [],
  soldStatus: "", // Add this new field
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
    setCurrentBid: (state, action) => {
      state.currentBid = action.payload;
    },
    setAuctionId: (state, action) => {
      state.auctionId = action.payload;
    },
    setUpcomingPlayers: (state, action) => {
      state.upcomingPlayers = action.payload;
    },
    setSoldStatus: (state, action) => {
      state.soldStatus = action.payload;
    },
    resetAuctionState: (state) => {
      state.joinedPlayers = [];
      state.currentPlayer = null;
      state.auctionStatus = "not-started";
      state.currentPlayerIndex = 0;
      state.currentBid = 165000000;
      state.auctionId = null;
      state.upcomingPlayers = [];
      state.soldStatus = ""; // Reset this too
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
  setCurrentBid,
  setAuctionId,
  setUpcomingPlayers,
  resetAuctionState,
  setSoldStatus, // Add this

} = joinedPlayersSlice.actions;

const handleFirestoreError = (error, dispatch) => {
  console.error("Firestore error:", error);
  dispatch(setError(error.message));
};

export const updateSoldStatus = (auctionId) => async (dispatch, getState) => {
  try {
    const { currentPlayer } = getState().joinedPlayers;
    
    if (!currentPlayer) {
      alert("No current player selected!");
      return;
    }
    
    const bidHistory = currentPlayer?.auction_detail?.bid_history || [];
    const hasBids = bidHistory.length > 0;
    const lastBid = hasBids ? bidHistory[bidHistory.length - 1] : null;
    const status = hasBids ? "sold" : "unsold";
    
    // Update local state
    dispatch(setSoldStatus(status));

    // Update Firestore
    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    
    // If unsold, update only the status
    if (status === "unsold") {
      await updateDoc(currentPlayerRef, {
        "currentPlayer.auction_detail.auction_status": status,
      });
    } else {
      // If sold, update status, team, and bid amount
      await updateDoc(currentPlayerRef, {
        "currentPlayer.auction_detail.auction_status": status,
        "currentPlayer.auction_detail.sold_price": lastBid.bidAmount || null,
        "currentPlayer.auction_detail.team": lastBid.teamName || null,
      });
    }

    // Show alert with the new status
    alert(`Player status updated to: ${status.toUpperCase()}`);

  } catch (error) {
    handleFirestoreError(error, dispatch);
    alert("Failed to update status. Please try again.");
  }
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
        dispatch(fetchUpcomingPlayersRealtime(auctionId));
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

    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    const currentPlayerDoc = await getDoc(currentPlayerRef);

    if (!currentPlayerDoc.exists()) {
      throw new Error("Current player document does not exist.");
    }

    const currentBidHistory = currentPlayerDoc.data()?.currentPlayer?.auction_detail?.bid_history || [];

    const newBidEntry = {
      teamName,
      teamLogo,
      bidAmount,
      timestamp: new Date().toISOString(),
    };

    await updateDoc(currentPlayerRef, {
      "currentPlayer.auction_detail.current_bid": bidAmount,
      "currentPlayer.auction_detail.bid_history": [...currentBidHistory, newBidEntry],
      timeLeft: 30, // Reset timer for the next player
      lastUpdated: Date.now()
    });

    dispatch(setCurrentBid(bidAmount));
  } catch (error) {
    console.error("Firestore update error:", error);
    dispatch(setError("Failed to update bid. Please try again."));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchUpcomingPlayersRealtime = (auctionId) => (dispatch) => {
  const currentPlayerRef = doc(db, "currentplayer", auctionId);
  return onSnapshot(currentPlayerRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const upcomingPlayers = data.upcomingPlayers || [];
      dispatch(setUpcomingPlayers(upcomingPlayers));
    }
  });
};

export const startAuction = (auctionId, initialPlayer, players = []) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(resetAuctionState());

    const upcomingPlayers = players.slice(1, 5);
    const currentPlayerRef = doc(db, "currentplayer", auctionId);

    await setDoc( 
      currentPlayerRef,
      {
        currentPlayer: initialPlayer,
        auctionStatus: "running",
        upcomingPlayers,
        timeLeft : 30,
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

    // Update the currentplayer document to mark the auction as ended
    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await updateDoc(currentPlayerRef, {
      auctionStatus: "ended",
      timeLeft: 0, // Reset timer
      currentPlayer: null, // Clear current player
      upcomingPlayers: [], // Clear upcoming players
    });

    // Update the auctions document to mark the auction as completed
    const auctionRef = doc(db, "auctions", auctionId);
    await updateDoc(auctionRef, {
      status: "completed",
      isLive: false,
    });

    // Reset the Redux state for the auction
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

    dispatch(setCurrentPlayerIndex(newIndex));

    const newUpcomingPlayers = joinedPlayers.slice(newIndex + 1, newIndex + 5);
    const currentPlayerRef = doc(db, "currentplayer", auctionId);

    await updateDoc(currentPlayerRef, {
      currentPlayer: nextPlayerData,
      // "currentPlayer.auction_details.current_bid": nextPlayerData.auction_detail.base_price,
      upcomingPlayers: newUpcomingPlayers,
      timeLeft: 30, // Reset timer for the next player
    });

    dispatch(setCurrentPlayer(nextPlayerData));
    dispatch(setUpcomingPlayers(newUpcomingPlayers));

  } else {
    dispatch(endAuction(auctionId));

  }
};

export default joinedPlayersSlice.reducer;