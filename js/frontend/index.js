/* eslint-disable prettier/prettier */
// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// scroll bar
import 'simplebar/src/simplebar.css';

// third-party
import { Provider as ReduxProvider } from 'react-redux';

// apex-chart
import './assets/third-party/apex-chart.css';

// project import
import App from './App.js';
import { store } from 'store';
import reportWebVitals from 'reportWebVitals';

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //
const CURREMT_HOST = process.env.REACT_APP_DOMAIN;


axios.defaults.baseURL = CURR_BASE_URL(CURREMT_HOST);

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
  // <StrictMode>
  <ReduxProvider store={store}>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </ReduxProvider>
  // </StrictMode>
);

reportWebVitals();
