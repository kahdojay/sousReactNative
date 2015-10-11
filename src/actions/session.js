// import { getStations, resetStations } from './station'
import {
  RESET_SESSION,
  REGISTER_SESSION,
  REQUEST_SESSION,
  RECEIVE_SESSION,
  ERROR_SESSION
} from './actionTypes'

export default function SessionActions(ddpClient){

  function resetSession() {
    return {
      type: RESET_SESSION
    }
  }

  function registerSession(sessionParams) {
    return (dispatch, getState) => {
      ddpClient.call('sendSMSCode', [sessionParams.phoneNumber])
      // ddpClient.call('loginWithSMS', ["8067892921", "3019"])
      return dispatch(requestSession(sessionParams))
    }
  }

  // function fetchSession(sessionParams) {
  //   return (dispatch) => {
  //     dispatch(requestSession())
  //     return SousFetcher.session.create(sessionParams)
  //       .then((res) => {
  //         if (res.success === true){
  //           // dispatch receive session action
  //           dispatch(receiveSession(sessionParams.email, res))
  //           // retrieve this session's information
  //           dispatch(retrieveSessionInfo())
  //         } else {
  //           dispatch(errorSession(sessionParams.email, res.errors))
  //         }
  //       })
  //   }
  // }

  function requestSession(sessionParams) {
    return {
      type: REQUEST_SESSION,
      phoneNumber: sessionParams.phoneNumber
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

  // function createSession(sessionParams) {
  //   return (dispatch, getState) => {
  //     SousFetcher = new Fetcher(getState())
  //     return dispatch(fetchSession(sessionParams))
  //   }
  // }

  return {
    RESET_SESSION,
    REGISTER_SESSION,
    REQUEST_SESSION,
    RECEIVE_SESSION,
    ERROR_SESSION,
    // validateSession,
    // createSession,
    resetSession,
    // resetSessionInfo,
    registerSession
  }
}
