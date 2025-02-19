import { configureStore } from '@reduxjs/toolkit';
import playerreducer from '../store/playerslice';

export const store = configureStore({
  reducer: {
    player: playerreducer,
  },
});

