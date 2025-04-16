import React, { useEffect, useState, useRef } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseconfig";

const Timer = ({ auctionId }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [auctionStatus, setAuctionStatus] = useState("running");
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());
  const timerRef = useRef(null);

  // 1. Sync with Firebase
  useEffect(() => {
    const currentPlayerRef = doc(db, "currentplayer", auctionId);
    const unsubscribe = onSnapshot(currentPlayerRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTimeLeft(data.timeLeft ?? 30);
        setAuctionStatus(data.auctionStatus ?? "running");
        
        // Update last active time when status changes to running
        if (data.auctionStatus === "running") {
          setLastActiveTime(Date.now());
        }
      }
    });
    return () => unsubscribe();
  }, [auctionId]);

  // 2. Countdown logic with pause/resume support
  useEffect(() => {
    // Clear any existing interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Only start timer if auction is running and time left > 0
    if (auctionStatus === "running" && timeLeft > 0) {
      timerRef.current = setInterval(async () => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - lastActiveTime) / 1000);
        
        if (elapsedSeconds >= 1) {
          const newTime = Math.max(0, timeLeft - elapsedSeconds);
          setTimeLeft(newTime);
          setLastActiveTime(now);

          try {
            const currentPlayerRef = doc(db, "currentplayer", auctionId);
            
            if (newTime > 0) {
              await updateDoc(currentPlayerRef, { 
                timeLeft: newTime 
              });
            } else {
              await updateDoc(currentPlayerRef, { 
                timeLeft: 0,
                auctionStatus: "paused"
              });
            }
          } catch (error) {
            console.error("Timer update error:", error);
          }
        }
      }, 200); // Check more frequently for better accuracy
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, auctionStatus, auctionId, lastActiveTime]);

  // Calculate display time (handles pause/resume properly)
  const displayTime = auctionStatus === "paused" ? timeLeft : timeLeft;

  return (
    <div className="flex items-center">
      <div className={`ml-2 ${
        timeLeft <= 5 ? 'bg-red-600' : 'bg-[#FF4500]'
      } text-white px-2 py-1 rounded-full flex items-center transition-colors`}>
        <i className="fas fa-clock mr-2"></i>
        <span className="font-semibold">
          {displayTime > 0 ? `${displayTime}s` : "0s"}
        </span>
        {auctionStatus !== "running" && (
          <span className="ml-2 text-xs italic">
            {auctionStatus === "paused" ? "Paused" : "Ended"}
          </span>
        )}
      </div>
    </div>
  );
};

export default Timer;