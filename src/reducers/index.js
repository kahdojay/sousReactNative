import { combineReducers } from 'redux';
import task from './task'
import station from './station'
import session from './session'

const reducers = combineReducers(Object.assign(
  {},
  task,
  station,
  session
));

export default reducers;
