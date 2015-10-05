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

function addStation(name) {
  return (dispatch, getState) => {
    // kick back if team name is empty
    if(name === ''){
      return dispatch(getTeams())
    }
    let state = getState()
    let team_id = state.session.team_id
    let newStation = {}
    let newKey = murmurhash.v3(name+''+team_id).toString(16);
    newStation[newKey] = {
      id: null,
      key: newKey,
      name: name,
      team_id: team_id,
      created_at: (new Date).toISOString(),
      update_at: (new Date).toISOString()
    }
    SousFetcher.station.create(newStation)
    return {
      type: ADD_STATION,
      station: newStation
    };
  }
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
