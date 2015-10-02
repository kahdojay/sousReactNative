import MockData from '../resources/mockData';
import { ADD_STATION } from '../actions';

const initialState = MockData;

function stations(state = initialState.stations, action) {
  switch (action.type) {
  case ADD_STATION:
    return [...state, {
      text: action.text,
      completed: false
    }];
  default:
    return state;
  }
}

const station = {
  'stations': stations
}

export default station
