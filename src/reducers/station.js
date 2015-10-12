import _ from 'lodash'
import {
  RESET_STATIONS,
  GET_STATIONS,
  REQUEST_STATIONS,
  RECEIVE_STATIONS,
  ERROR_STATIONS,
  ADD_STATION,
  UPDATE_STATION,
  DELETE_STATION,
  COMPLETE_STATION_TASK
} from '../actions';

const initialState = {
  stations: {
    isFetching: false,
    errors: null,
    data: [],
    lastUpdated: null
  }
};

function getStationsState(currentStationsState, checkStation){
  let stationsState = Object.assign({}, currentStationsState)
  var stationIdx = _.findIndex(stationsState, (station, idx) => {
    return station.id == checkStation.id;
  });
  // console.log(checkStation)
  if(stationIdx === -1){
    stationsState.push(checkStation);
  } else {
    stationsState = [
      ...stationsState.slice(0, stationIdx),
      Object.assign({}, stationsState[stationIdx], checkStation),
      ...stationsState.slice(stationIdx + 1)
    ]
  }
  return stationsState
}

function stations(state = initialState.stations, action) {
  switch (action.type) {
  // reset the stations
  case RESET_STATIONS:
    return Object.assign({}, initialState.stations);
  // request the stations
  case REQUEST_STATIONS:
    return Object.assign({}, state, {
      isFetching: true,
      errors: null,
    });
  // receive the stations
  case RECEIVE_STATIONS:
    let stationsState = getStationsState(state.data, action.station)
    // console.log('STATION REDUCER: ', stationsState)
    return Object.assign({}, state, {
      isFetching: false,
      errors: null,
      data: stationsState,
      lastUpdated: (new Date()).getTime()
    });
  // delete the station
  case DELETE_STATION:
    let newStationState = Object.assign({}, state);
    newStationState.data.forEach((station, index) => {
      if (station.id == action.stationId) {
        newStationState.data[index].deleted = true;
      }
    })
    return newStationState;
  // add station
  case ADD_STATION:
    return state;
  // update station
  case UPDATE_STATION:
  case GET_STATIONS:
  case COMPLETE_STATION_TASK:
  // everything else
  default:
    return state;
  }
}

const stationReducers = {
  'stations': stations
}

export default stationReducers
