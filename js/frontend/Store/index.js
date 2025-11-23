// third-party
import { configureStore } from '@reduxjs/toolkit';

// project import
import reducers from './reducers/index.js';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
  reducer: reducers
});

const { dispatch } = store;

export { store, dispatch };
