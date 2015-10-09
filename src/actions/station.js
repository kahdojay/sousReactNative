import murmurhash from 'murmurhash'
import DDPClient from 'ddp-client'
import Fetcher from '../utilities/fetcher'
import {
  DDP
} from '../resources/apiConfig'
import {
  RESET_STATIONS,
  GET_STATIONS,
  REQUEST_STATIONS,
  RECEIVE_STATIONS,
  ERROR_STATIONS,
  ADD_STATION,
  UPDATE_STATION,
  DELETE_STATION
} from './actionTypes'

// let SousFetcher = null;

let ddpClient = new DDPClient({
  url: DDP.ENDPOINT_WS,
});

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

function addStationTask(stationId, taskAttributes){
  ddpClient.call('addStationTask', [stationId, taskAttributes]);
  return {
    type: UPDATE_STATION
  }
}

function updateStationTask(stationId, recipeId, taskAttributes){
  // console.log(arguments);
  ddpClient.call('updateStationTask', [stationId, recipeId, taskAttributes]);
  return {
    type: UPDATE_STATION
  }
}

function updateStation(stationId, stationAttributes){
  //NOTE: this needs the second param to be an array due to js.array.apply call
  //        ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
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
  console.log(RECEIVE_STATIONS, station);
  return {
    type: RECEIVE_STATIONS,
    station: station
  }
}

function fetchStations(teamKey){
  ddpClient.call('getStations', [teamKey]);
}

function getStations(){
  return (dispatch, getState) => {
    let teamKey = getState().session.teamKey;
    ddpClient.connect((error, wasReconnected) => {
      if (error) {
        return dispatch(errorStations([{
          id: 'error_feed_connection',
          message: 'Feed connection error!'
        }]));
      }
      if (wasReconnected) {
        // console.log('STATIONS: Reestablishment of a connection.');
      }
      ddpClient.subscribe(DDP.SUBSCRIBE_STATIONS, [teamKey]);
    });
    ddpClient.on('message', (msg) => {
      var log = JSON.parse(msg);
      console.log("STATIONS DDP MSG", log);
      // var stationIds = getState().stations.data.map(function(station) {
      //   return station.id;
      // })
      if (log.fields){ //NOTE: removed: && stationIds.indexOf(log.id) === -1){ // handle in reducer
        var data = log.fields;
        data.id = log.id;
        dispatch(receiveStations(data))
      }
    });
    // return fetchStations(teamKey);
  }
}

export default {
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
  getStations,
  resetStations,
}
