import murmurhash from 'murmurhash'
import DDPClient from 'ddp-client'
import Fetcher from '../utilities/fetcher'
import {
  CHAT
} from '../resources/apiConfig'
import {
  RESET_STATIONS,
  GET_STATIONS,
  REQUEST_STATIONS,
  RECEIVE_STATIONS,
  ERROR_STATIONS,
  ADD_STATION,
  DELETE_STATION
} from './actionTypes'

// let SousFetcher = null;

let ddpClient = new DDPClient({
  url: CHAT.ENDPOINT_WS,
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

function errorStations(errors){
  return {
    type: ERROR_STATIONS,
    errors: errors
  }
}

function receiveStations(station) {
  return {
    type: RECEIVE_STATIONS,
    station: station
  }
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
        console.log('Reestablishment of a connection.');
      }
      ddpClient.subscribe('stations', [teamKey]);
    });
    ddpClient.on('message', (msg) => {
      console.log("DDP MSG", msg);
      var log = JSON.parse(msg);
      var stationIds = getState().stations.data.map(function(station) {
        return station.id;
      })
      if (log.fields && stationIds.indexOf(log.id) === -1){
        var data = log.fields;
        data.id = log.id;
        dispatch(receiveStations(data))
      }
    });
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
