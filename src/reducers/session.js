import {
  UPDATE_SESSION,
  RESET_SESSION,
  REQUEST_SESSION,
  RECEIVE_SESSION,
  ERROR_SESSION
} from '../actions';

const initialState = {
  session: {
    isAuthenticated: false,
    smsSent: false,
    phoneNumber: null,
    username: null,
    userId: null,
    firstName: "",
    lastName: "",
    imageUrl: "",
    teamId: null,
    errors: null,
    lastUpdated: null
  }
};

function session(state = initialState.session, action) {
  switch (action.type) {
  case RESET_SESSION:
    return Object.assign({}, state, initialState.session)
  case REQUEST_SESSION:
    return Object.assign({}, state, {
      phoneNumber: action.phoneNumber,
      errors: null
    })
  case RECEIVE_SESSION:
    console.log("ACTION", action);
    var newSessionState = Object.assign({}, state, {
      isAuthenticated: action.isAuthenticated,
      smsSent: action.smsSent,
      userId: action.userId,
      username: action.username,
      imageUrl: action.imageUrl,
      teamId: action.teamId,
      firstName: action.firstName,
      lastName: action.lastName,
      errors: null,
      lastUpdated: (new Date).getTime()
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
