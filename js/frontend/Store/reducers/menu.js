// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  openItem: ['dashboard'],
  defaultId: 'dashboard',
  openComponent: 'buttons',
  drawerOpen: false,
  componentDrawerOpen: true,
  routeSwitchOn: false
};

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },

    activeComponent(state, action) {
      state.openComponent = action.payload.openComponent;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload.drawerOpen;
    },

    openComponentDrawer(state, action) {
      state.componentDrawerOpen = action.payload.componentDrawerOpen;
    },

    switchRoutes(state, action) {
      state.routeSwitchOn = action.payload.routeSwitchOn;
    }
  }
});

export default menu.reducer;

export const { activeItem, activeComponent, openDrawer, openComponentDrawer, switchRoutes } = menu.actions;
