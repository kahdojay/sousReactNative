import { combineReducers } from 'redux';
import connect from './connect'
import ui from './ui'
import team from './team'
import session from './session'
import message from './message'
import purveyor from './purveyor'

const reducers = combineReducers(Object.assign(
  {},
  connect,
  ui,
  team,
  session,
  message,
  purveyor
));

export default reducers;
