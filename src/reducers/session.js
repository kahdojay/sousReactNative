import {
  RESET_SESSION,
  REQUEST_SESSION,
  RECEIVE_SESSION,
  ERROR_SESSION
} from '../actions';

const initialState = {
  isAuthenticated: false,
  isFetching: false,
  phoneNumber: null,
  token: null,
  userId: null,
  firstName: "First",
  lastName: "Last",
  imageUrl: "",
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
        phoneNumber: ''
      }
    })
  case REQUEST_SESSION:
    return Object.assign({}, state, {
      isFetching: true,
      phoneNumber: action.phoneNumber,
      errors: null
    })
  case RECEIVE_SESSION:
    return Object.assign({}, state, {
      isAuthenticated: true,
      isFetching: false,
      phoneNumber: action.phoneNumber,
      token: action.token,
      imageUrl: action.imageUrl,
      username: action.username,
      userId: action.userId,
      teamKey: action.teamKey,
      errors: null,
      lastUpdated: action.receivedAt
    })
  case ERROR_SESSION:
    return Object.assign({}, state, {
      isFetching: false,
      phoneNumber: action.phoneNumber,
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
