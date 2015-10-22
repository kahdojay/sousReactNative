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
        ddpClient.call('sendSMSInvite', [contact, session.teamId, session.userId]);
      })
    }
  }

  function registerSession(sessionParams) {
    return (dispatch, getState) => {
      const {session} = getState()
      // process ddp call
      // console.log('SESSION PARAMS', sessionParams);

      const newSession = Object.assign({}, session, sessionParams)
      console.log('NEW SESSION PARAMS', newSession);

      // resubscribe based on session data
      dispatch(connectActions.subscribeDDP(newSession, undefined));

      if(sessionParams.hasOwnProperty('smsToken') === false){
        // // dispatch a session clear to get make sure no lingering data exists
        // dispatch(receiveSession({
        //   isAuthenticated: false,
        //   smsVerified: false,
        //   smsSent: false,
        //   errors: null,
        //   phoneNumber: sessionParams.phoneNumber,
        // }))
        ddpClient.call('sendSMSCode', [sessionParams.phoneNumber, session.authToken])
      } else {
        ddpClient.call('loginWithSMS', [sessionParams.phoneNumber, sessionParams.smsToken])
        const {session, messages} = getState();
        // console.log(messages);
        if(messages.data.length == 0){
          const messageAttributes = {
            message: 'Welcome to Sous! This is your personal Notepad, but you can create a new team and start collaborating with your fellow cooks by tapping the icon in the top right.',
            userId: session.userId,
            author: 'Sous',
            teamId: session.teamId,
            createdAt: (new Date()).getTime(),
            imageUrl: 'https://sous-assets-production.s3.amazonaws.com/uploads/89b217dc-4ec5-43e8-9569-8fc85e6fdd52/New+Sous+Logo+Circle+Small.png',
          }
          // console.log("SESSION", session, messageAttributes);
          ddpClient.call('createMessage', [messageAttributes])
        }
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
      ddpClient.call('updateUser', [session.userId, filteredSessionParams])
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
