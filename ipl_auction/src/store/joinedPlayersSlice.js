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

    // Update Redux state
    dispatch(setSoldStatus(status));

    // Firestore references
    const currentPlayerRef = doc(db, "currentplayer", auctionId);

    // Find player document by querying the id field
    const playersQuery = query(
      collection(db, "players"),
      where("id", "==", currentPlayer.id)
    );
    const querySnapshot = await getDocs(playersQuery);

    if (querySnapshot.empty) {
      alert(`Player with ID ${currentPlayer.id} not found in players collection`);
      return;
    }

    // Get the player document reference
    const playerDoc = querySnapshot.docs[0];
    const playerRef = doc(db, "players", playerDoc.id);

    // If unsold, update only the auction status
    if (status === "unsold") {
      await updateDoc(currentPlayerRef, {
        "currentPlayer.auction_detail.auction_status": status,
      });

      await updateDoc(playerRef, {
        "auction_detail.auction_status": status,
      });

      alert(`Player marked as UNSOLD.`);
    } else {
      
      // If sold, we need to update the team's budget
      // First find the team that won the bid

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
      
      // Calculate new budget values
      const newTotalSpent = (teamData.totalSpent || 0) + lastBid.bidAmount;
      const newRemainingBudget = (teamData.budget || 0) - newTotalSpent;

      // Update team's budget
      await updateDoc(teamRef, {
        totalSpent: newTotalSpent,
        remainingBudget: newRemainingBudget
      });

      // If sold, update status, team, and bid amount
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

  };

      // Prepare player data for history
      const playerData = {
        playerId: currentPlayer.id,
        name: currentPlayer.name,
        image: currentPlayer.image,
        role: currentPlayer.player_role,
        auctionDetails: {
          auctionStatus: status,
          soldPrice: status === "sold" ? lastBid?.bidAmount || null : null,
          team: status === "sold" ? lastBid?.teamName || null : null,
          bidHistory:status === "sold" ? bidHistory || null : null,
        }
      }
      // Step 3: Update auction_history by adding to the players array
      const auctionHistoryRef = doc(db, "auction_history", auctionId);

      // Use arrayUnion to add player data into the players field (this won't duplicate the player if already exists)
      await updateDoc(auctionHistoryRef, {
        players: arrayUnion(playerData)  // Adds player data to the 'players' array
      });

      alert(`Player marked as SOLD and recorded in history.`);
    
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

     // Step 2: Create the auction history document with empty player and team arrays
     const auctionHistoryRef = doc(db, "auction_history", auctionId);

     // Create empty arrays for players and teams
     const playersArray = [];
     const teamsArray = [];
 
     await setDoc(
       auctionHistoryRef,
       {
         players: playersArray,
         teams: teamsArray,
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

    // 1. Get all teams participating in the auction
    const teamsQuery = query(collection(db, "teams"));
    const teamsSnapshot = await getDocs(teamsQuery);
    const auctionHistoryRef = doc(db, "auction_history", auctionId);

    for (const teamDoc of teamsSnapshot.docs) {
      const teamData = teamDoc.data();
      
      // **Step 2: Count Players by Role**
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

    // **Step 3: End Auction**
    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    await updateDoc(currentPlayerRef, {
      auctionStatus: "ended",
      timeLeft: 0,
      currentPlayer: null,
      upcomingPlayers: [],
    });

    // **Step 4: Mark Auction as Completed**
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