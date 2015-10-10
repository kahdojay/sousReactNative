import DDPClient from 'ddp-client'
import {
  DDP
} from '../resources/apiConfig'
import {
  RESET_PURVEYORS,
  GET_PURVEYORS,
  REQUEST_PURVEYORS,
  RECEIVE_PURVEYORS,
  ERROR_PURVEYORS,
  ADD_PURVEYOR,
  UPDATE_PURVEYOR,
  DELETE_PURVEYOR,
  ORDER_PURVEYOR_PRODUCT
} from './actionTypes'

let ddpClient = new DDPClient({
  url: DDP.ENDPOINT_WS,
});

function resetPurveyors(){
  return {
    type: RESET_PURVEYORS
  }
}

function addPurveyor(name, teamKey) {
  var purveyorAttributes = {
    name: name,
    description: "",
    teamKey: teamKey,
    products: [],
    deleted: false
  }
  ddpClient.call('createPurveyor', [purveyorAttributes]);
  return {
    type: ADD_PURVEYOR,
    purveyor: purveyorAttributes
  };
}

function completePurveyorProduct(message) {
  ddpClient.call('createMessage', [message]);
  return {
    type: ORDER_PURVEYOR_PRODUCT
  };
}

function addPurveyorProduct(purveyorId, productAttributes){
  ddpClient.call('addPurveyorProduct', [purveyorId, productAttributes]);
  return {
    type: UPDATE_PURVEYOR
  }
}

function updatePurveyorProduct(purveyorId, productId, productAttributes){
  ddpClient.call('updatePurveyorProduct', [purveyorId, productId, productAttributes]);
  return {
    type: UPDATE_PURVEYOR
  }
}

function updatePurveyor(purveyorId, purveyorAttributes){
  ddpClient.call('updatePurveyor', [purveyorId, purveyorAttributes]);
  return {
    type: UPDATE_PURVEYOR
  }
}

function deletePurveyor(purveyorId) {
  ddpClient.call('deletePurveyor', [purveyorId])
  return {
    type: DELETE_PURVEYOR,
    purveyorId: purveyorId
  }
}

function requestPurveyors() {
  return {
    type: REQUEST_PURVEYORS
  }
}

function errorPurveyors(errors){
  return {
    type: ERROR_PURVEYORS,
    errors: errors
  }
}

function receivePurveyors(purveyor) {
  console.log(RECEIVE_PURVEYORS, purveyor);
  return {
    type: RECEIVE_PURVEYORS,
    purveyor: purveyor
  }
}

function fetchPurveyors(teamKey){
  ddpClient.call('getPurveyors', [teamKey]);
}

function getPurveyors(){
  return (dispatch, getState) => {
    let teamKey = getState().session.teamKey;
    ddpClient.connect((error, wasReconnected) => {
      if (error) {
        return dispatch(errorPurveyors([{
          id: 'error_feed_connection',
          message: 'Feed connection error!'
        }]));
      }
      if (wasReconnected) {
        // console.log('PURVEYORS: Reestablishment of a connection.');
      }
      ddpClient.subscribe(DDP.SUBSCRIBE_PURVEYORS, [teamKey]);
    });
    ddpClient.on('message', (msg) => {
      var log = JSON.parse(msg);
      console.log("PURVEYORS DDP MSG", log);
      // var purveyorIds = getState().purveyors.data.map(function(purveyor) {
      //   return purveyor.id;
      // })
      if (log.fields){
        var data = log.fields;
        data.id = log.id;
        dispatch(receivePurveyors(data))
      }
    });
  }
}

export default {
  RESET_PURVEYORS,
  GET_PURVEYORS,
  REQUEST_PURVEYORS,
  RECEIVE_PURVEYORS,
  ERROR_PURVEYORS,
  ADD_PURVEYOR,
  UPDATE_PURVEYOR,
  DELETE_PURVEYOR,
  addPurveyor,
  addPurveyorProduct,
  updatePurveyorProduct,
  updatePurveyor,
  deletePurveyor,
  getPurveyors,
  resetPurveyors,
  completePurveyorProduct,
}
