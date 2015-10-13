// import { getStations, resetStations } from './station'
import {
  RESET_SESSION,
  REGISTER_SESSION,
  REQUEST_SESSION,
  RECEIVE_SESSION,
  ERROR_SESSION,
  UPDATE_SESSION,
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

  function updateSession(image, session) {
    let newImage = image;
    console.log("IMAGE", image);
    return (dispatch, getState) => {
      console.log("STATE", getState());
      let session = getState().session;
      let login = session.login;
      let response = {
        token: session.token,
        userId: session.userId,
        teamKey: session.teamKey,
        username: session.username,
        imageUrl: newImage.uri,
      }
      dispatch(receiveSession(login, response));
    }
  }

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
      username: response.username || "",
      imageUrl: response.imageUrl || "",
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
    UPDATE_SESSION,
    // createSession,
    resetSession,
    updateSession,
    registerSession
  }
}
