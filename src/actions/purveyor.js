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

export default function PurveyorActions(ddpClient){

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
    // console.log(RECEIVE_PURVEYORS, purveyor);
    return {
      type: RECEIVE_PURVEYORS,
      purveyor: purveyor
    }
  }

  return {
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
    // getPurveyors,
    receivePurveyors,
    resetPurveyors,
    completePurveyorProduct,
  }
}
