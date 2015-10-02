import MockData from '../resources/mockData';
import { ADD_STATION } from '../actions';

const initialState = MockData;

function stations(state = initialState.stations, action) {
  switch (action.type) {
  case ADD_STATION:
    let id = Object.keys(state).length;
    let newStation = state
    newStation[id] = {
      id: id,
      name: action.name,
      taskList: []
    }
    return {
      ...state,
      newStation
    };
  default:
    return state;
  }
}

const station = {
  'stations': stations
}

export default station
