import shortid from 'shortid'
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
    var newStationAttributes = {
      _id: shortid.generate(),
      name: name,
      teamKey: teamKey,
      tasks: [],
      deleted: false
    }
    ddpClient.call('createStation', [newStationAttributes]);
    return {
      type: ADD_STATION,
      station: newStationAttributes
    };
  }

  function completeStationTask(message) {
    ddpClient.call('createMessage', [message]);
    return {
      type: COMPLETE_STATION_TASK
    };
  }

  function addStationTask(stationId, taskAttributes){
    var newTaskAttributes = {
      recipeId: shortid.generate(),
      name: taskAttributes.name,
      description: "",
      deleted: false,
      completed: false,
      quantity: 1,
      unit: 0 // for future use
    }
    ddpClient.call('addStationTask', [stationId, newTaskAttributes]);
    return {
      type: UPDATE_STATION,
      stationId: stationId,
      recipeId: newTaskAttributes.recipeId,
      task: newTaskAttributes
    }
  }

  function updateStationTask(stationId, recipeId, taskAttributes){
    ddpClient.call('updateStationTask', [stationId, recipeId, taskAttributes]);
    return {
      type: UPDATE_STATION,
      stationId: stationId,
      recipeId: recipeId,
      task: taskAttributes
    }
  }

  function updateStation(stationId, stationAttributes){
    ddpClient.call('updateStation', [stationId, stationAttributes]);
    return {
      type: UPDATE_STATION,
      stationId: stationId,
      station: stationAttributes
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
