import { combineReducers } from 'redux';
import menu from './menu';
import login from './login';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ 
  menu, 
  login
  // page, refetch, filters
});

export default reducers;

