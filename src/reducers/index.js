import { combineReducers } from 'redux';
import task from './task'
import team from './team'
import station from './station'
import session from './session'
import message from './message'
import purveyor from './purveyor'
import product from './product'

const reducers = combineReducers(Object.assign(
  {},
  task,
  team,
  station,
  session,
  message,
  purveyor,
  product,
));

export default reducers;
