import { RESET_SESSION, REQUEST_SESSION, RECEIVE_SESSION, ERROR_SESSION } from './actionTypes'
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

function fetchSession(sessionParams) {
  return (dispatch) => {
    dispatch(requestSession())
    return SousFetcher.session.create(sessionParams)
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
  REQUEST_SESSION,
  RECEIVE_SESSION,
  ERROR_SESSION,
  // validateSession,
  createSession,
  resetSession
}
