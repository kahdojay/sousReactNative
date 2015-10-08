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
    data: [],
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
    let stationsState = state.data;
    stationsState.push(action.station);

    return Object.assign({}, state, {
      isFetching: false,
      errors: null,
      data: stationsState,
      lastUpdated: (new Date()).getTime()
    });
  case ADD_STATION:
    return state;
  case DELETE_STATION:
    let newStationState = Object.assign({}, state);
    newStationState.data[action.stationKey].deleted = true;
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
