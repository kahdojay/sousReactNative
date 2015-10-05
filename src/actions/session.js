import Fetcher from '../utilities/fetcher';
import { getStations, resetStations } from './station'
import {
  RESET_SESSION,
  REGISTER_SESSION,
  REQUEST_SESSION,
  RECEIVE_SESSION,
  ERROR_SESSION
} from './actionTypes'

let SousFetcher = null;

// function validateSession() {
//   return (dispatch, getState) => {
//     let session = getState()
//     return dispatch(fetchSession(sessionParams))
//   }
// }

function resetSessionInfo(){
  return (dispatch) => {
    // reset the stations
    dispatch(resetStations())
    // reset the tasks
    // ...
  }
}

function retrieveSessionInfo(){
  return (dispatch) => {
    // get the stations
    dispatch(getStations())
    // get the tasks
    // ...
  }
}

function resetSession() {
  return {
    type: RESET_SESSION
  }
}

function registerSession(sessionParams) {
  return (dispatch, getState) => {
    if(SousFetcher == null){
      SousFetcher = new Fetcher(getState())
    }
    dispatch(requestSession())
    return SousFetcher.user.create({
        user: {
          email: sessionParams.email,
          password: sessionParams.password,
          restaurant: sessionParams.team_name,
          team_id: sessionParams.team_id
        }
      })
      .then((res) => {
        if (res.success === true){
          // retrieve this session's information
          dispatch(retrieveSessionInfo())
          // dispatch receive session action
          dispatch(receiveSession(sessionParams.email, res.token, res.user_id))
        } else {
          dispatch(errorSession(sessionParams.email, res.errors))
        }
      })
  }
}

function fetchSession(sessionParams) {
  return (dispatch) => {
    dispatch(requestSession())
    return SousFetcher.session.create(sessionParams)
      .then((res) => {
        if (res.success === true){
          // dispatch receive session action
          dispatch(receiveSession(sessionParams.email, res.token, res.user_id))
          // retrieve this session's information
          dispatch(retrieveSessionInfo())
        } else {
          dispatch(errorSession(sessionParams.email, res.errors))
        }
      })
  }
}

function requestSession() {
  return {
    type: REQUEST_SESSION,
  };
}

function receiveSession(login, token, user_id) {
  return {
    type: RECEIVE_SESSION,
    token: token,
    login: login,
    user_id: user_id,
    receivedAt: (new Date).getTime()
  };
}

function errorSession(login, errors) {
  return {
    type: ERROR_SESSION,
    login: login,
    errors: errors
  }
}

function createSession(sessionParams) {
  return (dispatch, getState) => {
    SousFetcher = new Fetcher(getState())
    return dispatch(fetchSession(sessionParams))
  }
}

// note: expose other action creators for testing
export default {
  RESET_SESSION,
  REGISTER_SESSION,
  REQUEST_SESSION,
  RECEIVE_SESSION,
  ERROR_SESSION,
  // validateSession,
  createSession,
  resetSession,
  resetSessionInfo,
  registerSession
}
