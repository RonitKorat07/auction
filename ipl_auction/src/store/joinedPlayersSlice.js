import { createSlice } from "@reduxjs/toolkit";
import { arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
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
  soldStatus: "",
  currentBid: 0,
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
      state.currentBid = 0;
      state.auctionId = null;
      state.upcomingPlayers = [];
      state.soldStatus = "";
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
  setSoldStatus,
  resetAuctionState,
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

    dispatch(setSoldStatus(status));

    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    const playersQuery = query(
      collection(db, "players"),
      where("id", "==", currentPlayer.id)
    );
    const querySnapshot = await getDocs(playersQuery);

    if (querySnapshot.empty) {
      alert(`Player with ID ${currentPlayer.id} not found in players collection`);
      return;
    }

    const playerDoc = querySnapshot.docs[0];
    const playerRef = doc(db, "players", playerDoc.id);

    if (status === "unsold") {
      await updateDoc(currentPlayerRef, {
        "currentPlayer.auction_detail.auction_status": status,
      });

      await updateDoc(playerRef, {
        "auction_detail.auction_status": status,
      });

      alert(`Player marked as UNSOLD.`);
    } else {
      const teamsQuery = query(
        collection(db, "teams"),
        where("name", "==", lastBid.teamName)
      );
      const teamQuerySnapshot = await getDocs(teamsQuery);
      
      if (teamQuerySnapshot.empty) {
        throw new Error(`Team ${lastBid.teamName} not found`);
      }

      const teamDoc = teamQuerySnapshot.docs[0];
      const teamRef = doc(db, "teams", teamDoc.id);
      const teamData = teamDoc.data();
      
      const newTotalSpent = (teamData.totalSpent || 0) + lastBid.bidAmount;
      const newRemainingBudget = (teamData.budget || 0) - newTotalSpent;

      await updateDoc(teamRef, {
        totalSpent: newTotalSpent,
        remainingBudget: newRemainingBudget
      });

      await updateDoc(currentPlayerRef, {
        "currentPlayer.auction_detail.auction_status": status,
        "currentPlayer.auction_detail.sold_price": lastBid?.bidAmount || null,
        "currentPlayer.auction_detail.team": lastBid?.teamName || null,
      });

      await updateDoc(playerRef, {
        "auction_detail.auction_status": status,
        "auction_detail.sold_price": lastBid?.bidAmount || null,
        "auction_detail.team": lastBid?.teamName || null,
      });

      const playerData = {
        playerId: currentPlayer.id,
        name: currentPlayer.name,
        image: currentPlayer.image,
        role: currentPlayer.player_role,
        auctionDetails: {
          auctionStatus: status,
          soldPrice: status === "sold" ? lastBid?.bidAmount || null : null,
          team: status === "sold" ? lastBid?.teamName || null : null,
          bidHistory: status === "sold" ? bidHistory || null : null,
        }
      };

      const auctionHistoryRef = doc(db, "auction_history", auctionId);
      await updateDoc(auctionHistoryRef, {
        players: arrayUnion(playerData)
      });

      alert(`Player marked as SOLD and recorded in history.`);
    }
  } catch (error) {
    console.error("Error updating status:", error);
    alert(error.message || "Failed to update status. Please try again.");
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
        dispatch(setCurrentPlayerIndex(data.currentPlayerIndex || 0));
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
      timeLeft: 30,
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
        timeLeft: 30,
        currentPlayerIndex: 0,
      },
      { merge: true }
    );

    const auctionHistoryRef = doc(db, "auction_history", auctionId);
    await setDoc(
      auctionHistoryRef,
      {
        players: [],
        teams: [],
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

    const { joinedPlayers, currentPlayerIndex } = getState().joinedPlayers;
    const newUpcomingPlayers = joinedPlayers.slice(currentPlayerIndex + 1, currentPlayerIndex + 5);
    
    await updateDoc(currentPlayerRef, { 
      upcomingPlayers: newUpcomingPlayers 
    });
    
    dispatch(setUpcomingPlayers(newUpcomingPlayers));
  } catch (error) {
    handleFirestoreError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

export const endAuction = (auctionId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const teamsQuery = query(collection(db, "teams"));
    const teamsSnapshot = await getDocs(teamsQuery);
    const auctionHistoryRef = doc(db, "auction_history", auctionId);

    for (const teamDoc of teamsSnapshot.docs) {
      const teamData = teamDoc.data();
      
      const playersQuery = query(collection(db, "players"), where("auction_detail.team", "==", teamData.name));
      const playerSnapshot = await getDocs(playersQuery);

      let playerCounts = { batsman: 0, bowlers: 0, allRounders: 0, total: 0 };

      playerSnapshot.forEach((doc) => {
        const player = doc.data();
        if (player.player_role === "Batsman" || player.player_role === "Wicket-keeper batsman") {
          playerCounts.batsman++;
        } else if (player.player_role === "Bowler") {
          playerCounts.bowlers++;
        } else if (player.player_role === "All-rounder") {
          playerCounts.allRounders++;
        }
        playerCounts.total++;
      });

      const teamHistoryData = {
        teamId: teamDoc.id,
        name: teamData.name,
        logo: teamData.logo,
        owner: teamData.owner,
        budgetDetails: {
          initialBudget: teamData.budget,
          totalSpent: teamData.totalSpent || 0,
          remainingBudget: teamData.remainingBudget || teamData.budget,
        },
        totalPlayers: playerCounts.total,
        roleCounts: {
          batsman: playerCounts.batsman,
          bowlers: playerCounts.bowlers,
          allRounders: playerCounts.allRounders,
        }
      };

      await updateDoc(auctionHistoryRef, {
        teams: arrayUnion(teamHistoryData),
      });
    }

    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await updateDoc(currentPlayerRef, {
      auctionStatus: "ended",
      timeLeft: 0,
      currentPlayer: null,
      upcomingPlayers: [],
    });

    const auctionRef = doc(db, "auctions", auctionId);
    await updateDoc(auctionRef, {
      status: "completed",
      isLive: false,
    });

    dispatch(resetAuctionState());
  } catch (error) {
    handleFirestoreError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

export const nextPlayer = (auctionId) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    
    const { joinedPlayers, currentPlayerIndex } = getState().joinedPlayers;

    if (!joinedPlayers || joinedPlayers.length === 0) {
      dispatch(setError("No players available"));
      return;
    }

    if (currentPlayerIndex >= joinedPlayers.length) {
      dispatch(setError("Invalid player index"));
      return;
    }

    if (currentPlayerIndex < joinedPlayers.length - 1) {
      const newIndex = currentPlayerIndex + 1;
      const nextPlayerData = joinedPlayers[newIndex];
      
      const newUpcomingPlayers = joinedPlayers.slice(newIndex + 1, newIndex + 5);
      const currentPlayerRef = doc(db, "currentplayer", auctionId);

      await updateDoc(currentPlayerRef, {
        currentPlayer: nextPlayerData,
        "currentPlayer.auction_detail.current_bid": nextPlayerData.auction_detail.base_price,
        upcomingPlayers: newUpcomingPlayers,
        currentPlayerIndex: newIndex,
        timeLeft: 30,
      });

      dispatch(setCurrentPlayerIndex(newIndex));
      dispatch(setCurrentPlayer(nextPlayerData));
      dispatch(setUpcomingPlayers(newUpcomingPlayers));
      dispatch(setCurrentBid(nextPlayerData.auction_detail.base_price));
    } else {
      await dispatch(endAuction(auctionId));
    }
  } catch (error) {
    handleFirestoreError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

export default joinedPlayersSlice.reducer;