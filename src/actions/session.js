import { RESET_SESSION, REGISTER_SESSION, REQUEST_SESSION, RECEIVE_SESSION, ERROR_SESSION } from './actionTypes'
import { getStations } from './station'
import Fetcher from '../utilities/fetcher';

let SousFetcher = null;

// function validateSession() {
//   return (dispatch, getState) => {
//     let session = getState()
//     return dispatch(fetchSession(sessionParams))
//   }
// }

function retrieveSessionInfo(){
  return (dispatch) => {
    dispatch(getStations())
  }
}

function resetSession() {
  return {
    type: RESET_SESSION
  }
}

function registerSession(sessionParams) {
  return {
    type: REGISTER_SESSION
  }
}

function fetchSession(sessionParams) {
  return (dispatch) => {
    dispatch(requestSession())
    return SousFetcher.session.create(sessionParams)
      .then(res => {
        if (res.success === false)
          dispatch(errorSession(sessionParams.email, res.errors))
        else
          // retrieve this session's information
          dispatch(retrieveSessionInfo())

          // dispatch receive session action
          dispatch(receiveSession(sessionParams.email, res.token, res.user_id))
      })
  }
}

function requestSession() {
  return {
    type: REQUEST_SESSION,
  };
}

function receiveSession(login, token, userId) {
  return {
    type: RECEIVE_SESSION,
    token: token,
    login: login,
    userId: userId,
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
  registerSession
}
