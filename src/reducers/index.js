import { combineReducers } from 'redux';
import team from './team'
import station from './station'
import session from './session'
import message from './message'
import purveyor from './purveyor'

const reducers = combineReducers(Object.assign(
  {},
  team,
  station,
  session,
  message,
  purveyor,
));

export default reducers;
