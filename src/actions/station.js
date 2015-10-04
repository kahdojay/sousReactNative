import { REQUEST_STATIONS, RECEIVE_STATIONS, ERROR_STATIONS, ADD_STATION, DELETE_STATION } from './actionTypes'
import Fetcher from '../utilities/fetcher';

let SousFetcher = null;

function addStation(name) {
  return {
    type: ADD_STATION,
    name: name
  };
}

function deleteStation(stationId) {
  return {
    type: DELETE_STATION,
    stationId: stationId
  }
}

function requestStations() {
  return {
    type: REQUEST_STATIONS
  }
}

function receiveStations(stations) {
  return {
    type: RECEIVE_STATIONS,
    stations: stations
  }
}

function errorStations(errors){
  return {
    type: ERROR_STATIONS,
    errors: errors
  }
}

function fetchStations(userId){
  return (dispatch) => {
    dispatch(requestStations())
    return SousFetcher.station.find({
      user_id: userId || '',
      requestedAt: (new Date).getTime()
    }).then(res => {
      if (res.success === false) {
        dispatch(errorStations(res.errors))
      } else {
        dispatch(receiveStations(res))
      }
    })
  }
}

function getStations(){
  return (dispatch, getState) => {
    let state = getState()
    SousFetcher = new Fetcher(state)
    return dispatch(fetchStations(state.session.userId));
  }
}

export default {
  REQUEST_STATIONS,
  RECEIVE_STATIONS,
  ERROR_STATIONS,
  ADD_STATION,
  DELETE_STATION,
  addStation,
  deleteStation,
  getStations
}
