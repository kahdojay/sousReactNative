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
  user_id: null,
  team_id: null,
  errors: null
};

function session(state = initialState, action) {
  switch (action.type) {
  case RESET_SESSION:
    return Object.assign({}, state, {
      isAuthenticated: false,
      isFetching: false,
      errors: null
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
      user_id: action.user_id,
      errors: null,
      lastUpdated: action.receivedAt
    })
  case ERROR_SESSION:
    return Object.assign({}, state, {
      isFetching: false,
      login: action.login,
      user_id: null,
      team_id: null,
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