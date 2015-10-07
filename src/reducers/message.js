import {
  RESET_MESSAGES,
  GET_MESSAGES,
  REQUEST_MESSAGES,
  RECEIVE_MESSAGES,
  ERROR_MESSAGES,
  ADD_MESSAGE,
  DELETE_MESSAGE
} from '../actions';

const initialState = {
  messages: {
    isFetching: false,
    errors: null,
    data: {},
    lastUpdated: null
  }
};

function messages(state = initialState.messages, action) {
  switch (action.type) {
  case RESET_MESSAGES:
    return Object.assign({}, initialState.messages);
  case REQUEST_MESSAGES:
    return Object.assign({}, state, {
      isFetching: true,
      errors: null,
    });
  case RECEIVE_MESSAGES:
    return Object.assign({}, state, {
      isFetching: false,
      errors: null,
      data: Object.assign({}, action.messages),
      lastUpdated: (new Date()).getTime()
    });
  case ADD_MESSAGE:
    return Object.assign({}, state, {
      data: Object.assign({}, state.data, action.message)
    });
  case DELETE_MESSAGE:
    let newStationState = Object.assign({}, state);
    newStationState.data[action.messageKey].deleted = true;
    return newStationState;
  case GET_MESSAGES:
  default:
    return state;
  }
}

const messageReducers = {
  'messages': messages
}

export default messageReducers
