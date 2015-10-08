import murmurhash from 'murmurhash'
import DDPClient from 'ddp-client'
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

let ddpClient = new DDPClient({
  url: 'ws://localhost:3000/websocket'
});

function resetStations(){
  return {
    type: RESET_STATIONS
  }
}

function addStation(name, teamKey) {
// function addStation(name, teamId) {
  // let newStation = {}
  // let newKey = murmurhash.v3(name+''+teamId).toString(16);
  // newStation[newKey] = {
  //   key: newKey,
  //   name: name,
  //   teamId: teamId,
  //   created_at: (new Date).toISOString(),
  //   update_at: (new Date).toISOString()
  // }
  // return {
  //   type: ADD_STATION,
  //   station: newStation
  // };
  console.log("NAME AND TEAM", {name: name, teamKey: teamKey});
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

// function receiveStations(stations) {
//   return {
//     type: RECEIVE_STATIONS,
//     stations: stations
//   }
// }

function errorStations(errors){
  return {
    type: ERROR_STATIONS,
    errors: errors
  }
}

// function fetchStations(user_id){
//   return (dispatch) => {
//     dispatch(requestStations())
//     return SousFetcher.station.find({
//       user_id: user_id,
//       requestedAt: (new Date).getTime()
//     }).then(res => {
//       if (res.success === false) {
//         dispatch(errorStations(res.errors))
//       } else {
//         dispatch(receiveStations(res))
//       }
//     })
//   }
// }
function receiveStations(station) {
  return {
    type: RECEIVE_STATIONS,
    station: station
  }
}
function getStations(){
  return (dispatch, getState) => {
  //   let state = getState()
  //   SousFetcher = new Fetcher(state)
  //   return dispatch(fetchStations(state.session.user_id));
  // }
    let teamKey = getState().session.teamKey;
    ddpClient.connect((error, wasReconnected) => {
      if (error) {
        // return dispatch(errorMessages([{
        //   id: 'error_feed_connection',
        //   message: 'Feed connection error!'
        // }]));
      }
      if (wasReconnected) {
        console.log('Reestablishment of a connection.');
      }
      ddpClient.subscribe('stations', [teamKey]);
    });
    ddpClient.on('message', (msg) => {
      console.log("DDP MSG", msg);
      var log = JSON.parse(msg);
      if (log.fields){
        var data = log.fields;
        data.id = log.id;
        dispatch(receiveStations(data))
      } else {
        // console.log('No message fields: ', message);
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
