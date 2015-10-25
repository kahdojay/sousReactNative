import { getIdx, updateByIdx, updateDataState } from '../utilities/reducer'
import {
  RESET_MESSAGES,
  GET_MESSAGES,
  REQUEST_MESSAGES,
  RECEIVE_MESSAGES,
  ERROR_MESSAGES,
  CREATE_MESSAGE,
  DELETE_MESSAGE
} from '../actions';

const initialState = {
  messages: {
    isFetching: false,
    errors: null,
    data: [],
    lastUpdated: null
  }
};

function messages(state = initialState.messages, action) {
  switch (action.type) {
  // reset the messages
  case RESET_MESSAGES:
    return Object.assign({}, initialState.messages);

  // request the messages
  case REQUEST_MESSAGES:
    return Object.assign({}, state, {
      isFetching: true,
      errors: null,
    });

  // receive the messages
  case RECEIVE_MESSAGES:
    var newMessageState = Object.assign({}, state);
    var currentMessagesDataState = updateDataState(newMessageState.data, action.message)
    // console.log(action.type, action.message.id)
    // console.log('TEAM REDUCER: ', currentMessagesDataState)
    return Object.assign({}, state, {
      isFetching: false, // do we need to phase this out?
      errors: null,
      data: currentMessagesDataState,
      lastUpdated: (new Date()).toISOString()
    });

  // create message
  case CREATE_MESSAGE:
    var newMessageState = Object.assign({}, state);
    var currentMessagesDataState = updateDataState(newMessageState.data, action.message)
    // console.log(action.type, action.message.id)
    return Object.assign({}, state, {
      data: currentMessagesDataState,
      lastUpdated: (new Date()).toISOString()
    });

  // delete message
  case DELETE_MESSAGE:
    var newMessageState = Object.assign({}, state);
    var messageIdx = getIdx(newMessageState.data, action.messageId);
    var currentMessagesDataState = updateByIdx(newMessageState.data, messageIdx, { deleted: true });
    return Object.assign({}, state, {
      data: currentMessagesDataState,
      lastUpdated: (new Date()).toISOString()
    });

  // everything else
  case GET_MESSAGES:
  default:
    return state;
  }
}

const messageReducers = {
  'messages': messages
}

export default messageReducers
