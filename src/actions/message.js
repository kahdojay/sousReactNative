import murmurhash from 'murmurhash'
import Fetcher from '../utilities/fetcher'
import {
  RESET_MESSAGES,
  GET_MESSAGES,
  REQUEST_MESSAGES,
  RECEIVE_MESSAGES,
  ERROR_MESSAGES,
  ADD_MESSAGE,
  DELETE_MESSAGE
} from './actionTypes'

let SousFetcher = null;

function resetMessages(){
  return {
    type: RESET_MESSAGES
  }
}

function addMessage(message) {
  let newMessage = {}
  let newKey = murmurhash.v3(message).toString(16);
  // TODO: flesh out the required object parameters for the new message
  newMessage[newKey] = {
    key: newKey,
    message: message,
    created_at: (new Date).toISOString(),
    update_at: (new Date).toISOString()
  }
  return {
    type: ADD_MESSAGE,
    message: newMessage
  };
}

function deleteMessage(messageKey) {
  return {
    type: DELETE_MESSAGE,
    messageKey: messageKey
  }
}

function requestMessages() {
  return {
    type: REQUEST_MESSAGES
  }
}

function receiveMessages(messages) {
  return {
    type: RECEIVE_MESSAGES,
    messages: messages
  }
}

function errorMessages(errors){
  return {
    type: ERROR_MESSAGES,
    errors: errors
  }
}

function fetchMessages(user_id){
  return (dispatch) => {
    dispatch(requestMessages())
    return SousFetcher.message.find({
      user_id: user_id,
      requestedAt: (new Date).getTime()
    }).then(res => {
      if (res.success === false) {
        dispatch(errorMessages(res.errors))
      } else {
        dispatch(receiveMessages(res))
      }
    })
  }
}

function getMessages(){
  return (dispatch, getState) => {
    let state = getState()
    SousFetcher = new Fetcher(state)
    return dispatch(fetchMessages(state.session.user_id));
  }
}

export default {
  RESET_MESSAGES,
  GET_MESSAGES,
  REQUEST_MESSAGES,
  RECEIVE_MESSAGES,
  ERROR_MESSAGES,
  ADD_MESSAGE,
  DELETE_MESSAGE,
  addMessage,
  deleteMessage,
  getMessages,
  resetMessages,
}
