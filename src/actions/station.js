import { ADD_STATION, DELETE_STATION } from './actionTypes'

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

export default {
  ADD_STATION,
  DELETE_STATION,
  addStation,
  deleteStation
}
