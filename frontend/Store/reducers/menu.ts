// types
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MenuState {
  openItem: string[];
  defaultId: string;
  openComponent: string;
  drawerOpen: boolean;
  componentDrawerOpen: boolean;
  routeSwitchOn: boolean;
}

// initial state
const initialState: MenuState = {
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
    activeItem(state, action: PayloadAction<{ openItem: string[] }>) {
      state.openItem = action.payload.openItem;
    },

    activeComponent(state, action: PayloadAction<{ openComponent: string }>) {
      state.openComponent = action.payload.openComponent;
    },

    openDrawer(state, action: PayloadAction<{ drawerOpen: boolean }>) {
      state.drawerOpen = action.payload.drawerOpen;
    },

    openComponentDrawer(state, action: PayloadAction<{ componentDrawerOpen: boolean }>) {
      state.componentDrawerOpen = action.payload.componentDrawerOpen;
    },

    switchRoutes(state, action: PayloadAction<{ routeSwitchOn: boolean }>) {
      state.routeSwitchOn = action.payload.routeSwitchOn;
    }
  }
});

export default menu.reducer;

export const { activeItem, activeComponent, openDrawer, openComponentDrawer, switchRoutes } = menu.actions;

