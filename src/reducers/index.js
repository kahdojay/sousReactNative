import { combineReducers } from 'redux';
import task from './task'
import team from './team'
import station from './station'
import session from './session'

const reducers = combineReducers(Object.assign(
  {},
  task,
  team,
  station,
  session
));

export default reducers;
