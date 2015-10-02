import { combineReducers } from 'redux';
import task from './task'
import station from './station'

const reducers = combineReducers(Object.assign(
  {},
  task,
  station
));

// const reducers = combineReducers({
//   taskVisibility: task.taskVisibility,
//   tasks: task.tasks,
//   stations: station.stations
// })

export default reducers;
