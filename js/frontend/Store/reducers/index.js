// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu.js';
import login from './login.js';
import page from './page.js';
import refetch from './refetch.js';
import filters from './statisticsFilter.js';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, login, page, refetch, filters });

export default reducers;
