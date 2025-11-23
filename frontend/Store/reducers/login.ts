// types
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
  method: string;
}

// initial state
const initialState: LoginState = {
  method: 'tk'
};

// ==============================|| SLICE - LOGIN ||============================== //

const login = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginMethod(state, action: PayloadAction<{ method: string }>) {
      state.method = action.payload.method;
    }
  }
});

export default login.reducer;

export const { loginMethod } = login.actions;

