import { DDP } from '../resources/apiConfig'
import {
  RESET_SESSION_VERSION,
  RESET_SESSION,
  REGISTER_SESSION,
  REQUEST_SESSION,
  RECEIVE_SESSION,
  ERROR_SESSION,
  UPDATE_SESSION,
} from './actionTypes'

export default function SessionActions(ddpClient){

  function resetSessionVersion() {
    return {
      type: RESET_SESSION_VERSION
    }
  }

  function resetSession() {
    return {
      type: RESET_SESSION
    }
  }

  function inviteContacts(contactList) {
    return (dispatch, getState) => {
      const { session } = getState();
      // TODO remove dummy numbers here
      contactList = ['6466961475', '562 310 5753', '(203)-507-1105', ' (806) 789-2921']
      contactList.forEach((contact) => {
        ddpClient.call('sendSMSInvite', [contact, session.teamId, session.userId]);
      })
    }
  }

  function registerSession(sessionParams) {
    return (dispatch, getState) => {
      // process ddp call
      if(sessionParams.hasOwnProperty('smsToken') === false){
        // dispatch a session clear to get make sure no lingering data exists
        dispatch(receiveSession({
          isAuthenticated: false,
          authToken: "",
          smsVerified: false,
          smsSent: false,
          username: null,
          userId: null,
          firstName: "",
          lastName: "",
          imageUrl: "",
          teamId: null,
          errors: null,
        }))

        //--------------------------------------
        // Re-connect DDP RESTRICTED channel
        //--------------------------------------
        ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.RESTRICTED.channel)
        ddpClient.subscribe(DDP.SUBSCRIBE_LIST.RESTRICTED.channel, [sessionParams.phoneNumber]);

        ddpClient.call('sendSMSCode', [sessionParams.phoneNumber])
      } else {
        ddpClient.call('loginWithSMS', [sessionParams.phoneNumber, sessionParams.smsToken])
      }
      return dispatch(requestSession(sessionParams))
    }
  }

  function updateSession(sessionParams) {
    return (dispatch, getState) => {
      const {session} = getState()
      ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.MESSAGES.channel)
      ddpClient.subscribe(DDP.SUBSCRIBE_LIST.MESSAGES.channel, [sessionParams.teamId]);
      ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.PURVEYORS.channel)
      ddpClient.subscribe(DDP.SUBSCRIBE_LIST.PURVEYORS.channel, [sessionParams.teamId]);
      // console.log('UPDATE SESSION: ', session, ' to: ', sessionParams)
      ddpClient.call('updateUser', [session.userId, sessionParams])
      return dispatch(receiveSession(sessionParams))
    }
  }

  function requestSession(sessionParams) {
    return {
      type: REQUEST_SESSION,
      phoneNumber: sessionParams.phoneNumber
    };
  }

  function receiveSession(response) {
    // console.log("RES", response);
    // Add the userId from the user.id coming back from the server
    if(response.hasOwnProperty('id') && response.id){
      response.userId = response.id;
    }
    return (dispatch, getState) => {
      const {session} = getState();
      var isAuthenticated = session.isAuthenticated;
      // console.log("AUTHENTICATE", isAuthenticated);
      //TODO: make this a bit more secure
      if(response.hasOwnProperty('smsVerified') && response.smsVerified === true && response.authToken){
        // console.log("SESSION", session, response);
        isAuthenticated = true;
      }
      if(response.hasOwnProperty('userId') && response.userId){
        // console.log(response);
        ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.TEAMS.channel)
        ddpClient.subscribe(DDP.SUBSCRIBE_LIST.TEAMS.channel, [response.userId]);
        ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.ERRORS.channel)
        ddpClient.subscribe(DDP.SUBSCRIBE_LIST.ERRORS.channel, [response.userId]);
      }
      if(response.hasOwnProperty('teamId') && response.teamId){
        ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.MESSAGES.channel)
        ddpClient.subscribe(DDP.SUBSCRIBE_LIST.MESSAGES.channel, [response.teamId]);
        ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.PURVEYORS.channel)
        ddpClient.subscribe(DDP.SUBSCRIBE_LIST.PURVEYORS.channel, [response.teamId]);
      }
      var action = Object.assign({}, session, response, {
        type: RECEIVE_SESSION,
        isAuthenticated: isAuthenticated
      });
      // console.log('isAuthenticated: ', action.type, action.isAuthenticated);
      return dispatch(action);
    }
  }

  function errorSession(errors) {
    return {
      type: ERROR_SESSION,
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
    RESET_SESSION_VERSION,
    RESET_SESSION,
    REGISTER_SESSION,
    REQUEST_SESSION,
    RECEIVE_SESSION,
    ERROR_SESSION,
    UPDATE_SESSION,
    // createSession,
    'resetSessionVersion': resetSessionVersion,
    'resetSession': resetSession,
    'updateSession': updateSession,
    'registerSession': registerSession,
    'receiveSession': receiveSession,
    'inviteContacts': inviteContacts,
  }
}
