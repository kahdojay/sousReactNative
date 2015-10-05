import murmurhash from 'murmurhash'
import Fetcher from '../utilities/fetcher'
import {
  RESET_STATIONS,
  GET_STATIONS,
  REQUEST_STATIONS,
  RECEIVE_STATIONS,
  ERROR_STATIONS,
  ADD_STATION,
  DELETE_STATION
} from './actionTypes'

let SousFetcher = null;

function resetStations(){
  return {
    type: RESET_STATIONS
  }
}

function addStation(name, teamId) {
  let newStation = {}
  let newKey = murmurhash.v3(name+''+teamId).toString(16);
  newStation[newKey] = {
    key: newKey,
    name: name,
    teamId: teamId,
    created_at: (new Date).toISOString(),
    update_at: (new Date).toISOString()
  }
  return {
    type: ADD_STATION,
    station: newStation
  };
}

function deleteStation(stationKey) {
  return {
    type: DELETE_STATION,
    stationKey: stationKey
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

function fetchStations(user_id){
  return (dispatch) => {
    dispatch(requestStations())
    return SousFetcher.station.find({
      user_id: user_id,
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
    return dispatch(fetchStations(state.session.user_id));
  }
}

export default {
  RESET_STATIONS,
  GET_STATIONS,
  REQUEST_STATIONS,
  RECEIVE_STATIONS,
  ERROR_STATIONS,
  ADD_STATION,
  DELETE_STATION,
  addStation,
  deleteStation,
  getStations,
  resetStations,
}
