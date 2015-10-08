import murmurhash from 'murmurhash'
import Fetcher from '../utilities/fetcher'
import {
  RESET_PURVEYORS,
  GET_PURVEYORS,
  REQUEST_PURVEYORS,
  RECEIVE_PURVEYORS,
  ERROR_PURVEYORS,
  ADD_PURVEYOR,
  DELETE_PURVEYOR
} from './actionTypes'

let SousFetcher = null;

function resetPurveyors(){
  return {
    type: RESET_PURVEYORS
  }
}

function addPurveyor(name) {
  let newPurveyor = {}
  let newKey = murmurhash.v3(name).toString(16);
  newPurveyor[newKey] = {
    key: newKey,
    name: name,
    created_at: (new Date).toISOString(),
    update_at: (new Date).toISOString(),
    deleted: false
  }
  console.log('action addpurveyor', newPurveyor)
  return {
    type: ADD_PURVEYOR,
    purveyor: newPurveyor
  };
}

function deletePurveyor(purveyorKey) {
  return {
    type: DELETE_PURVEYOR,
    purveyorKey: purveyorKey
  }
}

function requestPurveyors() {
  return {
    type: REQUEST_PURVEYORS
  }
}

function receivePurveyors(purveyors) {
  return {
    type: RECEIVE_PURVEYORS,
    purveyors: purveyors
  }
}

function errorPurveyors(errors){
  return {
    type: ERROR_PURVEYORS,
    errors: errors
  }
}

function fetchPurveyors(user_id){
  return (dispatch) => {
    dispatch(requestPurveyors())
    return SousFetcher.purveyor.find({
      user_id: user_id,
      requestedAt: (new Date).getTime()
    }).then(res => {
      if (res.success === false) {
        dispatch(errorPurveyors(res.errors))
      } else {
        dispatch(receivePurveyors(res))
      }
    })
  }
}

function getPurveyors(){
  return (dispatch, getState) => {
    let state = getState()
    SousFetcher = new Fetcher(state)
    return dispatch(fetchPurveyors(state.session.user_id));
  }
}

export default {
  RESET_PURVEYORS,
  GET_PURVEYORS,
  REQUEST_PURVEYORS,
  RECEIVE_PURVEYORS,
  ERROR_PURVEYORS,
  ADD_PURVEYOR,
  DELETE_PURVEYOR,
  addPurveyor,
  deletePurveyor,
  getPurveyors,
  resetPurveyors,
}
