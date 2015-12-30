import { cleanupAttributes } from '../utilities/reducer'
import {
  RESET_MESSAGES,
  GET_MESSAGES,
  REQUEST_MESSAGES,
  RECEIVE_MESSAGES,
  NO_MESSAGES,
  ERROR_MESSAGES,
  CREATE_MESSAGE,
  DELETE_MESSAGE
} from '../actions';

const initialState = {
  messages: {
    isFetching: false,
    errors: null,
    teams: {},
    lastUpdated: null
  }
};

function addTeamMessage(newMessageTeamState, message, messageId){
  message = cleanupAttributes(message)
  if(newMessageTeamState.hasOwnProperty(message.teamId) === false){
    newMessageTeamState[message.teamId] = {};
  }
  let originalTeamMessage = {}
  if(newMessageTeamState[message.teamId].hasOwnProperty(messageId)){
    originalTeamMessage = newMessageTeamState[message.teamId][messageId]
  }
  newMessageTeamState[message.teamId][messageId] = Object.assign(originalTeamMessage, message)
  return newMessageTeamState
}

function messages(state = initialState.messages, action) {
  switch (action.type) {
  // reset the messages
  case RESET_MESSAGES:
    let resetMessageState = Object.assign({}, initialState.messages);
    if(action.hasOwnProperty('teamId') === true && action.teamId !== null){
      resetMessageState = Object.assign({}, state);
      if(resetMessageState.teams.hasOwnProperty(action.teamId) === true){
        delete resetMessageState.teams[action.teamId];
      }
    }
    return resetMessageState;

  // request the messages
  case REQUEST_MESSAGES:
    return Object.assign({}, state, {
      isFetching: true,
      errors: null,
    });

  // received no the messages
  case NO_MESSAGES:
    return Object.assign({}, state, {
      isFetching: false,
      errors: null,
    });

  // receive the messages
  case RECEIVE_MESSAGES:
    // console.log('message action received: ', action)
    const newReceivedTeamsMessagesState = addTeamMessage(Object.assign({}, state.teams), action.message, action.message.id);
    // console.log(newReceivedTeamsMessagesState)
    return Object.assign({}, state, {
      isFetching: false,
      errors: null,
      teams: newReceivedTeamsMessagesState,
      lastUpdated: (new Date()).toISOString()
    });

  // create message
  case CREATE_MESSAGE:
    const newCreatedTeamsMessagesState = addTeamMessage(Object.assign({}, state.teams), action.message, action.messageId);
    // console.log(action.type, action.messageId)
    return Object.assign({}, state, {
      isFetching: false,
      errors: null,
      teams: newCreatedTeamsMessagesState,
      lastUpdated: (new Date()).toISOString()
    });

  // delete message
  case DELETE_MESSAGE:
    const newDeletedTeamsMessageState = Object.assign({}, state.teams);
    if(newDeletedTeamsMessageState.hasOwnProperty(action.teamId) === true){
      if(newDeletedTeamsMessageState[teamId].hasOwnProperty(messageId) === true){
        delete newDeletedTeamsMessageState[teamId][messageId]
      }
    }
    return Object.assign({}, state, {
      isFetching: false,
      errors: null,
      teams: newDeletedTeamsMessageState,
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
