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
  case RESET_MESSAGES:
    return Object.assign({}, initialState.messages);
  case REQUEST_MESSAGES:
    return Object.assign({}, state, {
      isFetching: true,
      errors: null,
    });
  case RECEIVE_MESSAGES:
    let messagesState = state.data;
    var messageIdx = _.findIndex(state.data, (message, idx) => {
      return message.id == action.message.id;
    });
    if(messageIdx === -1){
      messagesState.push(action.message);
    } else {
      messagesState = [
        ...messagesState.slice(0, messageIdx),
        Object.assign({}, messagesState[messageIdx], action.message),
        ...messagesState.slice(messageIdx + 1)
      ]
    }

    // messagesState.push(action.message);
    return Object.assign({}, state, {
      isFetching: false,
      errors: null,
      data: messagesState,
      lastUpdated: (new Date()).getTime()
    });
  case CREATE_MESSAGE:
    //TODO: optimistic updates would go here??
    // let currentMessages = state.data;
    // currentMessages.push(action.messages);
    // return Object.assign({}, state, {
    //   data: currentMessages
    // });
    return state;
  case DELETE_MESSAGE:
    let newMessageState = Object.assign({}, state);
    newMessageState.data[action.messageKey].deleted = true;
    return newMessageState;
  case GET_MESSAGES:
  default:
    return state;
  }
}

const messageReducers = {
  'messages': messages
}

export default messageReducers
