import React, { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseconfig";
import { useDispatch } from "react-redux";
import { nextPlayer } from "../store/joinedPlayersSlice";

const Timer = ({ auctionId }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const dispatch = useDispatch();

  // Fetch real-time updates for the timer
  useEffect(() => {
    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    const unsubscribe = onSnapshot(currentPlayerRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTimeLeft(data.timeLeft || 30); // Sync timer from Firebase
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [auctionId]);

  // Decrement timer every second
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(async () => {
        const currentPlayerRef = doc(db, "currentplayer", auctionId);
        await updateDoc(currentPlayerRef, { timeLeft: timeLeft - 1 }); // Update Firebase
      }, 1000);

      return () => clearInterval(timer); // Cleanup on unmount
    } else if (timeLeft === 0) {
      // Trigger next player when timer reaches 0
      dispatch(nextPlayer(auctionId));
    }
  }, [timeLeft, auctionId, dispatch]);

  return (
    <div className="flex items-center">
      <span className="text-xl text-white">Time Left:</span>
      <div className="ml-4 bg-[#FF4500] text-white px-3 py-1 rounded-full flex items-center">
        <i className="fas fa-clock mr-2"></i>
        <span className="font-semibold">{timeLeft}s</span>
      </div>
    </div>
  );
};

export default Timer;