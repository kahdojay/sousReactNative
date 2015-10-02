import { combineReducers } from 'redux';
import task from './task'
import station from './station'

const reducers = combineReducers(Object.assign(
  {},
  task,
  station
));

export default reducers;
