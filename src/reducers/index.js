import { combineReducers } from 'redux';
import task from './task'
import team from './team'
import station from './station'
import session from './session'
import message from './message'

const reducers = combineReducers(Object.assign(
  {},
  task,
  team,
  station,
  session,
  message
));

export default reducers;
