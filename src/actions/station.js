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
} from './actionTypes'

export default function StationActions(ddpClient) {

  function resetStations(){
    return {
      type: RESET_STATIONS
    }
  }

  function addStation(name, teamKey) {
    var stationAttributes = {
      name: name,
      teamKey: teamKey,
      tasks: [],
      deleted: false
    }
    ddpClient.call('createStation', [stationAttributes]);
    return {
      type: ADD_STATION,
      station: stationAttributes
    };
  }

  function completeStationTask(message) {
    ddpClient.call('createMessage', [message]);
    return {
      type: COMPLETE_STATION_TASK
    };
  }

  function addStationTask(stationId, taskAttributes){
    ddpClient.call('addStationTask', [stationId, taskAttributes]);
    return {
      type: UPDATE_STATION
    }
  }

  function updateStationTask(stationId, recipeId, taskAttributes){
    ddpClient.call('updateStationTask', [stationId, recipeId, taskAttributes]);
    return {
      type: UPDATE_STATION
    }
  }

  function updateStation(stationId, stationAttributes){
    ddpClient.call('updateStation', [stationId, stationAttributes]);
    return {
      type: UPDATE_STATION
    }
  }

  function deleteStation(stationId) {
    ddpClient.call('deleteStation', [stationId])
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

  function errorStations(errors){
    return {
      type: ERROR_STATIONS,
      errors: errors
    }
  }

  function receiveStations(station) {
    // console.log(RECEIVE_STATIONS, station);
    return {
      type: RECEIVE_STATIONS,
      station: station
    }
  }

  return {
    RESET_STATIONS,
    GET_STATIONS,
    REQUEST_STATIONS,
    RECEIVE_STATIONS,
    ERROR_STATIONS,
    ADD_STATION,
    UPDATE_STATION,
    DELETE_STATION,
    addStation,
    addStationTask,
    updateStationTask,
    updateStation,
    deleteStation,
    // getStations,
    receiveStations,
    resetStations,
    completeStationTask,
  }
}
