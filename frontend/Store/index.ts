// third-party
import { configureStore } from '@reduxjs/toolkit';

// project import
import reducers from './reducers/index';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
  reducer: reducers
});

const { dispatch } = store;

export { store, dispatch };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

