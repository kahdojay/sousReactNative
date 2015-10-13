import { getIdx, updateByIdx, updateDataState } from '../utilities/reducer'
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
    var newStationState = Object.assign({}, state);
    var currentStationsDataState = updateDataState(newStationState.data, action.station)
    // console.log(action.type, action.station.id)
    // console.log('STATION REDUCER: ', currentStationsDataState)
    return Object.assign({}, state, {
      isFetching: false, // do we need to phase this out?
      errors: null,
      data: currentStationsDataState,
      lastUpdated: (new Date()).getTime()
    });
  // delete the station
  case DELETE_STATION:
    var newStationState = Object.assign({}, state);
    var stationIdx = getIdx(newStationState.data, action.stationId);
    var currentStationsDataState = updateByIdx(newStationState.data, stationIdx, { deleted: true });
    return Object.assign({}, state, {
      data: currentStationsDataState,
      lastUpdated: (new Date()).getTime()
    });

  // add station
  case ADD_STATION:
    var newStationState = Object.assign({}, state);
    var currentStationsDataState = updateDataState(newStationState.data, action.station)
    // console.log(action.type, action.station.id)
    return Object.assign({}, state, {
      data: currentStationsDataState,
      lastUpdated: (new Date()).getTime()
    });

  // update station -- added this
  case UPDATE_STATION:
    // action {
    //   stationId
    //   station
    //   ------- OR -------
    //   stationId
    //   recipeId
    //   task
    // }

    var newStationState = Object.assign({}, state);
    var currentStationsDataState = newStationState.data;
    // if station passed in, then assume we are only updating the station attributes
    if (action.hasOwnProperty('station')) {
      currentStationsDataState = updateDataState(newStationState.data, action.station);
    }
    // if recipeId and task passed in, then assume we are updating a specific task
    else if(action.hasOwnProperty('recipeId') && action.hasOwnProperty('task')){
      var stationIdx = getIdx(newStationState.data, action.stationId);
      // console.log(action.type, action.recipeId);
      var taskIdx = getIdx(newStationState.data[stationIdx].tasks, action.recipeId);
      var currentTasksDataState = updateByIdx(newStationState.data[stationIdx].tasks, taskIdx, action.task);
      currentStationsDataState = updateByIdx(newStationState.data, stationIdx, {
        tasks: currentTasksDataState
      });
    }

    return Object.assign({}, state, {
      data: currentStationsDataState,
      lastUpdated: (new Date()).getTime()
    });

  // everything else
  case GET_STATIONS:
  case COMPLETE_STATION_TASK:
  default:
    return state;
  }
}

const stationReducers = {
  'stations': stations
}

export default stationReducers
