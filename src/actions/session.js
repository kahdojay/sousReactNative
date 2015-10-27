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

export default function SessionActions(ddpClient, allActions){

  const {
    connectActions
  } = allActions;

  const allowedUserFields = {
    phoneNumber: true,
    username: true,
    email: true,
    firstName: true,
    lastName: true,
    imageUrl: true,
    notifications: true,
    teamId: true,
  };

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
      contactList.forEach((contact) => {
        dispatch(() => {
          ddpClient.call('sendSMSInvite', [contact, session.teamId, session.userId]);
        })
      })
    }
  }

  function registerSession(sessionParams) {
    return (dispatch, getState) => {
      const {session} = getState()
      // process ddp call
      // console.log('SESSION PARAMS', sessionParams);

      const newSession = Object.assign({}, session, sessionParams)
      // console.log('NEW SESSION PARAMS', newSession);

      // resubscribe based on session data
      dispatch(connectActions.subscribeDDP(newSession, undefined));

      if(sessionParams.hasOwnProperty('smsToken') === false){
        // dispatch(receiveSession({
        //   teamId: null
        // }))
        dispatch(() => {
          ddpClient.call('sendSMSCode', [sessionParams.phoneNumber, session.authToken])
        })
      } else {
        dispatch(() => {
          ddpClient.call('loginWithSMS', [sessionParams.phoneNumber, sessionParams.smsToken])
        })
      }
      return dispatch(requestSession(sessionParams))
    }
  }

  function updateSession(sessionParams) {
    return (dispatch, getState) => {
      const {session} = getState()
      const filteredSessionParams = {}
      Object.keys(sessionParams).map((key) => {
        if(allowedUserFields.hasOwnProperty(key) === true){
          filteredSessionParams[key] = sessionParams[key];
        }
      })
      dispatch(() => {
        ddpClient.call('updateUser', [session.userId, filteredSessionParams])
      })
      // console.log('UPDATE SESSION: ', session, ' to: ', sessionParams)
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
      // console.log(response, session);
      //TODO: make this a bit more secure
      if(response.hasOwnProperty('smsVerified') && response.smsVerified === true && response.authToken){
        // console.log("SESSION", session, response);
        isAuthenticated = true;
      }
      const newSession = Object.assign({}, session, response, {
        isAuthenticated: isAuthenticated
      })
      // resubscribe based on session data
      dispatch(connectActions.subscribeDDP(newSession, undefined));
      let action = newSession
      action.type = RECEIVE_SESSION
      // console.log('isAuthenticated: ', action.type, action.isAuthenticated);
      return dispatch(newSession);
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
