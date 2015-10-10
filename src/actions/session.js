import Fetcher from '../utilities/fetcher';
// import { getStations, resetStations } from './station'
import {
  RESET_SESSION,
  REGISTER_SESSION,
  REQUEST_SESSION,
  RECEIVE_SESSION,
  ERROR_SESSION
} from './actionTypes'

let SousFetcher = null;

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
        email: sessionParams.email,
        username: sessionParams.username,
        password: sessionParams.password,
        team: sessionParams.teamName
      })
      .then((res) => {
        if (res.success === true){
          dispatch(receiveSession(sessionParams.email, res))
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
          dispatch(receiveSession(sessionParams.email, res))
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

function receiveSession(login, response) {
  return {
    type: RECEIVE_SESSION,
    login: login,
    token: response.token,
    userId: response.userId,
    username: response.username,
    teamKey: response.teamKey,
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
export default function SessionActions(ddpClient){
  return {
    RESET_SESSION,
    REGISTER_SESSION,
    REQUEST_SESSION,
    RECEIVE_SESSION,
    ERROR_SESSION,
    // validateSession,
    createSession,
    resetSession,
    // resetSessionInfo,
    registerSession
  }
}
