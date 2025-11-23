// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  method: 'tk'
};

// ==============================|| SLICE - MENU ||============================== //

const login = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginMethod(state, action) {
      state.method = action.payload.method;
    }
  }
});

export default login.reducer;

export const { loginMethod } = login.actions;
