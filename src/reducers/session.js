import { SESSION_VERSION } from '../resources/apiConfig'
import {
  RESET_SESSION_VERSION,
  UPDATE_SESSION,
  RESET_SESSION,
  REQUEST_SESSION,
  RECEIVE_SESSION,
  ERROR_SESSION
} from '../actions';

const initialState = {
  session: {
    authToken: "",
    email: null,
    errors: null,
    firstName: "",
    inviteModalVisible: false,
    imageUrl: "",
    isAuthenticated: false,
    lastName: "",
    lastUpdated: null,
    notifications: false,
    phoneNumber: null,
    smsSent: false,
    smsVerified: false,
    teamId: null,
    username: null,
    userId: null,
    version: 0,
    viewedOnboarding: null,
  }
};

function session(state = initialState.session, action) {
  switch (action.type) {
  case RESET_SESSION_VERSION:
    var newState = state;
    if(SESSION_VERSION !== newState.version){
      newState = Object.assign({}, initialState.session, {
        version: SESSION_VERSION
      })
      // console.log('UPDATING APP SESSION TO: ', newState);
    }
    return newState;
  case RESET_SESSION:
    return Object.assign({}, initialState.session)
  case REQUEST_SESSION:
    return Object.assign({}, state, {
      phoneNumber: action.phoneNumber,
      errors: null
    })
  case RECEIVE_SESSION:
    var newSessionState = Object.assign({}, state, action, {
      errors: null,
      lastUpdated: (new Date).toISOString()
    })
    // console.log(newSessionState);
    return newSessionState;
  case UPDATE_SESSION:
    //TODO: prevent certain session vars from being updated (eg. userId, phoneNumber)
    return Object.assign({}, state, action.session)
  case ERROR_SESSION:
    return Object.assign({}, state, {
      phoneNumber: action.phoneNumber,
      errors: action.errors
    })
  default:
    return state;
  }
}

const sessionReducers = {
  'session': session
}

export default sessionReducers
