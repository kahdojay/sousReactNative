import { generateId } from '../utilities/utils'
import MessageActions from './message'
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

export default function PurveyorActions(allActions){

  const {
    connectActions,
    messageActions,
  } = allActions

  function resetPurveyors(){
    return {
      type: RESET_PURVEYORS
    }
  }

  function addPurveyor(name) {
    return (dispatch, getState) => {
      const { session } = getState();
      var newPurveyorAttributes = {
        _id: generateId(),
        teamId: session.teamId,
        name: name,
        description: '',
        // products:    [],
        deleted:  false
      }
      dispatch(connectActions.ddpCall('createPurveyor', [newPurveyorAttributes]))
      return dispatch({
        type: ADD_PURVEYOR,
        purveyor: newPurveyorAttributes
      });
    }
  }

  function completePurveyorProduct(messageText) {
    return (dispatch) => {
      dispatch(messageActions.createMessage(messageText))
      return dispatch({
        type: ORDER_PURVEYOR_PRODUCT
      });
    }
  }

  function addPurveyorProduct(purveyorId, productAttributes){
    return (dispatch) => {
      var newProductAttributes = {
        productId: generateId(),
        name: productAttributes.name,
        description: "",
        deleted: false,
        ordered: false,
        quantity: 1,
        price: 0.0,
        unit: productAttributes.unit || '0 oz'
      }
      dispatch(connectActions.ddpCall('addPurveyorProduct', [purveyorId, newProductAttributes]))
      return dispatch({
        type: UPDATE_PURVEYOR,
        purveyorId: purveyorId,
        product: newProductAttributes
      })
    }
  }

  function updatePurveyorProduct(purveyorId, productId, productAttributes){
    return (dispatch) => {
      dispatch(connectActions.ddpCall('updatePurveyorProduct', [purveyorId, productId, productAttributes]))
      return dispatch({
        type: UPDATE_PURVEYOR,
        purveyorId: purveyorId,
        productId: productId,
        product: productAttributes
      })
    }
  }

  function updatePurveyor(purveyorId, purveyorAttributes){
    return (dispatch) => {
      dispatch(connectActions.ddpCall('updatePurveyor', [purveyorId, purveyorAttributes]))
      return dispatch({
        type: UPDATE_PURVEYOR,
        purveyorId: purveyorId,
        purveyor: purveyorAttributes
      })
    }
  }

  function deletePurveyor(purveyorId) {
    return (dispatch, getState) => {
      const {session} = getState()
      dispatch(connectActions.ddpCall('deletePurveyor', [purveyorId, session.userId]))
      return dispatch({
        type: DELETE_PURVEYOR,
        purveyorId: purveyorId
      })
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
