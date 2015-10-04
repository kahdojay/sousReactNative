// import MockData from '../resources/mockData';
import {
  REQUEST_STATIONS,
  RECEIVE_STATIONS,
  ERROR_STATIONS,
  ADD_STATION,
  DELETE_STATION
} from '../actions';

const initialState = {
  stations: {
    isFetching: false,
    errors: null,
    data: {},
    lastUpdated: null
  }
};

function stations(state = initialState.stations, action) {
  switch (action.type) {
  case REQUEST_STATIONS:
    return Object.assign({}, state, {
      isFetching: true,
      errors: null,
    });
  case RECEIVE_STATIONS:
    return Object.assign({}, state, {
      isFetching: false,
      errors: null,
      data: Object.assign({}, action.stations),
      lastUpdated: (new Date()).getTime()
    });
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
    return Object.assign({}, state, {
      data: Object.assign({}, state.data, newStation)
    });
  case DELETE_STATION:
    let newStationState = Object.assign({}, state);
    newStationState.data[action.stationId].deleted = true;
    return newStationState;
  default:
    return state;
  }
}

const station = {
  'stations': stations
}

export default station
