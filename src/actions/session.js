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

export default function SessionActions(allActions){

  const {
    connectActions
  } = allActions;

  const ALLOWED_USER_FIELDS = {
    phoneNumber: true,
    username: true,
    email: true,
    firstName: true,
    lastName: true,
    imageUrl: true,
    notifications: true,
    teamId: true,
    viewedOnboarding: true,
    resetAppState: true,
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
      contactList.forEach((phoneNumber) => {
        dispatch(connectActions.ddpCall('sendSMSInvite', [phoneNumber, session.teamId, session.userId]))
      })
    }
  }

  function registerSession(sessionParams) {
    return (dispatch, getState) => {
      const {session, teams} = getState()
      // process ddp call
      // console.log('SESSION PARAMS', sessionParams);

      const sessionCb = (err, result) => {
        const newSession = Object.assign({}, session, sessionParams, result)
        // console.log('NEW SESSION PARAMS', newSession);

        // resubscribe based on session data
        const teamIds = _.pluck(teams.data, 'id')
        dispatch(connectActions.subscribeDDP(newSession, teamIds));
        if(sessionParams.hasOwnProperty('smsToken') === true){
          dispatch({
            type: REGISTER_SESSION,
            session: newSession,
          })
        }
        dispatch(requestSession(sessionParams))
      }

      if(sessionParams.hasOwnProperty('smsToken') === false){
        dispatch(connectActions.ddpCall('sendSMSCode', [sessionParams.phoneNumber, session.authToken], sessionCb))
      } else {
        dispatch(connectActions.ddpCall('loginWithSMS', [session.userId, sessionParams.smsToken], sessionCb))
      }
    }
  }

  function updateSession(sessionParams) {
    return (dispatch, getState) => {
      const {session} = getState()
      const filteredSessionParams = {}
      Object.keys(sessionParams).map((key) => {
        if(ALLOWED_USER_FIELDS.hasOwnProperty(key) === true){
          filteredSessionParams[key] = sessionParams[key];
        }
      })
      if(sessionParams.hasOwnProperty('imageData') === true){
        const ddpCallArguments = [
          sessionParams.imageData,
          'avatars/avatar_' + session.userId + '.jpg',
          session.userId
        ]
        dispatch(connectActions.ddpCall('streamS3Image', ddpCallArguments))
        // sessionParams.imageUrl = `data:image/jpeg;base64,${sessionParams.imageData}`
        delete sessionParams.imageData
      }
      dispatch(connectActions.ddpCall('updateUser', [session.userId, filteredSessionParams]))

      // console.log('UPDATE SESSION: ', session, ' to: ', sessionParams)
      return dispatch(receiveSession(sessionParams))
    }
  }

  function requestSession(sessionParams) {
    return {
      type: REQUEST_SESSION,
      phoneNumber: sessionParams.phoneNumber,
      smsToken: sessionParams.smsToken || null,
    };
  }

  function receiveSession(response) {
    // console.log("RES", response);
    // Add the userId from the user.id coming back from the server
    if(response.hasOwnProperty('id') && response.id){
      response.userId = response.id;
    }
    // remove the image data, since we dont want to store it in the state
    if(response.hasOwnProperty('imageData') === true){
      delete response.imageData
    }
    return (dispatch, getState) => {
      const {session, teams} = getState();
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
      // console.log(newSession)
      // resubscribe based on session data
      const teamIds = _.pluck(teams.data, 'id')
      dispatch(connectActions.subscribeDDP(newSession, teamIds));
      let action = newSession
      action.type = RECEIVE_SESSION
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
