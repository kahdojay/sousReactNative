import {
  RESET_SESSION,
  REQUEST_SESSION,
  RECEIVE_SESSION,
  ERROR_SESSION
} from '../actions';

const initialState = {
  isAuthenticated: false,
  isFetching: false,
  login: null,
  token: null,
  userId: null,
  teamKey: null,
  errors: null
};

function session(state = initialState, action) {
  switch (action.type) {
  case RESET_SESSION:
    return Object.assign({}, state, {
      isAuthenticated: false,
      isFetching: false,
      errors: null,
      stations: {},
      tasks: {},
      session: {
        isAuthenticated: false,
        isFetching: false,
        login: ''
      }
    })
  case REQUEST_SESSION:
    return Object.assign({}, state, {
      isFetching: true,
      errors: null
    })
  case RECEIVE_SESSION:
    return Object.assign({}, state, {
      isAuthenticated: true,
      isFetching: false,
      login: action.login,
      token: action.token,
      userId: action.userId,
      teamKey: action.teamKey,
      errors: null,
      lastUpdated: action.receivedAt
    })
  case ERROR_SESSION:
    return Object.assign({}, state, {
      isFetching: false,
      login: action.login,
      userId: null,
      teamKey: null,
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
