import MockData from '../resources/mockData';
import { ADD_STATION } from '../actions';

const initialState = MockData;

function stations(state = initialState.stations, action) {
  switch (action.type) {
  case ADD_STATION:
    // kick back if station name is empty
    if(action.name === ''){
      return state;
    }
    let id = Object.keys(state).length + '';
    let newStation = {}
    newStation[id] = {
      id: id,
      name: action.name,
      taskList: []
    }
    return Object.assign({}, state, newStation);
  default:
    return state;
  }
}

const station = {
  'stations': stations
}

export default station
