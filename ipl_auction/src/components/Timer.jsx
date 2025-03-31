import React, { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseconfig";

const Timer = ({ auctionId }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // 1. Sync with Firebase
  useEffect(() => {
    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    const unsubscribe = onSnapshot(currentPlayerRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTimeLeft(data.timeLeft ?? 30);
        setIsTimerActive(data.timeLeft > 0);
      }
    });
    return () => unsubscribe();
  }, [auctionId]);

  // 2. Countdown logic
  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return;

    const timer = setInterval(async () => {
      const newTime = timeLeft - 1;
      const currentPlayerRef = doc(db, "currentplayer", auctionId);

      if (newTime > 0) {
        await updateDoc(currentPlayerRef, { timeLeft: newTime });
      } else {
        // When reaching 0, set both timeLeft and isTimerActive
        await updateDoc(currentPlayerRef, { 
          timeLeft: 0,
          isTimerActive: false 
        });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, auctionId, isTimerActive]);

  return (
    <div className="flex items-center">
      <div className="ml-2 bg-[#FF4500] text-white px-2 py-1 rounded-full flex items-center">
        <i className="fas fa-clock mr-2"></i>
        <span className="font-semibold">
          {timeLeft > 0 ? `${timeLeft}s` : "0s"}
        </span>
      </div>
    </div>
  );
};

export default Timer;