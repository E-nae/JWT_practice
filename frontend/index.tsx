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
import App from './App';
import { store } from 'store';
import reportWebVitals from 'reportWebVitals';

// CURR_BASE_URL 함수 타입 정의 (없는 경우를 대비)
declare function CURR_BASE_URL(host: string | undefined): string;

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //
const CURREMT_HOST = process.env.REACT_APP_DOMAIN;

axios.defaults.baseURL = CURR_BASE_URL(CURREMT_HOST);

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}
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

