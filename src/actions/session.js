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
        let {session} = getState();
        let messageAttributes = {
          message: 'Welcome to Sous! This is your personal Notepad, but you can create a new team and start collaborating with your fellow cooks by tapping the icon in the top right.',
          userId: session.userId,
          author: 'Sous',
          teamId: session.teamId,
          createdAt: (new Date()).getTime(),
          imageUrl: 'https://sous-assets-production.s3.amazonaws.com/uploads/89b217dc-4ec5-43e8-9569-8fc85e6fdd52/New+Sous+Logo+Circle+Small.png',
        }
        console.log("SESSION", session, messageAttributes);
        ddpClient.call('createMessage', [messageAttributes])
      }
      return dispatch(requestSession(sessionParams))
    }
  }

  function updateSession(sessionParams) {
    return (dispatch, getState) => {
      const {session} = getState()
      // ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.MESSAGES.channel)
      // ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.PURVEYORS.channel)
      // ddpClient.subscribe(DDP.SUBSCRIBE_LIST.PURVEYORS.channel, [sessionParams.teamId]);
      // // console.log('UPDATE SESSION: ', session, ' to: ', sessionParams)
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
      const {session, teams} = getState();
      var isAuthenticated = session.isAuthenticated;
      // console.log("AUTHENTICATE", isAuthenticated);
      //TODO: make this a bit more secure
      if(response.hasOwnProperty('smsVerified') && response.smsVerified === true && response.authToken){
        // console.log("SESSION", session, response);
        isAuthenticated = true;
      }
      if(response.hasOwnProperty('userId') && response.userId){
        // console.log(response);
        // if local app state contains team, connect the messages
        // let teamIds = teams.data.map((team) => {teamIds.push(team.id)})
        // console.log('TEAM IDS', teamIds);
        // if (teamIds.length > 0) {
        //   ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.MESSAGES.channel)
        //   ddpClient.subscribe(DDP.SUBSCRIBE_LIST.MESSAGES.channel, [teamIds]);
        // }

        ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.TEAMS.channel)
        ddpClient.subscribe(DDP.SUBSCRIBE_LIST.TEAMS.channel, [response.userId]);
        ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.ERRORS.channel)
        ddpClient.subscribe(DDP.SUBSCRIBE_LIST.ERRORS.channel, [response.userId]);
      }
      if(response.hasOwnProperty('teamId') && response.teamId){
        ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.PURVEYORS.channel)
        ddpClient.subscribe(DDP.SUBSCRIBE_LIST.PURVEYORS.channel, [response.teamId]);
        ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.CATEGORIES.channel)
        ddpClient.subscribe(DDP.SUBSCRIBE_LIST.CATEGORIES.channel, [response.teamId]);
        ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.PRODUCTS.channel)
        ddpClient.subscribe(DDP.SUBSCRIBE_LIST.PRODUCTS.channel, [response.teamId]);
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
