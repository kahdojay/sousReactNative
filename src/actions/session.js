import { DDP } from '../resources/apiConfig'
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

      //--------------------------------------
      // Re-connect DDP RESTRICTED channel
      //--------------------------------------
      ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.RESTRICTED.channel)
      ddpClient.subscribe(DDP.SUBSCRIBE_LIST.RESTRICTED.channel, [sessionParams.phoneNumber]);

      // process ddp call
      if(sessionParams.hasOwnProperty('smsToken')){
        ddpClient.call('loginWithSMS', [sessionParams.phoneNumber, sessionParams.smsToken])
      } else {
        ddpClient.call('sendSMSCode', [sessionParams.phoneNumber])
      }
      return dispatch(requestSession(sessionParams))
    }
  }

  function updateSession(sessionParams) {
    console.log(sessionParams);
    let params = {imageUrl: sessionParams.uri}
    return (dispatch) => {
      return dispatch(receiveSession(params))
    }
  }

  function requestSession(sessionParams) {
    return {
      type: REQUEST_SESSION,
      phoneNumber: sessionParams.phoneNumber
    };
  }

  function receiveSession(response) {
    console.log("RES", response);
    return (dispatch, getState) => {
      const {session} = getState();
      var isAuthenticated = session.isAuthenticated;
      console.log("AUTHENTICATE", isAuthenticated);
      //TODO: make this a bit more secure
      if(response.hasOwnProperty('smsVerified') && response.smsVerified === true && response.authToken){
        console.log("SESSION", session, response);
        isAuthenticated = true;
        ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.STATIONS.channel)
        ddpClient.subscribe(DDP.SUBSCRIBE_LIST.STATIONS.channel, [session.teamId]);
        ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.MESSAGES.channel)
        ddpClient.subscribe(DDP.SUBSCRIBE_LIST.MESSAGES.channel, [session.teamId]);
        ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.PURVEYORS.channel)
        ddpClient.subscribe(DDP.SUBSCRIBE_LIST.PURVEYORS.channel, [session.teamId]);
      }
      var action = Object.assign({}, session, response, {
        type: RECEIVE_SESSION,
        isAuthenticated: isAuthenticated
      });
      // console.log('isAuthenticated: ', action.type, action.isAuthenticated);
      return dispatch(action);
    }
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
    registerSession,
    receiveSession
  }
}
