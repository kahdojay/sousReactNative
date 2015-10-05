import {
  RESET_STATIONS,
  GET_STATIONS,
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
  case RESET_STATIONS:
    return Object.assign({}, initialState.stations);
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
    return Object.assign({}, state, {
      data: Object.assign({}, state.data, action.station)
    });
  case DELETE_STATION:
    let newStationState = Object.assign({}, state);
    newStationState.data[action.stationId].deleted = true;
    return newStationState;
  case GET_STATIONS:
  default:
    return state;
  }
}

const stationReducers = {
  'stations': stations
}

export default stationReducers
